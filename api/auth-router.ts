import * as cookie from "cookie";
import { z } from "zod/v4";
import { eq } from "drizzle-orm";
import { Session } from "@contracts/constants";
import { getSessionCookieOptions } from "./lib/cookies";
import { createRouter, authedQuery, publicQuery } from "./middleware";
import { signSessionToken } from "./kimi/session";
import { findUserByUnionId, upsertUser } from "./queries/users";
import { findUserByEmail, findUserById, upsertProfile } from "./queries/profiles";
import {
  hashPassword,
  verifyPassword,
  generateVerificationToken,
  generateResetToken,
} from "./lib/auth";
import * as schema from "@db/schema";
import { getDb } from "./queries/connection";

// --- Schemas ---

const registerSchema = z.object({
  name: z.string().min(2).max(255),
  email: z.email(),
  password: z.string().min(8).max(128),
});

const loginSchema = z.object({
  email: z.email(),
  password: z.string().min(1),
  rememberMe: z.boolean().optional().default(false),
});

const forgotPasswordSchema = z.object({
  email: z.email(),
});

const resetPasswordSchema = z.object({
  token: z.string().min(1),
  password: z.string().min(8).max(128),
});

const verifyEmailSchema = z.object({
  token: z.string().min(1),
});

// --- Helpers ---

async function createSessionCookie(userId: number, rememberMe: boolean, headers: Headers) {
  const user = await findUserById(userId);
  if (!user) throw new Error("User not found");

  const unionId = user.unionId ?? `local_${userId}`;
  const token = await signSessionToken({
    unionId,
    clientId: process.env.APP_ID || "",
  });

  const opts = getSessionCookieOptions(headers);
  const maxAge = rememberMe
    ? Session.maxAgeMs / 1000
    : 24 * 60 * 60; // 24 hours if not remember me

  return cookie.serialize(Session.cookieName, token, {
    httpOnly: opts.httpOnly,
    path: opts.path,
    sameSite: opts.sameSite?.toLowerCase() as "lax" | "none",
    secure: opts.secure,
    maxAge,
  });
}

// --- Router ---

