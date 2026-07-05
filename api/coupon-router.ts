import { z } from "zod/v4";
import { eq, and, desc } from "drizzle-orm";
import { createRouter, adminQuery, publicQuery } from "./middleware";
import { getDb } from "./queries/connection";
import * as schema from "@db/schema";

export const couponRouter = createRouter({
  // Admin: List all coupons
  list: adminQuery.query(async () => {
    const db = getDb();
    return db
      .select()
      .from(schema.coupons)
      .orderBy(desc(schema.coupons.createdAt));
  }),

  // Admin: Create coupon
  create: adminQuery
    .input(z.object({
      code: z.string().min(1).max(64).transform(v => v.toUpperCase()),
      type: z.enum(["percentage", "fixed", "student_discount", "bulk"]),
      value: z.string(),
      minPurchase: z.string().optional(),
      maxUses: z.number().optional(),
      startsAt: z.string().optional(),
      expiresAt: z.string().optional(),
    }))
    .mutation(async ({ input }) => {
      const db = getDb();
      await db.insert(schema.coupons).values({
        code: input.code,
        type: input.type,
        value: input.value,
        minPurchase: input.minPurchase,
        maxUses: input.maxUses,
        startsAt: input.startsAt ? new Date(input.startsAt) : undefined,
        expiresAt: input.expiresAt ? new Date(input.expiresAt) : undefined,
      });
      return { success: true };
    }),

  // Admin: Update coupon
  update: adminQuery
    .input(z.object({
      id: z.number(),
      code: z.string().max(64).transform(v => v.toUpperCase()).optional(),
      type: z.enum(["percentage", "fixed", "student_discount", "bulk"]).optional(),
      value: z.string().optional(),
      minPurchase: z.string().optional(),
      maxUses: z.number().optional(),
      isActive: z.boolean().optional(),
      startsAt: z.string().optional(),
      expiresAt: z.string().optional(),
    }))
    .mutation(async ({ input }) => {
      const db = getDb();
      const { id, ...data } = input;
      const updateData: any = { ...data };
      if (data.startsAt) updateData.startsAt = new Date(data.startsAt);
      if (data.expiresAt) updateData.expiresAt = new Date(data.expiresAt);
      await db.update(schema.coupons).set(updateData).where(eq(schema.coupons.id, id));
      return { success: true };
    }),

  // Admin: Delete coupon
  delete: adminQuery
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      const db = getDb();
      await db.delete(schema.coupons).where(eq(schema.coupons.id, input.id));
      return { success: true };
    }),

  // Public: Validate a coupon code during checkout
  validate: publicQuery
    .input(z.object({
      code: z.string().min(1).transform(v => v.toUpperCase()),
      cartTotal: z.number(),
      isStudent: z.boolean().optional().default(false),
    }))
    .mutation(async ({ input }) => {
      const db = getDb();
      const [coupon] = await db
        .select()
        .from(schema.coupons)
        .where(and(
          eq(schema.coupons.code, input.code),
          eq(schema.coupons.isActive, true),
        ))
        .limit(1);

      if (!coupon) {
        return { valid: false, message: "Invalid coupon code" };
      }

      // Check expiry
      const now = new Date();
      if (coupon.expiresAt && now > new Date(coupon.expiresAt)) {
        return { valid: false, message: "This coupon has expired" };
      }
      if (coupon.startsAt && now < new Date(coupon.startsAt)) {
        return { valid: false, message: "This coupon is not yet active" };
      }

      // Check usage limit
      if (coupon.maxUses && (coupon.usedCount ?? 0) >= coupon.maxUses) {
        return { valid: false, message: "This coupon has reached its usage limit" };
      }

      // Check min purchase
      if (coupon.minPurchase && input.cartTotal < Number(coupon.minPurchase)) {
        return {
          valid: false,
          message: `Minimum purchase of Rs. ${Number(coupon.minPurchase).toLocaleString()} required`,
        };
      }

      // Student discount check
      if (coupon.type === "student_discount" && !input.isStudent) {
        return { valid: false, message: "This coupon is for students only" };
      }

      // Calculate discount
      let discount = 0;
      if (coupon.type === "percentage" || coupon.type === "student_discount") {
        discount = (input.cartTotal * Number(coupon.value)) / 100;
      } else if (coupon.type === "fixed") {
        discount = Number(coupon.value);
      } else if (coupon.type === "bulk") {
        // Bulk: apply percentage discount
        discount = (input.cartTotal * Number(coupon.value)) / 100;
      }

      // Cap discount at cart total
      discount = Math.min(discount, input.cartTotal);

      return {
        valid: true,
        coupon: {
          id: coupon.id,
          code: coupon.code,
          type: coupon.type,
          value: Number(coupon.value),
          discount,
          finalTotal: input.cartTotal - discount,
        },
      };
    }),

  // Increment coupon usage count after successful order
  applyUsage: publicQuery
    .input(z.object({ couponId: z.number() }))
    .mutation(async ({ input }) => {
      const db = getDb();
      const [coupon] = await db
        .select()
        .from(schema.coupons)
        .where(eq(schema.coupons.id, input.couponId))
        .limit(1);

      if (coupon) {
        const currentCount = coupon.usedCount ?? 0;
        await db
          .update(schema.coupons)
          .set({ usedCount: currentCount + 1 })
          .where(eq(schema.coupons.id, input.couponId));
      }
      return { success: true };
    }),
});
