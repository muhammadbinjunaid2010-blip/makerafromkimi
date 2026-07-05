import { z } from "zod/v4";
import { eq, and, desc } from "drizzle-orm";
import { createRouter, authedQuery } from "./middleware";
import { findProfileByUserId, upsertProfile } from "./queries/profiles";
import * as schema from "@db/schema";
import { getDb } from "./queries/connection";
import { hashPassword, verifyPassword } from "./lib/auth";

const updateProfileSchema = z.object({
  displayName: z.string().max(255).optional(),
  bio: z.string().optional(),
  skills: z.array(z.string()).optional(),
  university: z.string().max(255).optional(),
  github: z.string().max(255).optional(),
  socialLinks: z.record(z.string(), z.string()).optional(),
  avatar: z.string().optional(),
});

export const userRouter = createRouter({
  // --- Profile ---

  getProfile: authedQuery.query(async ({ ctx }) => {
    const profile = await findProfileByUserId(ctx.user.id);
    return {
      user: ctx.user,
      profile: profile ?? {
        userId: ctx.user.id,
        displayName: ctx.user.name,
        bio: null,
        skills: [],
        university: null,
        github: null,
        socialLinks: {},
        badges: [],
      },
    };
  }),

  updateProfile: authedQuery
    .input(updateProfileSchema)
    .mutation(async ({ ctx, input }) => {
      const profile = await upsertProfile(ctx.user.id, input);

      // If displayName is provided, also update the user name
      if (input.displayName) {
        await getDb()
          .update(schema.users)
          .set({ name: input.displayName })
          .where(eq(schema.users.id, ctx.user.id));
      }

      return { success: true, profile };
    }),

  // --- Saved Products / Wishlist ---

  getSavedProducts: authedQuery.query(async ({ ctx }) => {
    const items = await getDb()
      .select()
      .from(schema.savedProducts)
      .where(eq(schema.savedProducts.userId, ctx.user.id))
      .leftJoin(schema.products, eq(schema.savedProducts.productId, schema.products.id));

    return items.map(i => ({
      ...i.saved_products,
      product: i.products,
    }));
  }),

  getWishlist: authedQuery.query(async ({ ctx }) => {
    const items = await getDb()
      .select()
      .from(schema.savedProducts)
      .where(
        and(
          eq(schema.savedProducts.userId, ctx.user.id),
          eq(schema.savedProducts.wishlist, true),
        ),
      )
      .leftJoin(schema.products, eq(schema.savedProducts.productId, schema.products.id));

    return items.map(i => ({
      ...i.saved_products,
      product: i.products,
    }));
  }),

  toggleSaveProduct: authedQuery
    .input(z.object({ productId: z.number(), wishlist: z.boolean().optional() }))
    .mutation(async ({ ctx, input }) => {
      const existing = await getDb()
        .select()
        .from(schema.savedProducts)
        .where(
          and(
            eq(schema.savedProducts.userId, ctx.user.id),
            eq(schema.savedProducts.productId, input.productId),
          ),
        )
        .limit(1);

      if (existing.length > 0) {
        await getDb()
          .delete(schema.savedProducts)
          .where(eq(schema.savedProducts.id, existing[0].id));
        return { saved: false };
      }

      await getDb().insert(schema.savedProducts).values({
        userId: ctx.user.id,
        productId: input.productId,
        wishlist: input.wishlist ?? false,
      });

      return { saved: true };
    }),

  // --- Orders ---

  getOrders: authedQuery.query(async ({ ctx }) => {
    return getDb()
      .select()
      .from(schema.orders)
      .where(eq(schema.orders.userId, ctx.user.id))
      .orderBy(desc(schema.orders.createdAt));
  }),

  getOrderDetails: authedQuery
    .input(z.object({ orderId: z.number() }))
    .query(async ({ ctx, input }) => {
      const [order] = await getDb()
        .select()
        .from(schema.orders)
        .where(
          and(
            eq(schema.orders.id, input.orderId),
            eq(schema.orders.userId, ctx.user.id),
          ),
        )
        .limit(1);

      if (!order) throw new Error("Order not found");

      const items = await getDb()
        .select()
        .from(schema.orderItems)
        .where(eq(schema.orderItems.orderId, order.id));

      return { order, items };
    }),

  // --- User Projects ---

  getMyProjects: authedQuery.query(async ({ ctx }) => {
    return getDb()
      .select()
      .from(schema.userProjects)
      .where(eq(schema.userProjects.userId, ctx.user.id))
      .orderBy(desc(schema.userProjects.createdAt));
  }),

  createProject: authedQuery
    .input(z.object({
      title: z.string().min(1).max(255),
      slug: z.string().min(1).max(255),
      description: z.string().optional(),
      content: z.string().optional(),
      image: z.string().optional(),
      tags: z.array(z.string()).optional(),
      published: z.boolean().optional().default(false),
    }))
    .mutation(async ({ ctx, input }) => {
      await getDb().insert(schema.userProjects).values({
        userId: ctx.user.id,
        ...input,
      });
      return { success: true };
    }),

  updateProject: authedQuery
    .input(z.object({
      id: z.number(),
      title: z.string().max(255).optional(),
      slug: z.string().max(255).optional(),
      description: z.string().optional(),
      content: z.string().optional(),
      image: z.string().optional(),
      tags: z.array(z.string()).optional(),
      published: z.boolean().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input;
      const [existing] = await getDb()
        .select()
        .from(schema.userProjects)
        .where(
          and(
            eq(schema.userProjects.id, id),
            eq(schema.userProjects.userId, ctx.user.id),
          ),
        )
        .limit(1);

      if (!existing) throw new Error("Project not found");

      await getDb()
        .update(schema.userProjects)
        .set(data)
        .where(eq(schema.userProjects.id, id));

      return { success: true };
    }),

  deleteProject: authedQuery
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      await getDb()
        .delete(schema.userProjects)
        .where(
          and(
            eq(schema.userProjects.id, input.id),
            eq(schema.userProjects.userId, ctx.user.id),
          ),
        );
      return { success: true };
    }),

  // --- Saved Projects ---

  getSavedProjects: authedQuery.query(async ({ ctx }) => {
    const items = await getDb()
      .select()
      .from(schema.savedProjects)
      .where(eq(schema.savedProjects.userId, ctx.user.id))
      .leftJoin(schema.userProjects, eq(schema.savedProjects.projectId, schema.userProjects.id));

    return items.map(i => ({
      ...i.saved_projects,
      project: i.user_projects,
    }));
  }),

  toggleSaveProject: authedQuery
    .input(z.object({ projectId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const existing = await getDb()
        .select()
        .from(schema.savedProjects)
        .where(
          and(
            eq(schema.savedProjects.userId, ctx.user.id),
            eq(schema.savedProjects.projectId, input.projectId),
          ),
        )
        .limit(1);

      if (existing.length > 0) {
        await getDb()
          .delete(schema.savedProjects)
          .where(eq(schema.savedProjects.id, existing[0].id));
        return { saved: false };
      }

      await getDb().insert(schema.savedProjects).values({
        userId: ctx.user.id,
        projectId: input.projectId,
      });

      return { saved: true };
    }),

  // --- User Blogs ---

  getMyBlogs: authedQuery.query(async ({ ctx }) => {
    return getDb()
      .select()
      .from(schema.userBlogs)
      .where(eq(schema.userBlogs.userId, ctx.user.id))
      .orderBy(desc(schema.userBlogs.createdAt));
  }),

  createBlog: authedQuery
    .input(z.object({
      title: z.string().min(1).max(255),
      slug: z.string().min(1).max(255),
      excerpt: z.string().optional(),
      content: z.string().optional(),
      image: z.string().optional(),
      tags: z.array(z.string()).optional(),
      published: z.boolean().optional().default(false),
    }))
    .mutation(async ({ ctx, input }) => {
      await getDb().insert(schema.userBlogs).values({
        userId: ctx.user.id,
        ...input,
      });
      return { success: true };
    }),

  updateBlog: authedQuery
    .input(z.object({
      id: z.number(),
      title: z.string().max(255).optional(),
      slug: z.string().max(255).optional(),
      excerpt: z.string().optional(),
      content: z.string().optional(),
      image: z.string().optional(),
      tags: z.array(z.string()).optional(),
      published: z.boolean().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input;
      const [existing] = await getDb()
        .select()
        .from(schema.userBlogs)
        .where(
          and(
            eq(schema.userBlogs.id, id),
            eq(schema.userBlogs.userId, ctx.user.id),
          ),
        )
        .limit(1);

      if (!existing) throw new Error("Blog not found");

      await getDb()
        .update(schema.userBlogs)
        .set(data)
        .where(eq(schema.userBlogs.id, id));

      return { success: true };
    }),

  deleteBlog: authedQuery
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      await getDb()
        .delete(schema.userBlogs)
        .where(
          and(
            eq(schema.userBlogs.id, input.id),
            eq(schema.userBlogs.userId, ctx.user.id),
          ),
        );
      return { success: true };
    }),

  // --- Saved Blogs ---

  getSavedBlogs: authedQuery.query(async ({ ctx }) => {
    const items = await getDb()
      .select()
      .from(schema.savedBlogs)
      .where(eq(schema.savedBlogs.userId, ctx.user.id))
      .leftJoin(schema.userBlogs, eq(schema.savedBlogs.blogId, schema.userBlogs.id));

    return items.map(i => ({
      ...i.saved_blogs,
      blog: i.user_blogs,
    }));
  }),

  toggleSaveBlog: authedQuery
    .input(z.object({ blogId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const existing = await getDb()
        .select()
        .from(schema.savedBlogs)
        .where(
          and(
            eq(schema.savedBlogs.userId, ctx.user.id),
            eq(schema.savedBlogs.blogId, input.blogId),
          ),
        )
        .limit(1);

      if (existing.length > 0) {
        await getDb()
          .delete(schema.savedBlogs)
          .where(eq(schema.savedBlogs.id, existing[0].id));
        return { saved: false };
      }

      await getDb().insert(schema.savedBlogs).values({
        userId: ctx.user.id,
        blogId: input.blogId,
      });

      return { saved: true };
    }),

  // --- Notifications ---

  getNotifications: authedQuery.query(async ({ ctx }) => {
    const [notifications, unreadCount] = await Promise.all([
      getDb()
        .select()
        .from(schema.notifications)
        .where(eq(schema.notifications.userId, ctx.user.id))
        .orderBy(desc(schema.notifications.createdAt))
        .limit(50),
      getDb()
        .select({ count: schema.notifications.id })
        .from(schema.notifications)
        .where(
          and(
            eq(schema.notifications.userId, ctx.user.id),
            eq(schema.notifications.read, false),
          ),
        ),
    ]);

    return {
      notifications,
      unreadCount: unreadCount.length,
    };
  }),

  markNotificationRead: authedQuery
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      await getDb()
        .update(schema.notifications)
        .set({ read: true })
        .where(
          and(
            eq(schema.notifications.id, input.id),
            eq(schema.notifications.userId, ctx.user.id),
          ),
        );
      return { success: true };
    }),

  markAllNotificationsRead: authedQuery.mutation(async ({ ctx }) => {
    await getDb()
      .update(schema.notifications)
      .set({ read: true })
      .where(
        and(
          eq(schema.notifications.userId, ctx.user.id),
          eq(schema.notifications.read, false),
        ),
      );
    return { success: true };
  }),

  // --- Account Settings ---

  updateSettings: authedQuery
    .input(z.object({
      name: z.string().max(255).optional(),
      email: z.string().email().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      await getDb()
        .update(schema.users)
        .set(input)
        .where(eq(schema.users.id, ctx.user.id));
      return { success: true };
    }),

  changePassword: authedQuery
    .input(z.object({
      currentPassword: z.string().min(1),
      newPassword: z.string().min(8).max(128),
    }))
    .mutation(async ({ ctx, input }) => {
      const [userRecord] = await getDb()
        .select()
        .from(schema.users)
        .where(eq(schema.users.id, ctx.user.id))
        .limit(1);

      if (!userRecord || !userRecord.passwordHash) {
        throw new Error("Cannot change password for social login accounts");
      }

      const valid = await verifyPassword(input.currentPassword, userRecord.passwordHash);
      if (!valid) {
        throw new Error("Current password is incorrect");
      }

      const passwordHash = await hashPassword(input.newPassword);

      await getDb()
        .update(schema.users)
        .set({ passwordHash })
        .where(eq(schema.users.id, ctx.user.id));

      return { success: true };
    }),

  // --- Dashboard Stats ---

  getDashboardStats: authedQuery.query(async ({ ctx }) => {
    const userId = ctx.user.id;

    const [orderCount, projectCount, blogCount, savedCount, notificationCount] =
      await Promise.all([
        getDb()
          .select({ count: schema.orders.id })
          .from(schema.orders)
          .where(eq(schema.orders.userId, userId)),
        getDb()
          .select({ count: schema.userProjects.id })
          .from(schema.userProjects)
          .where(eq(schema.userProjects.userId, userId)),
        getDb()
          .select({ count: schema.userBlogs.id })
          .from(schema.userBlogs)
          .where(eq(schema.userBlogs.userId, userId)),
        getDb()
          .select({ count: schema.savedProducts.id })
          .from(schema.savedProducts)
          .where(eq(schema.savedProducts.userId, userId)),
        getDb()
          .select({ count: schema.notifications.id })
          .from(schema.notifications)
          .where(
            and(
              eq(schema.notifications.userId, userId),
              eq(schema.notifications.read, false),
            ),
          ),
      ]);

    return {
      orderCount: orderCount.length,
      projectCount: projectCount.length,
      blogCount: blogCount.length,
      savedCount: savedCount.length,
      unreadNotifications: notificationCount.length,
    };
  }),
});
