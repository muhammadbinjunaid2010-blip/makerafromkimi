import { z } from "zod";
import { eq, and } from "drizzle-orm";
import { createRouter, publicQuery } from "./middleware";
import { getDb } from "./queries/connection";
import { cartItems, products } from "@db/schema";

export const cartRouter = createRouter({
  list: publicQuery
    .input(z.object({ sessionId: z.string() }))
    .query(async ({ input }) => {
      const db = getDb();
      const result = await db
        .select({
          id: cartItems.id,
          productId: cartItems.productId,
          quantity: cartItems.quantity,
          productName: products.name,
          productPrice: products.price,
          productImage: products.image,
          productStock: products.stock,
        })
        .from(cartItems)
        .leftJoin(products, eq(cartItems.productId, products.id))
        .where(eq(cartItems.sessionId, input.sessionId));

      return result;
    }),

  add: publicQuery
    .input(
      z.object({
        sessionId: z.string(),
        productId: z.number(),
        quantity: z.number().min(1).default(1),
      })
    )
    .mutation(async ({ input }) => {
      const db = getDb();

      // Check if item already in cart
      const existing = await db
        .select()
        .from(cartItems)
        .where(
          and(
            eq(cartItems.sessionId, input.sessionId),
            eq(cartItems.productId, input.productId)
          )
        )
        .limit(1);

      if (existing.length > 0) {
        // Update quantity
        await db
          .update(cartItems)
          .set({ quantity: existing[0].quantity + input.quantity })
          .where(eq(cartItems.id, existing[0].id));

        return { success: true, action: "updated" as const };
      }

      // Insert new item
      await db.insert(cartItems).values({
        sessionId: input.sessionId,
        productId: input.productId,
        quantity: input.quantity,
      });

      return { success: true, action: "added" as const };
    }),

  update: publicQuery
    .input(
      z.object({
        id: z.number(),
        quantity: z.number().min(1),
      })
    )
    .mutation(async ({ input }) => {
      const db = getDb();
      await db
        .update(cartItems)
        .set({ quantity: input.quantity })
        .where(eq(cartItems.id, input.id));

      return { success: true };
    }),

  remove: publicQuery
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      const db = getDb();
      await db.delete(cartItems).where(eq(cartItems.id, input.id));
      return { success: true };
    }),

  clear: publicQuery
    .input(z.object({ sessionId: z.string() }))
    .mutation(async ({ input }) => {
      const db = getDb();
      await db.delete(cartItems).where(eq(cartItems.sessionId, input.sessionId));
      return { success: true };
    }),
});