export const authRouter = createRouter({
  // Get current user
  me: authedQuery.query((opts) => opts.ctx.user),

  // Register with email/password
  register: publicQuery
    .input(registerSchema)
    .mutation(async ({ ctx, input }) => {
      const existingEmail = await findUserByEmail(input.email);
      if (existingEmail) {
        throw new Error("An account with this email already exists");
      }

      const passwordHash = await hashPassword(input.password);
      const { token: verificationToken, expiresAt: verificationTokenExpires } =
        generateVerificationToken();

      // Use a unique unionId for local auth users
      const unionId = `local_${Date.now()}_${Math.random().toString(36).substring(2, 10)}`;

      await upsertUser({
        unionId,
        name: input.name,
        email: input.email,
        passwordHash,
        role: "member",
        verificationToken,
        verificationTokenExpires,
        emailVerified: false,
        lastSignInAt: new Date(),
      });

      const user = await findUserByEmail(input.email);
      if (user) {
        // Create a profile for the user
        await upsertProfile(user.id, {
          displayName: input.name,
          bio: "",
          skills: [],
          socialLinks: {},
          badges: ["new-member"],
        });

        // Set session cookie
        const cookieValue = await createSessionCookie(user.id, false, ctx.req.headers);
        ctx.resHeaders.append("set-cookie", cookieValue);
      }

      // In production, send verification email here
      console.log(`[Auth] Verification token for ${input.email}: ${verificationToken}`);

      return { success: true, message: "Registration successful. Please check your email to verify your account." };
    }),

  // Login with email/password
  login: publicQuery
    .input(loginSchema)
    .mutation(async ({ ctx, input }) => {
      const user = await findUserByEmail(input.email);
      if (!user) {
        throw new Error("Invalid email or password");
      }

      if (!user.passwordHash) {
        throw new Error("This account uses social login. Please sign in with Google or Kimi.");
      }

      const valid = await verifyPassword(input.password, user.passwordHash);
      if (!valid) {
        throw new Error("Invalid email or password");
      }

      // Update last sign in
      await getDb()
        .update(schema.users)
        .set({ lastSignInAt: new Date(), rememberMe: input.rememberMe })
        .where(eq(schema.users.id, user.id));

      const cookieValue = await createSessionCookie(user.id, input.rememberMe, ctx.req.headers);
      ctx.resHeaders.append("set-cookie", cookieValue);

      return { success: true, user };
    }),

  // Login with Google (simplified - generates a session for a Google-authenticated user)
  loginGoogle: publicQuery
    .input(z.object({
      email: z.email(),
      name: z.string().min(1).max(255),
      googleId: z.string().min(1),
      avatar: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const unionId = `google_${input.googleId}`;
      let user = await findUserByUnionId(unionId);

      if (!user) {
        await upsertUser({
          unionId,
          name: input.name,
          email: input.email,
          avatar: input.avatar,
          role: "member",
          emailVerified: true,
          lastSignInAt: new Date(),
        });
        user = await findUserByUnionId(unionId);

        if (user) {
          await upsertProfile(user.id, {
            displayName: input.name,
            bio: "",
            skills: [],
            socialLinks: {},
            badges: ["new-member"],
          });
        }
      } else {
        await getDb()
          .update(schema.users)
          .set({ lastSignInAt: new Date(), name: input.name, avatar: input.avatar })
          .where(eq(schema.users.id, user.id));
      }

      if (!user) throw new Error("Failed to create user");

      const cookieValue = await createSessionCookie(user.id, true, ctx.req.headers);
      ctx.resHeaders.append("set-cookie", cookieValue);

      return { success: true, user };
    }),

  // Logout
  logout: authedQuery.mutation(async ({ ctx }) => {
    const opts = getSessionCookieOptions(ctx.req.headers);
    ctx.resHeaders.append(
      "set-cookie",
      cookie.serialize(Session.cookieName, "", {
        httpOnly: opts.httpOnly,
        path: opts.path,
        sameSite: opts.sameSite?.toLowerCase() as "lax" | "none",
        secure: opts.secure,
        maxAge: 0,
      }),
    );
    return { success: true };
  }),

  // Forgot password
  forgotPassword: publicQuery
    .input(forgotPasswordSchema)
    .mutation(async ({ input }) => {
      const user = await findUserByEmail(input.email);
      if (!user) {
        // Don't reveal whether email exists
        return { success: true, message: "If an account exists, a password reset link has been sent." };
      }

      const { token, expiresAt } = generateResetToken();

      await getDb().insert(schema.passwordResetTokens).values({
        userId: user.id,
        token,
        expiresAt,
      });

      console.log(`[Auth] Password reset token for ${input.email}: ${token}`);
      // In production, send email with reset link

      return { success: true, message: "If an account exists, a password reset link has been sent." };
    }),

  // Reset password
  resetPassword: publicQuery
    .input(resetPasswordSchema)
    .mutation(async ({ input }) => {
      const [resetRecord] = await getDb()
        .select()
        .from(schema.passwordResetTokens)
        .where(eq(schema.passwordResetTokens.token, input.token))
        .limit(1);

      if (!resetRecord || resetRecord.used) {
        throw new Error("Invalid or expired reset token");
      }

      if (new Date() > new Date(resetRecord.expiresAt)) {
        throw new Error("Reset token has expired");
      }

      const passwordHash = await hashPassword(input.password);

      await getDb()
        .update(schema.users)
        .set({ passwordHash })
        .where(eq(schema.users.id, resetRecord.userId));

      await getDb()
        .update(schema.passwordResetTokens)
        .set({ used: true })
        .where(eq(schema.passwordResetTokens.id, resetRecord.id));

      return { success: true, message: "Password has been reset successfully." };
    }),

  // Verify email
  verifyEmail: publicQuery
    .input(verifyEmailSchema)
    .mutation(async ({ input }) => {
      const [user] = await getDb()
        .select()
        .from(schema.users)
        .where(eq(schema.users.verificationToken, input.token))
        .limit(1);

      if (!user || !user.verificationTokenExpires) {
        throw new Error("Invalid or expired verification token");
      }

      if (new Date() > new Date(user.verificationTokenExpires)) {
        throw new Error("Verification token has expired");
      }

      await getDb()
        .update(schema.users)
        .set({
          emailVerified: true,
          verificationToken: null,
          verificationTokenExpires: null,
        })
        .where(eq(schema.users.id, user.id));

      return { success: true, message: "Email verified successfully." };
    }),

  // Resend verification email
  resendVerification: authedQuery
    .mutation(async ({ ctx }) => {
      if (!ctx.user.email) {
        throw new Error("No email address on account");
      }

      if (ctx.user.emailVerified) {
        throw new Error("Email is already verified");
      }

      const { token, expiresAt } = generateVerificationToken();

      await getDb()
        .update(schema.users)
        .set({
          verificationToken: token,
          verificationTokenExpires: expiresAt,
        })
        .where(eq(schema.users.id, ctx.user.id));

      console.log(`[Auth] Verification token for ${ctx.user.email}: ${token}`);
      // In production, send email

      return { success: true, message: "Verification email sent." };
    }),
});
