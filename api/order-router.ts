import { z } from "zod";
import { eq } from "drizzle-orm";
import { createRouter, publicQuery } from "./middleware";
import { getDb } from "./queries/connection";
import { orders, orderItems } from "@db/schema";

export const orderRouter = createRouter({
  create: publicQuery
    .input(
      z.object({
        sessionId: z.string().optional(),
        fullName: z.string().min(1),
        email: z.string().email(),
        phone: z.string().optional(),
        address: z.string().optional(),
        city: z.string().optional(),
        totalAmount: z.string(),
        paymentMethod: z.string().optional(),
        notes: z.string().optional(),
        items: z.array(
          z.object({
            productId: z.number(),
            productName: z.string(),
            quantity: z.number(),
            unitPrice: z.string(),
          })
        ),
      })
    )
    .mutation(async ({ input }) => {
      const db = getDb();

      // Create order
      const orderResult = await db.insert(orders).values({
        sessionId: input.sessionId ?? null,
        fullName: input.fullName,
        email: input.email,
        phone: input.phone ?? null,
        address: input.address ?? null,
        city: input.city ?? null,
        totalAmount: input.totalAmount,
        paymentMethod: input.paymentMethod ?? null,
        notes: input.notes ?? null,
      });

      const orderId = Number(orderResult[0].insertId);

      // Create order items
      for (const item of input.items) {
        await db.insert(orderItems).values({
          orderId,
          productId: item.productId,
          productName: item.productName,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
        });
      }

      return { id: orderId, success: true };
    }),

  getById: publicQuery
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const db = getDb();
      const order = await db
        .select()
        .from(orders)
        .where(eq(orders.id, input.id))
        .limit(1);

      if (!order[0]) return null;

      const items = await db
        .select()
        .from(orderItems)
        .where(eq(orderItems.orderId, input.id));

      return { ...order[0], items };
    }),
});
