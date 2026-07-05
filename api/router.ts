import { authRouter } from "./auth-router";
import { productRouter } from "./product-router";
import { categoryRouter } from "./category-router";
import { cartRouter } from "./cart-router";
import { orderRouter } from "./order-router";
import { userRouter } from "./user-router";
import { adminRouter } from "./admin-router";
import { inventoryRouter } from "./inventory-router";
import { couponRouter } from "./coupon-router";
import { gamificationRouter } from "./gamification-router";
import { createRouter, publicQuery } from "./middleware";

export const appRouter = createRouter({
  ping: publicQuery.query(() => ({ ok: true, ts: Date.now() })),
  auth: authRouter,
  product: productRouter,
  category: categoryRouter,
  cart: cartRouter,
  order: orderRouter,
  user: userRouter,
  admin: adminRouter,
  inventory: inventoryRouter,
  coupon: couponRouter,
  gamification: gamificationRouter,
});

export type AppRouter = typeof appRouter;
