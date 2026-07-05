import { z } from "zod/v4";
import { eq, and, desc, gte, lte, sql } from "drizzle-orm";
import { createRouter, adminQuery } from "./middleware";
import { getDb } from "./queries/connection";
import * as schema from "@db/schema";

export const adminRouter = createRouter({
  // --- Dashboard Stats ---

  getDashboardStats: adminQuery.query(async () => {
    const db = getDb();
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const [
      totalRevenue,
      monthRevenue,
      totalOrders,
      pendingOrders,
      totalProducts,
      outOfStock,
      lowStock,
      totalUsers,
      totalProjects,
      totalBlogs,
      pendingProjects,
      pendingBlogs,
    ] = await Promise.all([
      db
        .select({ total: sql<number>`COALESCE(SUM(${schema.orders.totalAmount}), 0)` })
        .from(schema.orders)
        .where(sql`${schema.orders.status} != 'cancelled'`),
      db
        .select({ total: sql<number>`COALESCE(SUM(${schema.orders.totalAmount}), 0)` })
        .from(schema.orders)
        .where(and(
          sql`${schema.orders.status} != 'cancelled'`,
          gte(schema.orders.createdAt, startOfMonth),
        )),
      db
        .select({ count: sql<number>`COUNT(*)` })
        .from(schema.orders),
      db
        .select({ count: sql<number>`COUNT(*)` })
        .from(schema.orders)
        .where(eq(schema.orders.status, "pending")),
      db
        .select({ count: sql<number>`COUNT(*)` })
        .from(schema.products)
        .where(eq(schema.products.isActive, true)),
      db
        .select({ count: sql<number>`COUNT(*)` })
        .from(schema.products)
        .where(and(eq(schema.products.isActive, true), eq(schema.products.stock, 0))),
      db
        .select({ count: sql<number>`COUNT(*)` })
        .from(schema.products)
        .where(and(
          eq(schema.products.isActive, true),
          sql`${schema.products.stock} > 0`,
          sql`${schema.products.stock} <= ${schema.products.lowStockThreshold}`,
        )),
      db
        .select({ count: sql<number>`COUNT(*)` })
        .from(schema.users),
      db
        .select({ count: sql<number>`COUNT(*)` })
        .from(schema.userProjects),
      db
        .select({ count: sql<number>`COUNT(*)` })
        .from(schema.userBlogs),
      db
        .select({ count: sql<number>`COUNT(*)` })
        .from(schema.userProjects)
        .where(eq(schema.userProjects.published, false)),
      db
        .select({ count: sql<number>`COUNT(*)` })
        .from(schema.userBlogs)
        .where(eq(schema.userBlogs.published, false)),
    ]);

    return {
      totalRevenue: parseFloat(String(totalRevenue[0]?.total || 0)),
      monthRevenue: parseFloat(String(monthRevenue[0]?.total || 0)),
      totalOrders: Number(totalOrders[0]?.count || 0),
      pendingOrders: Number(pendingOrders[0]?.count || 0),
      totalProducts: Number(totalProducts[0]?.count || 0),
      outOfStock: Number(outOfStock[0]?.count || 0),
      lowStock: Number(lowStock[0]?.count || 0),
      totalUsers: Number(totalUsers[0]?.count || 0),
      totalProjects: Number(totalProjects[0]?.count || 0),
      totalBlogs: Number(totalBlogs[0]?.count || 0),
      pendingProjects: Number(pendingProjects[0]?.count || 0),
      pendingBlogs: Number(pendingBlogs[0]?.count || 0),
    };
  }),

  // --- Recent Orders ---
  getRecentOrders: adminQuery.query(async () => {
    const db = getDb();
    return db
      .select()
      .from(schema.orders)
      .orderBy(desc(schema.orders.createdAt))
      .limit(20);
  }),

  // --- All Orders (paginated) ---
  getAllOrders: adminQuery
    .input(z.object({
      page: z.number().optional().default(1),
      limit: z.number().optional().default(20),
      status: z.string().optional(),
    }))
    .query(async ({ input }) => {
      const db = getDb();
      const conditions = [];
      if (input.status && input.status !== "all") {
        conditions.push(eq(schema.orders.status, input.status as any));
      }

      const query = db
        .select()
        .from(schema.orders)
        .orderBy(desc(schema.orders.createdAt));

      const countQuery = db
        .select({ count: sql<number>`COUNT(*)` })
        .from(schema.orders);

      if (conditions.length > 0) {
        query.where(and(...conditions));
        countQuery.where(and(...conditions));
      }

      const [data, totalResult] = await Promise.all([
        query.limit(input.limit).offset((input.page - 1) * input.limit),
        countQuery,
      ]);

      return {
        orders: data,
        total: Number(totalResult[0]?.count || 0),
        page: input.page,
        limit: input.limit,
      };
    }),

  // --- Update Order Status ---
  updateOrderStatus: adminQuery
    .input(z.object({
      id: z.number(),
      status: z.enum(["pending", "processing", "shipped", "delivered", "cancelled"]),
    }))
    .mutation(async ({ input }) => {
      const db = getDb();
      await db
        .update(schema.orders)
        .set({ status: input.status })
        .where(eq(schema.orders.id, input.id));
      return { success: true };
    }),

  // --- Refund Requests ---
  getRefundRequests: adminQuery.query(async () => {
    const db = getDb();
    return db
      .select()
      .from(schema.refundRequests)
      .orderBy(desc(schema.refundRequests.createdAt))
      .leftJoin(schema.orders, eq(schema.refundRequests.orderId, schema.orders.id));
  }),

  processRefund: adminQuery
    .input(z.object({
      id: z.number(),
      status: z.enum(["approved", "rejected", "processed"]),
      adminNote: z.string().optional(),
    }))
    .mutation(async ({ input }) => {
      const db = getDb();
      await db
        .update(schema.refundRequests)
        .set({ status: input.status, adminNote: input.adminNote })
        .where(eq(schema.refundRequests.id, input.id));
      return { success: true };
    }),

  // --- Users Management ---
  getUsers: adminQuery
    .input(z.object({
      page: z.number().optional().default(1),
      limit: z.number().optional().default(20),
    }))
    .query(async ({ input }) => {
      const db = getDb();
      const [data, totalResult] = await Promise.all([
        db
          .select()
          .from(schema.users)
          .orderBy(desc(schema.users.createdAt))
          .limit(input.limit)
          .offset((input.page - 1) * input.limit),
        db.select({ count: sql<number>`COUNT(*)` }).from(schema.users),
      ]);
      return {
        users: data,
        total: Number(totalResult[0]?.count || 0),
      };
    }),

  updateUserRole: adminQuery
    .input(z.object({
      userId: z.number(),
      role: z.enum(["user", "admin", "moderator", "member"]),
    }))
    .mutation(async ({ input }) => {
      const db = getDb();
      await db
        .update(schema.users)
        .set({ role: input.role })
        .where(eq(schema.users.id, input.userId));
      return { success: true };
    }),

  // --- Content Moderation ---
  getPendingContent: adminQuery.query(async () => {
    const db = getDb();
    const [pendingProjects, pendingBlogs] = await Promise.all([
      db
        .select()
        .from(schema.userProjects)
        .where(eq(schema.userProjects.status, "pending"))
        .orderBy(desc(schema.userProjects.createdAt)),
      db
        .select()
        .from(schema.userBlogs)
        .where(eq(schema.userBlogs.status, "pending"))
        .orderBy(desc(schema.userBlogs.createdAt)),
    ]);
    return { pendingProjects, pendingBlogs };
  }),

  getAllContent: adminQuery.query(async () => {
    const db = getDb();
    const [allProjects, allBlogs] = await Promise.all([
      db
        .select()
        .from(schema.userProjects)
        .orderBy(desc(schema.userProjects.createdAt)),
      db
        .select()
        .from(schema.userBlogs)
        .orderBy(desc(schema.userBlogs.createdAt)),
    ]);
    return { allProjects, allBlogs };
  }),

  approveProject: adminQuery
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      const db = getDb();
      await db
        .update(schema.userProjects)
        .set({ status: "approved", published: true, adminFeedback: null })
        .where(eq(schema.userProjects.id, input.id));
      return { success: true };
    }),

  approveBlog: adminQuery
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      const db = getDb();
      await db
        .update(schema.userBlogs)
        .set({ status: "approved", published: true, adminFeedback: null })
        .where(eq(schema.userBlogs.id, input.id));
      return { success: true };
    }),

  rejectContent: adminQuery
    .input(z.object({
      type: z.enum(["project", "blog"]),
      id: z.number(),
      feedback: z.string().optional(),
    }))
    .mutation(async ({ input }) => {
      const db = getDb();
      if (input.type === "project") {
        await db
          .update(schema.userProjects)
          .set({ status: "rejected", adminFeedback: input.feedback })
          .where(eq(schema.userProjects.id, input.id));
      } else {
        await db
          .update(schema.userBlogs)
          .set({ status: "rejected", adminFeedback: input.feedback })
          .where(eq(schema.userBlogs.id, input.id));
      }
      return { success: true };
    }),

  requestChanges: adminQuery
    .input(z.object({
      type: z.enum(["project", "blog"]),
      id: z.number(),
      feedback: z.string(),
    }))
    .mutation(async ({ input }) => {
      const db = getDb();
      if (input.type === "project") {
        await db
          .update(schema.userProjects)
          .set({ status: "changes_requested", adminFeedback: input.feedback })
          .where(eq(schema.userProjects.id, input.id));
      } else {
        await db
          .update(schema.userBlogs)
          .set({ status: "changes_requested", adminFeedback: input.feedback })
          .where(eq(schema.userBlogs.id, input.id));
      }
      return { success: true };
    }),

  deleteUserContent: adminQuery
    .input(z.object({
      type: z.enum(["project", "blog"]),
      id: z.number(),
    }))
    .mutation(async ({ input }) => {
      const db = getDb();
      if (input.type === "project") {
        await db.delete(schema.userProjects).where(eq(schema.userProjects.id, input.id));
      } else {
        await db.delete(schema.userBlogs).where(eq(schema.userBlogs.id, input.id));
      }
      return { success: true };
    }),

  toggleFeaturedProject: adminQuery
    .input(z.object({ id: z.number(), featured: z.boolean() }))
    .mutation(async ({ input }) => {
      const db = getDb();
      await db
        .update(schema.userProjects)
        .set({ featured: input.featured })
        .where(eq(schema.userProjects.id, input.id));
      return { success: true };
    }),

  // --- Competitions ---
  getCompetitionEntries: adminQuery
    .input(z.object({ competitionId: z.number() }))
    .query(async ({ input }) => {
      const db = getDb();
      return db
        .select()
        .from(schema.competitionEntries)
        .where(eq(schema.competitionEntries.competitionId, input.competitionId))
        .orderBy(desc(schema.competitionEntries.createdAt));
    }),

  selectWinner: adminQuery
    .input(z.object({
      entryId: z.number(),
      place: z.number().min(1).max(3),
    }))
    .mutation(async ({ input }) => {
      const db = getDb();
      const [entry] = await db
        .select()
        .from(schema.competitionEntries)
        .where(eq(schema.competitionEntries.id, input.entryId))
        .limit(1);
      if (!entry) throw new Error("Entry not found");

      await db
        .update(schema.competitionEntries)
        .set({ isWinner: true, winnerPlace: input.place })
        .where(eq(schema.competitionEntries.id, input.entryId));

      // Auto-feature the winner as a creator
      const [existing] = await db
        .select()
        .from(schema.featuredCreators)
        .where(eq(schema.featuredCreators.userId, entry.userId))
        .limit(1);

      if (!existing) {
        await db.insert(schema.featuredCreators).values({
          userId: entry.userId,
          reason: `Winner of competition: ${entry.competitionId}`,
        });
      }

      return { success: true };
    }),

  removeWinner: adminQuery
    .input(z.object({ entryId: z.number() }))
    .mutation(async ({ input }) => {
      const db = getDb();
      await db
        .update(schema.competitionEntries)
        .set({ isWinner: false, winnerPlace: null })
        .where(eq(schema.competitionEntries.id, input.entryId));
      return { success: true };
    }),

  // --- Featured Creators ---
  getFeaturedCreators: adminQuery.query(async () => {
    const db = getDb();
    return db
      .select()
      .from(schema.featuredCreators)
      .where(eq(schema.featuredCreators.isActive, true))
      .leftJoin(schema.users, eq(schema.featuredCreators.userId, schema.users.id));
  }),

  addFeaturedCreator: adminQuery
    .input(z.object({
      userId: z.number(),
      reason: z.string().optional(),
    }))
    .mutation(async ({ input }) => {
      const db = getDb();
      const [existing] = await db
        .select()
        .from(schema.featuredCreators)
        .where(eq(schema.featuredCreators.userId, input.userId))
        .limit(1);
      if (existing) {
        await db
          .update(schema.featuredCreators)
          .set({ isActive: true, reason: input.reason })
          .where(eq(schema.featuredCreators.id, existing.id));
      } else {
        await db.insert(schema.featuredCreators).values(input);
      }
      return { success: true };
    }),

  removeFeaturedCreator: adminQuery
    .input(z.object({ userId: z.number() }))
    .mutation(async ({ input }) => {
      const db = getDb();
      await db
        .update(schema.featuredCreators)
        .set({ isActive: false })
        .where(eq(schema.featuredCreators.userId, input.userId));
      return { success: true };
    }),

  // --- Comments & Reports ---
  getComments: adminQuery
    .input(z.object({
      contentType: z.string(),
      contentId: z.number(),
    }))
    .query(async ({ input }) => {
      const db = getDb();
      return db
        .select()
        .from(schema.comments)
        .where(and(
          eq(schema.comments.contentType, input.contentType),
          eq(schema.comments.contentId, input.contentId),
        ))
        .orderBy(desc(schema.comments.createdAt));
    }),

  moderateComment: adminQuery
    .input(z.object({ id: z.number(), moderated: z.boolean() }))
    .mutation(async ({ input }) => {
      const db = getDb();
      await db
        .update(schema.comments)
        .set({ moderated: input.moderated })
        .where(eq(schema.comments.id, input.id));
      return { success: true };
    }),

  deleteComment: adminQuery
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      const db = getDb();
      await db.delete(schema.comments).where(eq(schema.comments.id, input.id));
      return { success: true };
    }),

  getReports: adminQuery.query(async () => {
    const db = getDb();
    return db
      .select()
      .from(schema.reports)
      .orderBy(desc(schema.reports.createdAt));
  }),

  updateReport: adminQuery
    .input(z.object({
      id: z.number(),
      status: z.enum(["reviewed", "dismissed", "actioned"]),
      adminNote: z.string().optional(),
    }))
    .mutation(async ({ input }) => {
      const db = getDb();
      await db
        .update(schema.reports)
        .set({ status: input.status, adminNote: input.adminNote })
        .where(eq(schema.reports.id, input.id));
      return { success: true };
    }),

  // --- Competitions ---
  getCompetitions: adminQuery.query(async () => {
    const db = getDb();
    return db.select().from(schema.competitions).orderBy(desc(schema.competitions.createdAt));
  }),

  createCompetition: adminQuery
    .input(z.object({
      title: z.string().min(1).max(255),
      description: z.string().optional(),
      prize: z.string().optional(),
      difficulty: z.string().optional(),
      startsAt: z.string().optional(),
      endsAt: z.string().optional(),
    }))
    .mutation(async ({ input }) => {
      const db = getDb();
      await db.insert(schema.competitions).values({
        title: input.title,
        description: input.description,
        prize: input.prize,
        difficulty: input.difficulty,
        startsAt: input.startsAt ? new Date(input.startsAt) : undefined,
        endsAt: input.endsAt ? new Date(input.endsAt) : undefined,
      });
      return { success: true };
    }),

  updateCompetition: adminQuery
    .input(z.object({
      id: z.number(),
      title: z.string().max(255).optional(),
      description: z.string().optional(),
      prize: z.string().optional(),
      difficulty: z.string().optional(),
      isActive: z.boolean().optional(),
      startsAt: z.string().optional(),
      endsAt: z.string().optional(),
    }))
    .mutation(async ({ input }) => {
      const db = getDb();
      const { id, ...data } = input;
      const updateData: any = { ...data };
      if (data.startsAt) updateData.startsAt = new Date(data.startsAt);
      if (data.endsAt) updateData.endsAt = new Date(data.endsAt);
      await db.update(schema.competitions).set(updateData).where(eq(schema.competitions.id, id));
      return { success: true };
    }),

  // --- Analytics ---
  getAnalytics: adminQuery
    .input(z.object({
      from: z.string().optional(),
      to: z.string().optional(),
    }))
    .query(async ({ input }) => {
      const db = getDb();
      const from = input.from ? new Date(input.from) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
      const to = input.to ? new Date(input.to) : new Date();

      const [dailyOrders, topProducts, revenueData] = await Promise.all([
        db
          .select({
            date: sql<string>`DATE(${schema.orders.createdAt})`,
            count: sql<number>`COUNT(*)`,
            revenue: sql<number>`COALESCE(SUM(${schema.orders.totalAmount}), 0)`,
          })
          .from(schema.orders)
          .where(and(
            gte(schema.orders.createdAt, from),
            lte(schema.orders.createdAt, to),
          ))
          .groupBy(sql`DATE(${schema.orders.createdAt})`)
          .orderBy(sql`DATE(${schema.orders.createdAt})`),
        db
          .select({
            productId: schema.orderItems.productId,
            productName: schema.orderItems.productName,
            totalSold: sql<number>`SUM(${schema.orderItems.quantity})`,
            revenue: sql<number>`COALESCE(SUM(${schema.orderItems.unitPrice} * ${schema.orderItems.quantity}), 0)`,
          })
          .from(schema.orderItems)
          .groupBy(schema.orderItems.productId)
          .orderBy(desc(sql`SUM(${schema.orderItems.quantity})`))
          .limit(20),
        db
          .select({
            date: sql<string>`DATE(${schema.orders.createdAt})`,
            revenue: sql<number>`COALESCE(SUM(${schema.orders.totalAmount}), 0)`,
          })
          .from(schema.orders)
          .where(and(
            gte(schema.orders.createdAt, from),
            lte(schema.orders.createdAt, to),
            sql`${schema.orders.status} != 'cancelled'`,
          ))
          .groupBy(sql`DATE(${schema.orders.createdAt})`)
          .orderBy(sql`DATE(${schema.orders.createdAt})`),
      ]);

      return { dailyOrders, topProducts, revenueData };
    }),

  // --- Community Statistics ---
  getCommunityStats: adminQuery.query(async () => {
    const db = getDb();
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    const [
      totalMembers,
      activeMembers,
      projectsSubmitted,
      projectsApproved,
      blogsSubmitted,
      blogsApproved,
      competitionEntryCount,
      projects,
      blogs,
      entries,
    ] = await Promise.all([
      db.select({ count: sql<number>`COUNT(*)` }).from(schema.users),
      db
        .select({ count: sql<number>`COUNT(*)` })
        .from(schema.users)
        .where(gte(schema.users.lastSignInAt, thirtyDaysAgo)),
      db.select({ count: sql<number>`COUNT(*)` }).from(schema.userProjects),
      db
        .select({ count: sql<number>`COUNT(*)` })
        .from(schema.userProjects)
        .where(eq(schema.userProjects.status, "approved")),
      db.select({ count: sql<number>`COUNT(*)` }).from(schema.userBlogs),
      db
        .select({ count: sql<number>`COUNT(*)` })
        .from(schema.userBlogs)
        .where(eq(schema.userBlogs.status, "approved")),
      db.select({ count: sql<number>`COUNT(*)` }).from(schema.competitionEntries),
      db
        .select({
          userId: schema.userProjects.userId,
          count: sql<number>`COUNT(*)`,
        })
        .from(schema.userProjects)
        .groupBy(schema.userProjects.userId)
        .orderBy(desc(sql`COUNT(*)`))
        .limit(10),
      db
        .select({
          userId: schema.userBlogs.userId,
          count: sql<number>`COUNT(*)`,
        })
        .from(schema.userBlogs)
        .groupBy(schema.userBlogs.userId)
        .orderBy(desc(sql`COUNT(*)`))
        .limit(10),
      db
        .select({
          userId: schema.competitionEntries.userId,
          count: sql<number>`COUNT(*)`,
        })
        .from(schema.competitionEntries)
        .groupBy(schema.competitionEntries.userId)
        .orderBy(desc(sql`COUNT(*)`))
        .limit(10),
    ]);

    // Merge contributor counts
    const contributorMap = new Map<number, number>();
    for (const row of [...projects, ...blogs, ...entries]) {
      contributorMap.set(row.userId, (contributorMap.get(row.userId) || 0) + Number(row.count));
    }
    const activeContributors = Array.from(contributorMap.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([userId, contributions]) => ({ userId, contributions }));

    return {
      totalMembers: Number(totalMembers[0]?.count || 0),
      activeMembers: Number(activeMembers[0]?.count || 0),
      projectsSubmitted: Number(projectsSubmitted[0]?.count || 0),
      projectsApproved: Number(projectsApproved[0]?.count || 0),
      blogsSubmitted: Number(blogsSubmitted[0]?.count || 0),
      blogsApproved: Number(blogsApproved[0]?.count || 0),
      competitionEntries: Number(competitionEntryCount[0]?.count || 0),
      activeContributors,
    };
  }),

  // --- Popular Content ---
  getPopularContent: adminQuery.query(async () => {
    const db = getDb();
    const [popularProjects, popularBlogs] = await Promise.all([
      db
        .select()
        .from(schema.userProjects)
        .where(eq(schema.userProjects.status, "approved"))
        .orderBy(desc(schema.userProjects.createdAt))
        .limit(10),
      db
        .select()
        .from(schema.userBlogs)
        .where(eq(schema.userBlogs.status, "approved"))
        .orderBy(desc(schema.userBlogs.createdAt))
        .limit(10),
    ]);
    return { popularProjects, popularBlogs };
  }),

  // --- Admin Settings ---
  getSettings: adminQuery.query(async () => {
    const db = getDb();
    const rows = await db
      .select()
      .from(schema.adminSettings)
      .limit(1);
    return rows[0] || null;
  }),

  updateSettings: adminQuery
    .input(z.object({
      siteName: z.string().optional(),
      siteDescription: z.string().optional(),
      logo: z.string().optional(),
      favicon: z.string().optional(),
      primaryColor: z.string().optional(),
      heroTitle: z.string().optional(),
      heroSubtitle: z.string().optional(),
      heroCtaText: z.string().optional(),
      heroCtaLink: z.string().optional(),
      heroBackgroundImage: z.string().optional(),
      socialGithub: z.string().optional(),
      socialDiscord: z.string().optional(),
      socialLinkedin: z.string().optional(),
      socialYoutube: z.string().optional(),
      socialWhatsapp: z.string().optional(),
      seoTitle: z.string().optional(),
      seoDescription: z.string().optional(),
      seoKeywords: z.array(z.string()).optional(),
      emailFrom: z.string().optional(),
      emailFooter: z.string().optional(),
      emailLogo: z.string().optional(),
      showHero: z.boolean().optional(),
      showCategories: z.boolean().optional(),
      showFeaturedProducts: z.boolean().optional(),
      showFeaturedProjects: z.boolean().optional(),
      showLatestBlogs: z.boolean().optional(),
      showWhyChooseUs: z.boolean().optional(),
      showTrustedBy: z.boolean().optional(),
      showCTA: z.boolean().optional(),
    }))
    .mutation(async ({ input }) => {
      const db = getDb();
      const existing = await db
        .select()
        .from(schema.adminSettings)
        .limit(1);
      if (existing.length > 0) {
        await db
          .update(schema.adminSettings)
          .set(input as any)
          .where(eq(schema.adminSettings.id, existing[0].id));
      } else {
        await db.insert(schema.adminSettings).values(input as any);
      }
      return { success: true };
    }),

  // --- Category Management ---
  createCategory: adminQuery
    .input(z.object({
      name: z.string().min(1).max(128),
      slug: z.string().min(1).max(128),
      description: z.string().optional(),
      icon: z.string().optional(),
    }))
    .mutation(async ({ input }) => {
      const db = getDb();
      await db.insert(schema.categories).values(input);
      return { success: true };
    }),

  updateCategory: adminQuery
    .input(z.object({
      id: z.number(),
      name: z.string().max(128).optional(),
      slug: z.string().max(128).optional(),
      description: z.string().optional(),
      icon: z.string().optional(),
    }))
    .mutation(async ({ input }) => {
      const db = getDb();
      const { id, ...data } = input;
      await db.update(schema.categories).set(data).where(eq(schema.categories.id, id));
      return { success: true };
    }),

  deleteCategory: adminQuery
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      const db = getDb();
      await db.delete(schema.categories).where(eq(schema.categories.id, input.id));
      return { success: true };
    }),
});
