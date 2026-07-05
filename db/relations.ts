import { relations } from "drizzle-orm";
import {
  users, profiles, passwordResetTokens, savedProducts, savedBlogs, savedProjects,
  userProjects, userBlogs, notifications,
  categories, products, productVariants, refundRequests,
  cartItems, orders, orderItems,
  comments, reports, featuredCreators, competitionEntries, competitions,
  userGamification, xpLog, userBadges, userAchievements, userMissions,
  userWeeklyChallenges, userMonthlyChallenges, referrals, referralCodes,
  userRedemptions, makerSpotlight, certificates,
  badges, achievements, storeRewards,
} from "./schema";

export const usersRelations = relations(users, ({ one, many }) => ({
  profile: one(profiles, {
    fields: [users.id],
    references: [profiles.userId],
  }),
  passwordResetTokens: many(passwordResetTokens),
  cartItems: many(cartItems),
  orders: many(orders),
  savedProducts: many(savedProducts),
  savedBlogs: many(savedBlogs),
  savedProjects: many(savedProjects),
  userProjects: many(userProjects),
  userBlogs: many(userBlogs),
  notifications: many(notifications),
}));

export const profilesRelations = relations(profiles, ({ one }) => ({
  user: one(users, {
    fields: [profiles.userId],
    references: [users.id],
  }),
}));

export const passwordResetTokensRelations = relations(passwordResetTokens, ({ one }) => ({
  user: one(users, {
    fields: [passwordResetTokens.userId],
    references: [users.id],
  }),
}));

export const savedProductsRelations = relations(savedProducts, ({ one }) => ({
  user: one(users, {
    fields: [savedProducts.userId],
    references: [users.id],
  }),
  product: one(products, {
    fields: [savedProducts.productId],
    references: [products.id],
  }),
}));

export const savedBlogsRelations = relations(savedBlogs, ({ one }) => ({
  user: one(users, {
    fields: [savedBlogs.userId],
    references: [users.id],
  }),
  blog: one(userBlogs, {
    fields: [savedBlogs.blogId],
    references: [userBlogs.id],
  }),
}));

export const savedProjectsRelations = relations(savedProjects, ({ one }) => ({
  user: one(users, {
    fields: [savedProjects.userId],
    references: [users.id],
  }),
  project: one(userProjects, {
    fields: [savedProjects.projectId],
    references: [userProjects.id],
  }),
}));

export const userProjectsRelations = relations(userProjects, ({ one }) => ({
  user: one(users, {
    fields: [userProjects.userId],
    references: [users.id],
  }),
}));

export const userBlogsRelations = relations(userBlogs, ({ one }) => ({
  user: one(users, {
    fields: [userBlogs.userId],
    references: [users.id],
  }),
}));

export const notificationsRelations = relations(notifications, ({ one }) => ({
  user: one(users, {
    fields: [notifications.userId],
    references: [users.id],
  }),
}));

export const categoriesRelations = relations(categories, ({ many }) => ({
  products: many(products),
}));

export const productsRelations = relations(products, ({ one }) => ({
  category: one(categories, {
    fields: [products.categoryId],
    references: [categories.id],
  }),
}));

export const cartItemsRelations = relations(cartItems, ({ one }) => ({
  user: one(users, {
    fields: [cartItems.userId],
    references: [users.id],
  }),
  product: one(products, {
    fields: [cartItems.productId],
    references: [products.id],
  }),
}));

export const ordersRelations = relations(orders, ({ one, many }) => ({
  user: one(users, {
    fields: [orders.userId],
    references: [users.id],
  }),
  items: many(orderItems),
}));

export const orderItemsRelations = relations(orderItems, ({ one }) => ({
  order: one(orders, {
    fields: [orderItems.orderId],
    references: [orders.id],
  }),
}));

export const productVariantsRelations = relations(productVariants, ({ one }) => ({
  product: one(products, {
    fields: [productVariants.productId],
    references: [products.id],
  }),
}));

export const refundRequestsRelations = relations(refundRequests, ({ one }) => ({
  order: one(orders, {
    fields: [refundRequests.orderId],
    references: [orders.id],
  }),
}));

export const commentsRelations = relations(comments, ({ one }) => ({
  user: one(users, {
    fields: [comments.userId],
    references: [users.id],
  }),
}));

export const reportsRelations = relations(reports, ({ one }) => ({
  reporter: one(users, {
    fields: [reports.reporterId],
    references: [users.id],
  }),
}));

export const featuredCreatorsRelations = relations(featuredCreators, ({ one }) => ({
  user: one(users, {
    fields: [featuredCreators.userId],
    references: [users.id],
  }),
}));

export const competitionEntriesRelations = relations(competitionEntries, ({ one }) => ({
  competition: one(competitions, {
    fields: [competitionEntries.competitionId],
    references: [competitions.id],
  }),
  user: one(users, {
    fields: [competitionEntries.userId],
    references: [users.id],
  }),
  project: one(userProjects, {
    fields: [competitionEntries.projectId],
    references: [userProjects.id],
  }),
}));

export const userGamificationRelations = relations(userGamification, ({ one }) => ({
  user: one(users, {
    fields: [userGamification.userId],
    references: [users.id],
  }),
}));

export const xpLogRelations = relations(xpLog, ({ one }) => ({
  user: one(users, {
    fields: [xpLog.userId],
    references: [users.id],
  }),
}));

export const userBadgesRelations = relations(userBadges, ({ one }) => ({
  user: one(users, {
    fields: [userBadges.userId],
    references: [users.id],
  }),
  badge: one(badges, {
    fields: [userBadges.badgeId],
    references: [badges.id],
  }),
}));

export const userAchievementsRelations = relations(userAchievements, ({ one }) => ({
  user: one(users, {
    fields: [userAchievements.userId],
    references: [users.id],
  }),
  achievement: one(achievements, {
    fields: [userAchievements.achievementId],
    references: [achievements.id],
  }),
}));

export const userMissionsRelations = relations(userMissions, ({ one }) => ({
  user: one(users, {
    fields: [userMissions.userId],
    references: [users.id],
  }),
}));

export const userWeeklyChallengesRelations = relations(userWeeklyChallenges, ({ one }) => ({
  user: one(users, {
    fields: [userWeeklyChallenges.userId],
    references: [users.id],
  }),
}));

export const userMonthlyChallengesRelations = relations(userMonthlyChallenges, ({ one }) => ({
  user: one(users, {
    fields: [userMonthlyChallenges.userId],
    references: [users.id],
  }),
}));

export const referralsRelations = relations(referrals, ({ one }) => ({
  referrer: one(users, {
    fields: [referrals.referrerId],
    references: [users.id],
  }),
  referee: one(users, {
    fields: [referrals.refereeId],
    references: [users.id],
  }),
}));

export const referralCodesRelations = relations(referralCodes, ({ one }) => ({
  user: one(users, {
    fields: [referralCodes.userId],
    references: [users.id],
  }),
}));

export const userRedemptionsRelations = relations(userRedemptions, ({ one }) => ({
  user: one(users, {
    fields: [userRedemptions.userId],
    references: [users.id],
  }),
  reward: one(storeRewards, {
    fields: [userRedemptions.rewardId],
    references: [storeRewards.id],
  }),
}));

export const makerSpotlightRelations = relations(makerSpotlight, ({ one }) => ({
  user: one(users, {
    fields: [makerSpotlight.userId],
    references: [users.id],
  }),
}));

export const certificatesRelations = relations(certificates, ({ one }) => ({
  user: one(users, {
    fields: [certificates.userId],
    references: [users.id],
  }),
}));
