import {
  mysqlTable,
  mysqlEnum,
  serial,
  varchar,
  text,
  timestamp,
  bigint,
  int,
  decimal,
  boolean,
  json,
  index,
} from "drizzle-orm/mysql-core";

// ── Core Tables ──

export const users = mysqlTable("users", {
  id: serial("id").primaryKey(),
  unionId: varchar("unionId", { length: 255 }).unique(),
  name: varchar("name", { length: 255 }),
  email: varchar("email", { length: 320 }),
  emailVerified: boolean("emailVerified").default(false).notNull(),
  verificationToken: varchar("verificationToken", { length: 255 }),
  verificationTokenExpires: timestamp("verificationTokenExpires"),
  passwordHash: text("passwordHash"),
  avatar: text("avatar"),
  role: mysqlEnum("role", ["user", "admin", "moderator", "member"]).default("member").notNull(),
  rememberMe: boolean("rememberMe").default(false),
  resetToken: varchar("resetToken", { length: 255 }),
  resetTokenExpires: timestamp("resetTokenExpires"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt")
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
  lastSignInAt: timestamp("lastSignInAt").defaultNow().notNull(),
});

export const passwordResetTokens = mysqlTable("password_reset_tokens", {
  id: serial("id").primaryKey(),
  userId: bigint("userId", { mode: "number", unsigned: true }).notNull(),
  token: varchar("token", { length: 255 }).notNull().unique(),
  expiresAt: timestamp("expiresAt").notNull(),
  used: boolean("used").default(false).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const profiles = mysqlTable("profiles", {
  id: serial("id").primaryKey(),
  userId: bigint("userId", { mode: "number", unsigned: true }).notNull().unique(),
  displayName: varchar("displayName", { length: 255 }),
  bio: text("bio"),
  skills: json("skills").$type<string[]>().default([]),
  university: varchar("university", { length: 255 }),
  github: varchar("github", { length: 255 }),
  socialLinks: json("socialLinks").$type<Record<string, string>>().default({}),
  badges: json("badges").$type<string[]>().default([]),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt")
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
});

export const savedProducts = mysqlTable("saved_products", {
  id: serial("id").primaryKey(),
  userId: bigint("userId", { mode: "number", unsigned: true }).notNull(),
  productId: bigint("productId", { mode: "number", unsigned: true }).notNull(),
  wishlist: boolean("wishlist").default(false).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
}, (table) => ({
  userProductIdx: index("user_product_idx").on(table.userId, table.productId),
}));

export const savedBlogs = mysqlTable("saved_blogs", {
  id: serial("id").primaryKey(),
  userId: bigint("userId", { mode: "number", unsigned: true }).notNull(),
  blogId: bigint("blogId", { mode: "number", unsigned: true }).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
}, (table) => ({
  userBlogIdx: index("user_blog_idx").on(table.userId, table.blogId),
}));

export const savedProjects = mysqlTable("saved_projects", {
  id: serial("id").primaryKey(),
  userId: bigint("userId", { mode: "number", unsigned: true }).notNull(),
  projectId: bigint("projectId", { mode: "number", unsigned: true }).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
}, (table) => ({
  userProjectIdx: index("user_project_idx").on(table.userId, table.projectId),
}));

export const notifications = mysqlTable("notifications", {
  id: serial("id").primaryKey(),
  userId: bigint("userId", { mode: "number", unsigned: true }).notNull(),
  type: varchar("type", { length: 64 }).notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  message: text("message"),
  read: boolean("read").default(false).notNull(),
  link: varchar("link", { length: 255 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
}, (table) => ({
  userNotifIdx: index("user_notif_idx").on(table.userId, table.read),
}));

// ── Categories ──

export const categories = mysqlTable("categories", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 128 }).notNull(),
  slug: varchar("slug", { length: 128 }).notNull().unique(),
  description: varchar("description", { length: 255 }),
  icon: varchar("icon", { length: 64 }),
  itemCount: int("itemCount").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

// ── Products ──

export const products = mysqlTable("products", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  description: text("description"),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  purchasePrice: decimal("purchasePrice", { precision: 10, scale: 2 }),
  discountPrice: decimal("discountPrice", { precision: 10, scale: 2 }),
  sku: varchar("sku", { length: 128 }).unique(),
  barcode: varchar("barcode", { length: 128 }),
  image: varchar("image", { length: 255 }),
  images: json("images").$type<string[]>().default([]),
  categoryId: bigint("categoryId", { mode: "number", unsigned: true }),
  stock: int("stock").default(0).notNull(),
  lowStockThreshold: int("lowStockThreshold").default(10).notNull(),
  featured: int("featured").default(0).notNull(),
  studentDiscount: boolean("studentDiscount").default(false),
  supplier: varchar("supplier", { length: 255 }),
  isActive: boolean("isActive").default(true),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt")
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
});

// ── Cart ──

export const cartItems = mysqlTable("cart_items", {
  id: serial("id").primaryKey(),
  userId: bigint("userId", { mode: "number", unsigned: true }),
  sessionId: varchar("sessionId", { length: 255 }),
  productId: bigint("productId", { mode: "number", unsigned: true }).notNull(),
  quantity: int("quantity").default(1).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt")
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
});

// ── Orders ──

export const orders = mysqlTable("orders", {
  id: serial("id").primaryKey(),
  userId: bigint("userId", { mode: "number", unsigned: true }),
  sessionId: varchar("sessionId", { length: 255 }),
  fullName: varchar("fullName", { length: 255 }).notNull(),
  email: varchar("email", { length: 320 }).notNull(),
  phone: varchar("phone", { length: 32 }),
  address: text("address"),
  city: varchar("city", { length: 128 }),
  totalAmount: decimal("totalAmount", { precision: 10, scale: 2 }).notNull(),
  status: mysqlEnum("status", ["pending", "processing", "shipped", "delivered", "cancelled"]).default("pending").notNull(),
  paymentMethod: varchar("paymentMethod", { length: 64 }),
  notes: text("notes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt")
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
});

export const orderItems = mysqlTable("order_items", {
  id: serial("id").primaryKey(),
  orderId: bigint("orderId", { mode: "number", unsigned: true }).notNull(),
  productId: bigint("productId", { mode: "number", unsigned: true }).notNull(),
  productName: varchar("productName", { length: 255 }).notNull(),
  quantity: int("quantity").notNull(),
  unitPrice: decimal("unitPrice", { precision: 10, scale: 2 }).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

// ── User Content ──

export const userProjects = mysqlTable("user_projects", {
  id: serial("id").primaryKey(),
  userId: bigint("userId", { mode: "number", unsigned: true }).notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  description: text("description"),
  content: text("content"),
  image: varchar("image", { length: 255 }),
  tags: json("tags").$type<string[]>().default([]),
  category: varchar("category", { length: 128 }),
  difficulty: varchar("difficulty", { length: 64 }),
  componentsUsed: text("componentsUsed"),
  status: mysqlEnum("status", ["draft", "pending", "approved", "rejected", "changes_requested"]).default("pending").notNull(),
  adminFeedback: text("adminFeedback"),
  featured: boolean("featured").default(false).notNull(),
  published: boolean("published").default(false).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt")
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
});

export const userBlogs = mysqlTable("user_blogs", {
  id: serial("id").primaryKey(),
  userId: bigint("userId", { mode: "number", unsigned: true }).notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  excerpt: text("excerpt"),
  content: text("content"),
  image: varchar("image", { length: 255 }),
  tags: json("tags").$type<string[]>().default([]),
  category: varchar("category", { length: 128 }),
  seoTitle: varchar("seoTitle", { length: 255 }),
  seoDescription: text("seoDescription"),
  seoKeywords: json("seoKeywords").$type<string[]>().default([]),
  status: mysqlEnum("status", ["draft", "pending", "approved", "rejected", "changes_requested"]).default("pending").notNull(),
  adminFeedback: text("adminFeedback"),
  published: boolean("published").default(false).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt")
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
});

// ── Product Variants ──

export const productVariants = mysqlTable("product_variants", {
  id: serial("id").primaryKey(),
  productId: bigint("productId", { mode: "number", unsigned: true }).notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  sku: varchar("sku", { length: 128 }),
  price: decimal("price", { precision: 10, scale: 2 }),
  stock: int("stock").default(0),
  attributes: json("attributes").$type<Record<string, string>>().default({}),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt")
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
});

// ── Coupons ──

export const coupons = mysqlTable("coupons", {
  id: serial("id").primaryKey(),
  code: varchar("code", { length: 64 }).notNull().unique(),
  type: mysqlEnum("type", ["percentage", "fixed", "student_discount", "bulk"]).notNull(),
  value: decimal("value", { precision: 10, scale: 2 }).notNull(),
  minPurchase: decimal("minPurchase", { precision: 10, scale: 2 }),
  maxUses: int("maxUses"),
  usedCount: int("usedCount").default(0),
  isActive: boolean("isActive").default(true),
  startsAt: timestamp("startsAt"),
  expiresAt: timestamp("expiresAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt")
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
});

// ── Refund Requests ──

export const refundRequests = mysqlTable("refund_requests", {
  id: serial("id").primaryKey(),
  orderId: bigint("orderId", { mode: "number", unsigned: true }).notNull(),
  reason: text("reason").notNull(),
  status: mysqlEnum("status", ["pending", "approved", "rejected", "processed"]).default("pending").notNull(),
  adminNote: text("adminNote"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt")
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
});

// ── Comments ──

export const comments = mysqlTable("comments", {
  id: serial("id").primaryKey(),
  userId: bigint("userId", { mode: "number", unsigned: true }).notNull(),
  contentType: varchar("contentType", { length: 64 }).notNull(),
  contentId: bigint("contentId", { mode: "number", unsigned: true }).notNull(),
  body: text("body").notNull(),
  parentId: bigint("parentId", { mode: "number", unsigned: true }),
  moderated: boolean("moderated").default(false).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt")
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
}, (table) => ({
  contentIdx: index("content_idx").on(table.contentType, table.contentId),
}));

// ── Reports ──

export const reports = mysqlTable("reports", {
  id: serial("id").primaryKey(),
  reporterId: bigint("reporterId", { mode: "number", unsigned: true }).notNull(),
  contentType: varchar("contentType", { length: 64 }).notNull(),
  contentId: bigint("contentId", { mode: "number", unsigned: true }).notNull(),
  reason: varchar("reason", { length: 255 }).notNull(),
  description: text("description"),
  status: mysqlEnum("status", ["pending", "reviewed", "dismissed", "actioned"]).default("pending").notNull(),
  adminNote: text("adminNote"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt")
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
});

// ── Competitions ──

export const competitions = mysqlTable("competitions", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  prize: varchar("prize", { length: 255 }),
  difficulty: varchar("difficulty", { length: 64 }),
  startsAt: timestamp("startsAt"),
  endsAt: timestamp("endsAt"),
  isActive: boolean("isActive").default(true),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt")
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
});

export const competitionEntries = mysqlTable("competition_entries", {
  id: serial("id").primaryKey(),
  competitionId: bigint("competitionId", { mode: "number", unsigned: true }).notNull(),
  userId: bigint("userId", { mode: "number", unsigned: true }).notNull(),
  projectId: bigint("projectId", { mode: "number", unsigned: true }),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  image: varchar("image", { length: 255 }),
  isWinner: boolean("isWinner").default(false).notNull(),
  winnerPlace: int("winnerPlace"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
}, (table) => ({
  compEntryIdx: index("comp_entry_idx").on(table.competitionId, table.userId),
}));

// ── Featured Creators ──

export const featuredCreators = mysqlTable("featured_creators", {
  id: serial("id").primaryKey(),
  userId: bigint("userId", { mode: "number", unsigned: true }).notNull().unique(),
  reason: text("reason"),
  isActive: boolean("isActive").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

// ── Admin Settings ──

export const adminSettings = mysqlTable("admin_settings", {
  id: serial("id").primaryKey(),
  siteName: varchar("siteName", { length: 255 }).default("Makera"),
  siteDescription: text("siteDescription"),
  logo: varchar("logo", { length: 255 }),
  favicon: varchar("favicon", { length: 255 }),
  primaryColor: varchar("primaryColor", { length: 64 }).default("#2563eb"),
  heroTitle: varchar("heroTitle", { length: 255 }),
  heroSubtitle: text("heroSubtitle"),
  heroCtaText: varchar("heroCtaText", { length: 128 }),
  heroCtaLink: varchar("heroCtaLink", { length: 255 }),
  heroBackgroundImage: varchar("heroBackgroundImage", { length: 255 }),
  socialGithub: varchar("socialGithub", { length: 255 }),
  socialDiscord: varchar("socialDiscord", { length: 255 }),
  socialLinkedin: varchar("socialLinkedin", { length: 255 }),
  socialYoutube: varchar("socialYoutube", { length: 255 }),
  socialWhatsapp: varchar("socialWhatsapp", { length: 255 }),
  seoTitle: varchar("seoTitle", { length: 255 }),
  seoDescription: text("seoDescription"),
  seoKeywords: json("seoKeywords").$type<string[]>().default([]),
  emailFrom: varchar("emailFrom", { length: 255 }),
  emailFooter: text("emailFooter"),
  emailLogo: varchar("emailLogo", { length: 255 }),
  showHero: boolean("showHero").default(true),
  showCategories: boolean("showCategories").default(true),
  showFeaturedProducts: boolean("showFeaturedProducts").default(true),
  showFeaturedProjects: boolean("showFeaturedProjects").default(true),
  showLatestBlogs: boolean("showLatestBlogs").default(true),
  showWhyChooseUs: boolean("showWhyChooseUs").default(true),
  showTrustedBy: boolean("showTrustedBy").default(true),
  showCTA: boolean("showCTA").default(true),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt")
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
});

// ── Analytics Events ──

export const analyticsEvents = mysqlTable("analytics_events", {
  id: serial("id").primaryKey(),
  event: varchar("event", { length: 128 }).notNull(),
  userId: bigint("userId", { mode: "number", unsigned: true }),
  sessionId: varchar("sessionId", { length: 255 }),
  data: json("data").$type<Record<string, any>>().default({}),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
}, (table) => ({
  eventIdx: index("event_idx").on(table.event, table.createdAt),
}));

// ════════════════════════════════════════════
// GAMIFICATION TABLES
// ════════════════════════════════════════════

// Gamification — XP Log
export const xpLog = mysqlTable("xp_log", {
  id: serial("id").primaryKey(),
  userId: bigint("userId", { mode: "number", unsigned: true }).notNull(),
  action: varchar("action", { length: 64 }).notNull(),
  xpEarned: int("xpEarned").notNull(),
  description: varchar("description", { length: 255 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
}, (table) => ({
  userXpIdx: index("user_xp_idx").on(table.userId, table.createdAt),
}));

// Gamification — User Stats
export const userGamification = mysqlTable("user_gamification", {
  id: serial("id").primaryKey(),
  userId: bigint("userId", { mode: "number", unsigned: true }).notNull().unique(),
  totalXp: int("totalXp").default(0).notNull(),
  level: int("level").default(1).notNull(),
  reputationTitle: varchar("reputationTitle", { length: 64 }).default("Beginner Maker"),
  points: int("points").default(0).notNull(),
  loyaltyStamps: int("loyaltyStamps").default(0).notNull(),
  totalPurchases: int("totalPurchases").default(0).notNull(),
  streak: int("streak").default(0).notNull(),
  lastDailyDate: varchar("lastDailyDate", { length: 16 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt")
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
});

// Gamification — Badges
export const badges = mysqlTable("badges", {
  id: serial("id").primaryKey(),
  slug: varchar("slug", { length: 64 }).notNull().unique(),
  name: varchar("name", { length: 128 }).notNull(),
  description: varchar("description", { length: 255 }),
  icon: varchar("icon", { length: 64 }),
  category: varchar("category", { length: 64 }),
  requirementType: varchar("requirementType", { length: 64 }),
  requirementValue: int("requirementValue").default(1),
  xpReward: int("xpReward").default(0),
  isActive: boolean("isActive").default(true),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

// Gamification — User Badges
export const userBadges = mysqlTable("user_badges", {
  id: serial("id").primaryKey(),
  userId: bigint("userId", { mode: "number", unsigned: true }).notNull(),
  badgeId: bigint("badgeId", { mode: "number", unsigned: true }).notNull(),
  earnedAt: timestamp("earnedAt").defaultNow().notNull(),
}, (table) => ({
  userBadgeIdx: index("user_badge_idx").on(table.userId, table.badgeId),
}));

// Gamification — Achievements
export const achievements = mysqlTable("achievements", {
  id: serial("id").primaryKey(),
  slug: varchar("slug", { length: 64 }).notNull().unique(),
  name: varchar("name", { length: 128 }).notNull(),
  description: varchar("description", { length: 255 }),
  icon: varchar("icon", { length: 64 }),
  category: varchar("category", { length: 64 }),
  requirementType: varchar("requirementType", { length: 64 }),
  requirementGoal: int("requirementGoal").notNull(),
  xpReward: int("xpReward").default(0),
  pointsReward: int("pointsReward").default(0),
  isActive: boolean("isActive").default(true),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

// Gamification — User Achievement Progress
export const userAchievements = mysqlTable("user_achievements", {
  id: serial("id").primaryKey(),
  userId: bigint("userId", { mode: "number", unsigned: true }).notNull(),
  achievementId: bigint("achievementId", { mode: "number", unsigned: true }).notNull(),
  progress: int("progress").default(0).notNull(),
  completed: boolean("completed").default(false).notNull(),
  completedAt: timestamp("completedAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt")
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
}, (table) => ({
  userAchievementIdx: index("user_achievement_idx").on(table.userId, table.achievementId),
}));

// Gamification — Reputation Levels
export const reputationLevels = mysqlTable("reputation_levels", {
  id: serial("id").primaryKey(),
  level: int("level").notNull().unique(),
  title: varchar("title", { length: 64 }).notNull(),
  minXp: int("minXp").notNull(),
  badgeIcon: varchar("badgeIcon", { length: 64 }),
  borderColor: varchar("borderColor", { length: 32 }),
  unlocks: json("unlocks").$type<string[]>().default([]),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

// Gamification — Loyalty Rewards (tiers)
export const loyaltyTiers = mysqlTable("loyalty_tiers", {
  id: serial("id").primaryKey(),
  requiredStamps: int("requiredStamps").notNull(),
  rewardType: varchar("rewardType", { length: 64 }).notNull(),
  rewardValue: varchar("rewardValue", { length: 128 }).notNull(),
  description: varchar("description", { length: 255 }),
  isActive: boolean("isActive").default(true),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

// Gamification — Points Store Rewards
export const storeRewards = mysqlTable("store_rewards", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 128 }).notNull(),
  description: varchar("description", { length: 255 }),
  pointsCost: int("pointsCost").notNull(),
  rewardType: varchar("rewardType", { length: 64 }).notNull(),
  rewardValue: varchar("rewardValue", { length: 128 }),
  icon: varchar("icon", { length: 64 }),
  stock: int("stock").default(-1),
  isActive: boolean("isActive").default(true),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

// Gamification — User Redemptions
export const userRedemptions = mysqlTable("user_redemptions", {
  id: serial("id").primaryKey(),
  userId: bigint("userId", { mode: "number", unsigned: true }).notNull(),
  rewardId: bigint("rewardId", { mode: "number", unsigned: true }).notNull(),
  pointsSpent: int("pointsSpent").notNull(),
  redeemedAt: timestamp("redeemedAt").defaultNow().notNull(),
  used: boolean("used").default(false),
});

// Gamification — Referrals
export const referrals = mysqlTable("referrals", {
  id: serial("id").primaryKey(),
  referrerId: bigint("referrerId", { mode: "number", unsigned: true }).notNull(),
  refereeId: bigint("refereeId", { mode: "number", unsigned: true }).notNull().unique(),
  refereeOrdered: boolean("refereeOrdered").default(false),
  referrerXpAwarded: boolean("referrerXpAwarded").default(false),
  refereeXpAwarded: boolean("refereeXpAwarded").default(false),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

// Gamification — Referral Codes
export const referralCodes = mysqlTable("referral_codes", {
  id: serial("id").primaryKey(),
  userId: bigint("userId", { mode: "number", unsigned: true }).notNull().unique(),
  code: varchar("code", { length: 32 }).notNull().unique(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

// Gamification — Daily Missions
export const dailyMissions = mysqlTable("daily_missions", {
  id: serial("id").primaryKey(),
  slug: varchar("slug", { length: 64 }).notNull().unique(),
  title: varchar("title", { length: 128 }).notNull(),
  description: varchar("description", { length: 255 }),
  icon: varchar("icon", { length: 64 }),
  xpReward: int("xpReward").default(10).notNull(),
  pointsReward: int("pointsReward").default(0),
  isActive: boolean("isActive").default(true),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

// Gamification — User Mission Completions
export const userMissions = mysqlTable("user_missions", {
  id: serial("id").primaryKey(),
  userId: bigint("userId", { mode: "number", unsigned: true }).notNull(),
  missionId: bigint("missionId", { mode: "number", unsigned: true }).notNull(),
  completedAt: timestamp("completedAt").defaultNow().notNull(),
  date: varchar("date", { length: 16 }).notNull(),
}, (table) => ({
  userMissionIdx: index("user_mission_idx").on(table.userId, table.date),
}));

// Gamification — Weekly Challenges
export const weeklyChallenges = mysqlTable("weekly_challenges", {
  id: serial("id").primaryKey(),
  slug: varchar("slug", { length: 64 }).notNull().unique(),
  title: varchar("title", { length: 128 }).notNull(),
  description: varchar("description", { length: 255 }),
  icon: varchar("icon", { length: 64 }),
  requirementType: varchar("requirementType", { length: 64 }),
  requirementGoal: int("requirementGoal").notNull(),
  xpReward: int("xpReward").default(50).notNull(),
  pointsReward: int("pointsReward").default(0),
  startsAt: timestamp("startsAt"),
  endsAt: timestamp("endsAt"),
  isActive: boolean("isActive").default(true),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

// Gamification — User Weekly Challenge Progress
export const userWeeklyChallenges = mysqlTable("user_weekly_challenges", {
  id: serial("id").primaryKey(),
  userId: bigint("userId", { mode: "number", unsigned: true }).notNull(),
  challengeId: bigint("challengeId", { mode: "number", unsigned: true }).notNull(),
  progress: int("progress").default(0).notNull(),
  completed: boolean("completed").default(false).notNull(),
  completedAt: timestamp("completedAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt")
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
}, (table) => ({
  userChallengeIdx: index("user_challenge_idx").on(table.userId, table.challengeId),
}));

// Gamification — Monthly Challenges
export const monthlyChallenges = mysqlTable("monthly_challenges", {
  id: serial("id").primaryKey(),
  slug: varchar("slug", { length: 64 }).notNull().unique(),
  title: varchar("title", { length: 128 }).notNull(),
  description: varchar("description", { length: 255 }),
  icon: varchar("icon", { length: 64 }),
  requirementType: varchar("requirementType", { length: 64 }),
  requirementGoal: int("requirementGoal").notNull(),
  xpReward: int("xpReward").default(200).notNull(),
  pointsReward: int("pointsReward").default(0),
  badgeRewardSlug: varchar("badgeRewardSlug", { length: 64 }),
  month: varchar("month", { length: 8 }),
  isActive: boolean("isActive").default(true),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

// Gamification — User Monthly Challenge Progress
export const userMonthlyChallenges = mysqlTable("user_monthly_challenges", {
  id: serial("id").primaryKey(),
  userId: bigint("userId", { mode: "number", unsigned: true }).notNull(),
  challengeId: bigint("challengeId", { mode: "number", unsigned: true }).notNull(),
  progress: int("progress").default(0).notNull(),
  completed: boolean("completed").default(false).notNull(),
  completedAt: timestamp("completedAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt")
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
}, (table) => ({
  userMonthlyIdx: index("user_monthly_idx").on(table.userId, table.challengeId),
}));

// Gamification — Maker Spotlight
export const makerSpotlight = mysqlTable("maker_spotlight", {
  id: serial("id").primaryKey(),
  userId: bigint("userId", { mode: "number", unsigned: true }).notNull().unique(),
  reason: text("reason"),
  month: varchar("month", { length: 8 }).notNull(),
  isAutoGenerated: boolean("isAutoGenerated").default(false),
  isActive: boolean("isActive").default(true),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

// Gamification — Certificates
export const certificates = mysqlTable("certificates", {
  id: serial("id").primaryKey(),
  userId: bigint("userId", { mode: "number", unsigned: true }).notNull(),
  type: varchar("type", { length: 64 }).notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  issuedBy: varchar("issuedBy", { length: 128 }),
  certificateUrl: varchar("certificateUrl", { length: 255 }),
  issuedAt: timestamp("issuedAt").defaultNow().notNull(),
});

// Gamification — XP Config (admin editable)
export const xpConfig = mysqlTable("xp_config", {
  id: serial("id").primaryKey(),
  action: varchar("action", { length: 64 }).notNull().unique(),
  xpValue: int("xpValue").notNull(),
  description: varchar("description", { length: 255 }),
  updatedAt: timestamp("updatedAt")
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
});

// ════════════════════════════════════════════
// TYPE EXPORTS
// ════════════════════════════════════════════

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;
export type PasswordResetToken = typeof passwordResetTokens.$inferSelect;
export type InsertPasswordResetToken = typeof passwordResetTokens.$inferInsert;
export type Profile = typeof profiles.$inferSelect;
export type InsertProfile = typeof profiles.$inferInsert;
export type SavedProduct = typeof savedProducts.$inferSelect;
export type InsertSavedProduct = typeof savedProducts.$inferInsert;
export type UserProject = typeof userProjects.$inferSelect;
export type InsertUserProject = typeof userProjects.$inferInsert;
export type UserBlog = typeof userBlogs.$inferSelect;
export type InsertUserBlog = typeof userBlogs.$inferInsert;
export type SavedBlog = typeof savedBlogs.$inferSelect;
export type InsertSavedBlog = typeof savedBlogs.$inferInsert;
export type SavedProject = typeof savedProjects.$inferSelect;
export type InsertSavedProject = typeof savedProjects.$inferInsert;
export type Notification = typeof notifications.$inferSelect;
export type InsertNotification = typeof notifications.$inferInsert;
export type Category = typeof categories.$inferSelect;
export type InsertCategory = typeof categories.$inferInsert;
export type Product = typeof products.$inferSelect;
export type InsertProduct = typeof products.$inferInsert;
export type CartItem = typeof cartItems.$inferSelect;
export type InsertCartItem = typeof cartItems.$inferInsert;
export type Order = typeof orders.$inferSelect;
export type InsertOrder = typeof orders.$inferInsert;
export type OrderItem = typeof orderItems.$inferSelect;
export type InsertOrderItem = typeof orderItems.$inferInsert;
export type ProductVariant = typeof productVariants.$inferSelect;
export type InsertProductVariant = typeof productVariants.$inferInsert;
export type Coupon = typeof coupons.$inferSelect;
export type InsertCoupon = typeof coupons.$inferInsert;
export type RefundRequest = typeof refundRequests.$inferSelect;
export type InsertRefundRequest = typeof refundRequests.$inferInsert;
export type Competition = typeof competitions.$inferSelect;
export type InsertCompetition = typeof competitions.$inferInsert;
export type Comment = typeof comments.$inferSelect;
export type InsertComment = typeof comments.$inferInsert;
export type Report = typeof reports.$inferSelect;
export type InsertReport = typeof reports.$inferInsert;
export type FeaturedCreator = typeof featuredCreators.$inferSelect;
export type InsertFeaturedCreator = typeof featuredCreators.$inferInsert;
export type CompetitionEntry = typeof competitionEntries.$inferSelect;
export type InsertCompetitionEntry = typeof competitionEntries.$inferInsert;
export type AdminSetting = typeof adminSettings.$inferSelect;
export type InsertAdminSetting = typeof adminSettings.$inferInsert;
export type AnalyticsEvent = typeof analyticsEvents.$inferSelect;
export type InsertAnalyticsEvent = typeof analyticsEvents.$inferInsert;

// ── Gamification Types ──
export type XpLog = typeof xpLog.$inferSelect;
export type InsertXpLog = typeof xpLog.$inferInsert;
export type UserGamification = typeof userGamification.$inferSelect;
export type InsertUserGamification = typeof userGamification.$inferInsert;
export type Badge = typeof badges.$inferSelect;
export type InsertBadge = typeof badges.$inferInsert;
export type UserBadge = typeof userBadges.$inferSelect;
export type InsertUserBadge = typeof userBadges.$inferInsert;
export type Achievement = typeof achievements.$inferSelect;
export type InsertAchievement = typeof achievements.$inferInsert;
export type UserAchievement = typeof userAchievements.$inferSelect;
export type InsertUserAchievement = typeof userAchievements.$inferInsert;
export type ReputationLevel = typeof reputationLevels.$inferSelect;
export type InsertReputationLevel = typeof reputationLevels.$inferInsert;
export type LoyaltyTier = typeof loyaltyTiers.$inferSelect;
export type InsertLoyaltyTier = typeof loyaltyTiers.$inferInsert;
export type StoreReward = typeof storeRewards.$inferSelect;
export type InsertStoreReward = typeof storeRewards.$inferInsert;
export type UserRedemption = typeof userRedemptions.$inferSelect;
export type InsertUserRedemption = typeof userRedemptions.$inferInsert;
export type Referral = typeof referrals.$inferSelect;
export type InsertReferral = typeof referrals.$inferInsert;
export type ReferralCode = typeof referralCodes.$inferSelect;
export type InsertReferralCode = typeof referralCodes.$inferInsert;
export type DailyMission = typeof dailyMissions.$inferSelect;
export type InsertDailyMission = typeof dailyMissions.$inferInsert;
export type UserMission = typeof userMissions.$inferSelect;
export type InsertUserMission = typeof userMissions.$inferInsert;
export type WeeklyChallenge = typeof weeklyChallenges.$inferSelect;
export type InsertWeeklyChallenge = typeof weeklyChallenges.$inferInsert;
export type UserWeeklyChallenge = typeof userWeeklyChallenges.$inferSelect;
export type InsertUserWeeklyChallenge = typeof userWeeklyChallenges.$inferInsert;
export type MonthlyChallenge = typeof monthlyChallenges.$inferSelect;
export type InsertMonthlyChallenge = typeof monthlyChallenges.$inferInsert;
export type UserMonthlyChallenge = typeof userMonthlyChallenges.$inferSelect;
export type InsertUserMonthlyChallenge = typeof userMonthlyChallenges.$inferInsert;
export type MakerSpotlight = typeof makerSpotlight.$inferSelect;
export type InsertMakerSpotlight = typeof makerSpotlight.$inferInsert;
export type Certificate = typeof certificates.$inferSelect;
export type InsertCertificate = typeof certificates.$inferInsert;
export type XpConfig = typeof xpConfig.$inferSelect;
export type InsertXpConfig = typeof xpConfig.$inferInsert;
