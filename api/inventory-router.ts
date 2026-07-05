import { z } from "zod/v4";
import { eq, and, desc, sql } from "drizzle-orm";
import { createRouter, adminQuery } from "./middleware";
import { getDb } from "./queries/connection";
import * as schema from "@db/schema";

const productFields = {
  name: z.string().min(1).max(255),
  slug: z.string().min(1).max(255),
  description: z.string().optional(),
  price: z.string(),
  purchasePrice: z.string().optional(),
  discountPrice: z.string().optional(),
  sku: z.string().optional(),
  barcode: z.string().optional(),
  image: z.string().optional(),
  images: z.array(z.string()).optional(),
  categoryId: z.number().optional(),
  stock: z.number().optional(),
  lowStockThreshold: z.number().optional(),
  featured: z.number().optional(),
  studentDiscount: z.boolean().optional(),
  supplier: z.string().optional(),
  isActive: z.boolean().optional(),
};

const productSchema = z.object(productFields);
const productUpdateSchema = z.object({ id: z.number(), ...productFields });

export const inventoryRouter = createRouter({
  // --- Products CRUD ---

  list: adminQuery
    .input(z.object({
      page: z.number().optional().default(1),
      limit: z.number().optional().default(20),
      search: z.string().optional(),
      categoryId: z.number().optional(),
      lowStock: z.boolean().optional(),
      outOfStock: z.boolean().optional(),
      featured: z.boolean().optional(),
    }))
    .query(async ({ input }) => {
      const db = getDb();
      const conditions = [eq(schema.products.isActive, true)];

      if (input.search) {
        conditions.push(
          sql`(${schema.products.name} LIKE ${"%" + input.search + "%"} OR ${schema.products.sku} LIKE ${"%" + input.search + "%"} OR ${schema.products.barcode} LIKE ${"%" + input.search + "%"})`
        );
      }
      if (input.categoryId) {
        conditions.push(eq(schema.products.categoryId, input.categoryId));
      }
      if (input.lowStock) {
        conditions.push(sql`${schema.products.stock} > 0 AND ${schema.products.stock} <= ${schema.products.lowStockThreshold}`);
      }
      if (input.outOfStock) {
        conditions.push(eq(schema.products.stock, 0));
      }
      if (input.featured) {
        conditions.push(eq(schema.products.featured, 1));
      }

      const [data, totalResult] = await Promise.all([
        db
          .select({
            id: schema.products.id,
            name: schema.products.name,
            slug: schema.products.slug,
            description: schema.products.description,
            price: schema.products.price,
            purchasePrice: schema.products.purchasePrice,
            discountPrice: schema.products.discountPrice,
            sku: schema.products.sku,
            barcode: schema.products.barcode,
            image: schema.products.image,
            images: schema.products.images,
            categoryId: schema.products.categoryId,
            stock: schema.products.stock,
            lowStockThreshold: schema.products.lowStockThreshold,
            featured: schema.products.featured,
            studentDiscount: schema.products.studentDiscount,
            supplier: schema.products.supplier,
            isActive: schema.products.isActive,
            createdAt: schema.products.createdAt,
            updatedAt: schema.products.updatedAt,
            categoryName: schema.categories.name,
          })
          .from(schema.products)
          .leftJoin(schema.categories, eq(schema.products.categoryId, schema.categories.id))
          .where(and(...conditions))
          .orderBy(desc(schema.products.createdAt))
          .limit(input.limit)
          .offset((input.page - 1) * input.limit),
        db
          .select({ count: sql<number>`COUNT(*)` })
          .from(schema.products)
          .where(and(...conditions)),
      ]);

      return {
        products: data,
        total: Number(totalResult[0]?.count || 0),
        page: input.page,
      };
    }),

  getById: adminQuery
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const db = getDb();
      const [product] = await db
        .select()
        .from(schema.products)
        .where(eq(schema.products.id, input.id))
        .limit(1);

      if (!product) return null;

      const variants = await db
        .select()
        .from(schema.productVariants)
        .where(eq(schema.productVariants.productId, input.id));

      return { ...product, variants };
    }),

  create: adminQuery
    .input(productSchema)
    .mutation(async ({ input }) => {
      const db = getDb();
      const result = await db.insert(schema.products).values(input as any);
      return { id: Number(result[0].insertId), success: true };
    }),

  update: adminQuery
    .input(productUpdateSchema)
    .mutation(async ({ input }) => {
      const db = getDb();
      const { id, ...data } = input;
      await db.update(schema.products).set(data as any).where(eq(schema.products.id, id));
      return { success: true };
    }),

  delete: adminQuery
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      const db = getDb();
      await db.update(schema.products)
        .set({ isActive: false })
        .where(eq(schema.products.id, input.id));
      return { success: true };
    }),

  toggleFeatured: adminQuery
    .input(z.object({ id: z.number(), featured: z.boolean() }))
    .mutation(async ({ input }) => {
      const db = getDb();
      await db.update(schema.products)
        .set({ featured: input.featured ? 1 : 0 })
        .where(eq(schema.products.id, input.id));
      return { success: true };
    }),

  // --- Variants ---

  getVariants: adminQuery
    .input(z.object({ productId: z.number() }))
    .query(async ({ input }) => {
      const db = getDb();
      return db
        .select()
        .from(schema.productVariants)
        .where(eq(schema.productVariants.productId, input.productId));
    }),

  createVariant: adminQuery
    .input(z.object({
      productId: z.number(),
      name: z.string().min(1),
      sku: z.string().optional(),
      price: z.string().optional(),
      stock: z.number().optional(),
      attributes: z.record(z.string(), z.string()).optional(),
    }))
    .mutation(async ({ input }) => {
      const db = getDb();
      await db.insert(schema.productVariants).values(input as any);
      return { success: true };
    }),

  updateVariant: adminQuery
    .input(z.object({
      id: z.number(),
      name: z.string().optional(),
      sku: z.string().optional(),
      price: z.string().optional(),
      stock: z.number().optional(),
      attributes: z.record(z.string(), z.string()).optional(),
    }))
    .mutation(async ({ input }) => {
      const db = getDb();
      const { id, ...data } = input;
      await db.update(schema.productVariants).set(data as any).where(eq(schema.productVariants.id, id));
      return { success: true };
    }),

  deleteVariant: adminQuery
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      const db = getDb();
      await db.delete(schema.productVariants).where(eq(schema.productVariants.id, input.id));
      return { success: true };
    }),

  // --- Stock Alerts ---

  getLowStockAlerts: adminQuery.query(async () => {
    const db = getDb();
    const [outOfStock, lowStock] = await Promise.all([
      db
        .select()
        .from(schema.products)
        .where(and(eq(schema.products.isActive, true), eq(schema.products.stock, 0)))
        .orderBy(desc(schema.products.updatedAt)),
      db
        .select()
        .from(schema.products)
        .where(and(
          eq(schema.products.isActive, true),
          sql`${schema.products.stock} > 0`,
          sql`${schema.products.stock} <= ${schema.products.lowStockThreshold}`,
        ))
        .orderBy(schema.products.stock),
    ]);
    return { outOfStock, lowStock };
  }),

  // --- Bulk Operations ---

  bulkImport: adminQuery
    .input(z.object({
      products: z.array(z.object({
        name: z.string(),
        slug: z.string(),
        price: z.string(),
        stock: z.number().optional(),
        sku: z.string().optional(),
        categoryId: z.number().optional(),
        supplier: z.string().optional(),
      })),
    }))
    .mutation(async ({ input }) => {
      const db = getDb();
      let imported = 0;
      for (const product of input.products) {
        try {
          await db.insert(schema.products).values(product as any);
          imported++;
        } catch (e) {
          // Skip duplicates
        }
      }
      return { success: true, imported };
    }),

  exportProducts: adminQuery.query(async () => {
    const db = getDb();
    return db
      .select({
        name: schema.products.name,
        slug: schema.products.slug,
        price: schema.products.price,
        sku: schema.products.sku,
        barcode: schema.products.barcode,
        stock: schema.products.stock,
        supplier: schema.products.supplier,
        categoryName: schema.categories.name,
      })
      .from(schema.products)
      .leftJoin(schema.categories, eq(schema.products.categoryId, schema.categories.id))
      .where(eq(schema.products.isActive, true));
  }),
});
