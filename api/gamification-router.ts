import { z } from "zod/v4";
import { eq, and, desc, sql } from "drizzle-orm";
import { createRouter, authedQuery, adminQuery } from "./middleware";
import { getDb } from "./queries/connection";
import * as schema from "@db/schema";

async function createNotification(
  db: any,
  userId: number,
  type: string,
  title: string,
  message?: string,
  link?: string,
) {
  await db.insert(schema.notifications).values({
    userId,
    type,
    title,
    message: message || null,
    link: link || null,
  });
}

const defaultXpConfig: Record<string, number> = {
  complete_profile: 20,
  verify_email: 10,
  first_login: 10,
  daily_login: 2,
  publish_blog: 30,
  publish_project: 50,
  featured_project: 50,
  featured_blog: 40,
  maker_spotlight: 100,
  competition_participation: 30,
  competition_winner: 250,
  purchase_product: 1, // per 100 currency units
  referral_signup: 50,
  referral_first_order: 100,
  helpful_community: 20,
};

const levelThresholds = [
  { level: 1, title: "Beginner Maker", minXp: 0 },
  { level: 2, title: "Hobbyist", minXp: 100 },
  { level: 3, title: "Builder", minXp: 300 },
  { level: 4, title: "Engineer", minXp: 600 },
  { level: 5, title: "Creator", minXp: 1000 },
  { level: 6, title: "Innovator", minXp: 2000 },
  { level: 7, title: "Expert Maker", minXp: 3500 },
  { level: 8, title: "Master Maker", minXp: 5000 },
  { level: 9, title: "Makera Legend", minXp: 7500 },
];

async function getOrCreateGamification(db: any, userId: number) {
  let g = await db
    .select()
    .from(schema.userGamification)
    .where(eq(schema.userGamification.userId, userId))
    .limit(1)
    .then((r: any[]) => r[0]);

  if (!g) {
    await db.insert(schema.userGamification).values({ userId });
    g = await db
      .select()
      .from(schema.userGamification)
      .where(eq(schema.userGamification.userId, userId))
      .limit(1)
      .then((r: any[]) => r[0]);
  }
  return g;
}

async function getXpValue(action: string): Promise<number> {
  const db = getDb();
  const config = await db
    .select()
    .from(schema.xpConfig)
    .where(eq(schema.xpConfig.action, action))
    .limit(1)
    .then((r: any[]) => r[0]);
  return config ? config.xpValue : defaultXpConfig[action] || 0;
}

async function awardXp(
  userId: number,
  action: string,
  description?: string,
  multiplier = 1,
) {
  const db = getDb();
  const baseXp = await getXpValue(action);
  if (baseXp === 0) return;
  const xpEarned = Math.round(baseXp * multiplier);

  // Log XP
  await db.insert(schema.xpLog).values({
    userId,
    action,
    xpEarned,
    description: description || `Earned ${xpEarned} XP for ${action.replace(/_/g, " ")}`,
  });

  // Update user gamification
  const g = await getOrCreateGamification(db, userId);
  const oldLevel = g.level || 1;
  const newTotalXp = (g.totalXp || 0) + xpEarned;

  // Calculate new level
  let newLevel = oldLevel;
  let newTitle = g.reputationTitle || "Beginner Maker";
  for (const lt of levelThresholds) {
    if (newTotalXp >= lt.minXp && lt.level > newLevel) {
      newLevel = lt.level;
      newTitle = lt.title;
    }
  }

  await db
    .update(schema.userGamification)
    .set({ totalXp: newTotalXp, level: newLevel, reputationTitle: newTitle })
    .where(eq(schema.userGamification.userId, userId));

  // Notification: XP earned
  const actionLabel = action.replace(/_/g, " ");
  await createNotification(
    db,
    userId,
    "xp",
    `+${xpEarned} XP Earned`,
    `You earned ${xpEarned} XP for ${description || actionLabel}`,
    "/dashboard/achievements",
  );

  // Notification: Level up
  if (newLevel > oldLevel) {
    await createNotification(
      db,
      userId,
      "level_up",
      `Level Up! You're now ${newTitle}`,
      `Congratulations! You reached Level ${newLevel} (${newTitle}) with ${newTotalXp} total XP`,
      "/dashboard/achievements",
    );
  }

  // Check achievements
  await checkAchievements(db, userId, { ...g, totalXp: newTotalXp, level: newLevel });

  // Check badge eligibility
  await checkBadges(db, userId);

  return { xpEarned, newTotalXp, newLevel, newTitle };
}

async function checkAchievements(db: any, userId: number, gamification: any) {
  const allAchievements = await db
    .select()
    .from(schema.achievements)
    .where(eq(schema.achievements.isActive, true));

  for (const ach of allAchievements) {
    const existing = await db
      .select()
      .from(schema.userAchievements)
      .where(and(
        eq(schema.userAchievements.userId, userId),
        eq(schema.userAchievements.achievementId, ach.id),
      ))
      .limit(1)
      .then((r: any[]) => r[0]);

    let progress = 0;
    const g = gamification || (await getOrCreateGamification(db, userId));

    switch (ach.requirementType) {
      case "xp_total":
        progress = g.totalXp || 0;
        break;
      case "xp_level":
        progress = g.level || 1;
        break;
      case "projects_count": {
        const { count } = await db
          .select({ count: sql<number>`COUNT(*)` })
          .from(schema.userProjects)
          .where(and(
            eq(schema.userProjects.userId, userId),
            eq(schema.userProjects.status, "approved"),
          ))
          .then((r: any[]) => r[0]);
        progress = Number(count) || 0;
        break;
      }
      case "blogs_count": {
        const { count } = await db
          .select({ count: sql<number>`COUNT(*)` })
          .from(schema.userBlogs)
          .where(and(
            eq(schema.userBlogs.userId, userId),
            eq(schema.userBlogs.status, "approved"),
          ))
          .then((r: any[]) => r[0]);
        progress = Number(count) || 0;
        break;
      }
      case "purchases_count":
        progress = g.totalPurchases || 0;
        break;
      case "competition_wins": {
        const { count } = await db
          .select({ count: sql<number>`COUNT(*)` })
          .from(schema.competitionEntries)
          .where(and(
            eq(schema.competitionEntries.userId, userId),
            eq(schema.competitionEntries.isWinner, true),
          ))
          .then((r: any[]) => r[0]);
        progress = Number(count) || 0;
        break;
      }
      default:
        progress = 0;
    }

    const completed = progress >= ach.requirementGoal;
    const wasAlreadyCompleted = existing?.completed || false;

    if (existing) {
      if (existing.progress !== progress || existing.completed !== completed) {
        await db
          .update(schema.userAchievements)
          .set({ progress, completed, completedAt: completed ? new Date() : null })
          .where(eq(schema.userAchievements.id, existing.id));
      }
    } else {
      await db.insert(schema.userAchievements).values({
        userId,
        achievementId: ach.id,
        progress,
        completed,
        completedAt: completed ? new Date() : null,
      });
    }

    // Notification: Achievement completed (only when newly completed)
    if (completed && !wasAlreadyCompleted) {
      await createNotification(
        db,
        userId,
        "achievement",
        `Achievement Unlocked: ${ach.name}`,
        ach.description || `You completed the "${ach.name}" achievement!`,
        "/dashboard/achievements",
      );
    }
  }
}

async function checkBadges(db: any, userId: number) {
  const allBadges = await db
    .select()
    .from(schema.badges)
    .where(eq(schema.badges.isActive, true));

  for (const badge of allBadges) {
    // Skip if already earned
    const existing = await db
      .select()
      .from(schema.userBadges)
      .where(and(
        eq(schema.userBadges.userId, userId),
        eq(schema.userBadges.badgeId, badge.id),
      ))
      .limit(1)
      .then((r: any[]) => r[0]);

    if (existing) continue;

    // Check requirement type
    let qualifies = false;
    switch (badge.requirementType) {
      case "projects_count": {
        const { count } = await db
          .select({ count: sql<number>`COUNT(*)` })
          .from(schema.userProjects)
          .where(and(
            eq(schema.userProjects.userId, userId),
            eq(schema.userProjects.status, "approved"),
          ))
          .then((r: any[]) => r[0]);
        qualifies = Number(count) >= (badge.requirementValue || 1);
        break;
      }
      case "blogs_count": {
        const { count } = await db
          .select({ count: sql<number>`COUNT(*)` })
          .from(schema.userBlogs)
          .where(and(
            eq(schema.userBlogs.userId, userId),
            eq(schema.userBlogs.status, "approved"),
          ))
          .then((r: any[]) => r[0]);
        qualifies = Number(count) >= (badge.requirementValue || 1);
        break;
      }
      case "competition_wins": {
        const { count } = await db
          .select({ count: sql<number>`COUNT(*)` })
          .from(schema.competitionEntries)
          .where(and(
            eq(schema.competitionEntries.userId, userId),
            eq(schema.competitionEntries.isWinner, true),
          ))
          .then((r: any[]) => r[0]);
        qualifies = Number(count) >= (badge.requirementValue || 1);
        break;
      }
      case "featured": {
        const entry = await db
          .select()
          .from(schema.makerSpotlight)
          .where(and(
            eq(schema.makerSpotlight.userId, userId),
            eq(schema.makerSpotlight.isActive, true),
          ))
          .limit(1)
          .then((r: any[]) => r[0]);
        qualifies = !!entry;
        break;
      }
      default:
        qualifies = false;
    }

    if (qualifies) {
      await db.insert(schema.userBadges).values({
        userId,
        badgeId: badge.id,
      });

      // Award XP for badge (directly to avoid recursion with awardXp -> checkBadges)
      if (badge.xpReward && badge.xpReward > 0) {
        const g = await getOrCreateGamification(db, userId);
        const newTotalXp = (g.totalXp || 0) + badge.xpReward;
        await db
          .update(schema.userGamification)
          .set({ totalXp: newTotalXp })
          .where(eq(schema.userGamification.userId, userId));
      }

      // Notification: Badge unlocked
      await createNotification(
        db,
        userId,
        "badge",
        `Badge Unlocked: ${badge.name}`,
        badge.description || `You earned the "${badge.name}" badge!`,
        "/dashboard/achievements",
      );
    }
  }
}

export const gamificationRouter = createRouter({
  // ── Users ──

  /** Get current user's full gamification profile */
  getMyProfile: authedQuery.query(async ({ ctx }) => {
    const db = getDb();
    const userId = ctx.user.id;
    const g = await getOrCreateGamification(db, userId);

    const [userBadges, userAchievementsList, xpLogEntries] = await Promise.all([
      db
        .select()
        .from(schema.userBadges)
        .where(eq(schema.userBadges.userId, userId))
        .leftJoin(schema.badges, eq(schema.userBadges.badgeId, schema.badges.id)),
      db
        .select()
        .from(schema.userAchievements)
        .where(eq(schema.userAchievements.userId, userId))
        .leftJoin(schema.achievements, eq(schema.userAchievements.achievementId, schema.achievements.id)),
      db
        .select()
        .from(schema.xpLog)
        .where(eq(schema.xpLog.userId, userId))
        .orderBy(desc(schema.xpLog.createdAt))
        .limit(50),
    ]);

    const allBadges = await db
      .select()
      .from(schema.badges)
      .where(eq(schema.badges.isActive, true));

    const allAchievements = await db
      .select()
      .from(schema.achievements)
      .where(eq(schema.achievements.isActive, true));

    // Next level info
    const currentLevelIdx = levelThresholds.findIndex((l) => l.level === (g.level || 1));
    const nextLevel = levelThresholds[currentLevelIdx + 1];
    const currentLevel = levelThresholds[currentLevelIdx] || levelThresholds[0];
    const xpToNext = nextLevel ? nextLevel.minXp - (g.totalXp || 0) : 0;
    const xpProgress = nextLevel
      ? ((g.totalXp || 0) - currentLevel.minXp) / (nextLevel.minXp - currentLevel.minXp) * 100
      : 100;

    return {
      gamification: g,
      badges: allBadges.map((b) => {
        const ub = userBadges.find(
          (u) => (u as any).badges?.id === b.id || (u as any).badgeId === b.id,
        );
        return {
          ...b,
          earned: !!ub,
          earnedAt: (ub as any)?.user_badges?.earnedAt || null,
        };
      }),
      achievements: allAchievements.map((a) => {
        const ua = userAchievementsList.find(
          (ua) => (ua as any).achievements?.id === a.id || (ua as any).achievementId === a.id,
        );
        return {
          ...a,
          progress: (ua as any)?.progress || 0,
          completed: (ua as any)?.completed || false,
          completedAt: (ua as any)?.completedAt || null,
        };
      }),
      xpLog: xpLogEntries,
      levelInfo: {
        currentLevel: currentLevel?.title || "Beginner Maker",
        currentLevelNumber: g.level || 1,
        nextLevel: nextLevel?.title || "Max Level",
        nextLevelNumber: nextLevel?.level || g.level,
        xpToNext,
        xpProgress: Math.min(100, Math.max(0, xpProgress)),
        totalXp: g.totalXp || 0,
      },
      // All levels for reference
      allLevels: levelThresholds,
    };
  }),

  /** Award XP for an action (internal use, also called by other mutations) */
  awardXp: authedQuery
    .input(z.object({
      action: z.string(),
      description: z.string().optional(),
      multiplier: z.number().optional().default(1),
    }))
    .mutation(async ({ ctx, input }) => {
      return awardXp(ctx.user.id, input.action, input.description, input.multiplier);
    }),

  /** Record a daily login / mission completion */
  completeDailyMission: authedQuery
    .input(z.object({
      missionSlug: z.string(),
    }))
    .mutation(async ({ ctx, input }) => {
      const db = getDb();
      const userId = ctx.user.id;
      const today = new Date().toISOString().slice(0, 10);

      const mission = await db
        .select()
        .from(schema.dailyMissions)
        .where(and(
          eq(schema.dailyMissions.slug, input.missionSlug),
          eq(schema.dailyMissions.isActive, true),
        ))
        .limit(1)
        .then((r: any[]) => r[0]);

      if (!mission) throw new Error("Mission not found");

      // Check if already completed today
      const existing = await db
        .select()
        .from(schema.userMissions)
        .where(and(
          eq(schema.userMissions.userId, userId),
          eq(schema.userMissions.missionId, mission.id),
          eq(schema.userMissions.date, today),
        ))
        .limit(1)
        .then((r: any[]) => r[0]);

      if (existing) throw new Error("Mission already completed today");

      await db.insert(schema.userMissions).values({
        userId,
        missionId: mission.id,
        date: today,
      });

      await awardXp(userId, "daily_login", `Completed daily mission: ${mission.title}`);

      // Update streak
      const g = await getOrCreateGamification(db, userId);
      const lastDate = g.lastDailyDate;
      let newStreak = 1;
      if (lastDate) {
        const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
        newStreak = lastDate === yesterday ? (g.streak || 0) + 1 : lastDate === today ? g.streak || 0 : 1;
      }
      await db
        .update(schema.userGamification)
        .set({ streak: newStreak, lastDailyDate: today })
        .where(eq(schema.userGamification.userId, userId));

      return { success: true, xpEarned: mission.xpReward, streak: newStreak };
    }),

  /** Get daily missions with completion status */
  getDailyMissions: authedQuery.query(async ({ ctx }) => {
    const db = getDb();
    const userId = ctx.user.id;
    const today = new Date().toISOString().slice(0, 10);

    const [missions, completed] = await Promise.all([
      db
        .select()
        .from(schema.dailyMissions)
        .where(eq(schema.dailyMissions.isActive, true)),
      db
        .select()
        .from(schema.userMissions)
        .where(and(
          eq(schema.userMissions.userId, userId),
          eq(schema.userMissions.date, today),
        )),
    ]);

    return missions.map((m) => ({
      ...m,
      completed: completed.some((c) => c.missionId === m.id),
    }));
  }),

  /** Get weekly challenges with progress */
  getWeeklyChallenges: authedQuery.query(async ({ ctx }) => {
    const db = getDb();
    const userId = ctx.user.id;
    const now = new Date();

    const challenges = await db
      .select()
      .from(schema.weeklyChallenges)
      .where(and(
        eq(schema.weeklyChallenges.isActive, true),
        sql`${schema.weeklyChallenges.startsAt} IS NULL OR ${schema.weeklyChallenges.startsAt} <= ${now}`,
        sql`${schema.weeklyChallenges.endsAt} IS NULL OR ${schema.weeklyChallenges.endsAt} >= ${now}`,
      ));

    const progress = await db
      .select()
      .from(schema.userWeeklyChallenges)
      .where(eq(schema.userWeeklyChallenges.userId, userId));

    return challenges.map((c) => {
      const p = progress.find((p) => p.challengeId === c.id);
      return {
        ...c,
        progress: p?.progress || 0,
        completed: p?.completed || false,
        completedAt: p?.completedAt || null,
      };
    });
  }),

  /** Get monthly challenges with progress */
  getMonthlyChallenges: authedQuery.query(async ({ ctx }) => {
    const db = getDb();
    const userId = ctx.user.id;
    const month = new Date().toISOString().slice(0, 7);

    const challenges = await db
      .select()
      .from(schema.monthlyChallenges)
      .where(and(
        eq(schema.monthlyChallenges.isActive, true),
        sql`${schema.monthlyChallenges.month} IS NULL OR ${schema.monthlyChallenges.month} = ${month}`,
      ));

    const progress = await db
      .select()
      .from(schema.userMonthlyChallenges)
      .where(eq(schema.userMonthlyChallenges.userId, userId));

    return challenges.map((c) => {
      const p = progress.find((p) => p.challengeId === c.id);
      return {
        ...c,
        progress: p?.progress || 0,
        completed: p?.completed || false,
        completedAt: p?.completedAt || null,
      };
    });
  }),

  /** Get leaderboard */
  getLeaderboard: authedQuery
    .input(z.object({
      type: z.enum(["xp", "projects", "blogs", "streak", "monthly"]).optional().default("xp"),
      limit: z.number().optional().default(20),
    }))
    .query(async ({ input }) => {
      const db = getDb();

      let query;
      switch (input.type) {
        case "projects":
          query = db
            .select({
              userId: schema.userProjects.userId,
              count: sql<number>`COUNT(*)`,
            })
            .from(schema.userProjects)
            .where(eq(schema.userProjects.status, "approved"))
            .groupBy(schema.userProjects.userId)
            .orderBy(desc(sql`COUNT(*)`));
          break;
        case "blogs":
          query = db
            .select({
              userId: schema.userBlogs.userId,
              count: sql<number>`COUNT(*)`,
            })
            .from(schema.userBlogs)
            .where(eq(schema.userBlogs.status, "approved"))
            .groupBy(schema.userBlogs.userId)
            .orderBy(desc(sql`COUNT(*)`));
          break;
        case "streak":
          query = db
            .select()
            .from(schema.userGamification)
            .orderBy(desc(schema.userGamification.streak));
          break;
        default:
          query = db
            .select()
            .from(schema.userGamification)
            .orderBy(desc(schema.userGamification.totalXp));
      }

      const data = await query.limit(input.limit);

      // Get user names
      const userIds = data.map((d: any) => d.userId || d.user?.id).filter(Boolean);
      const users = userIds.length > 0
        ? await db
            .select()
            .from(schema.users)
            .where(sql`${schema.users.id} IN (${sql.join(userIds, sql`,`)})`)
        : [];

      const userMap = new Map(users.map((u) => [u.id, u]));

      return data.map((entry: any, i: number) => {
        const uid = entry.userId || entry.user?.id;
        const user = userMap.get(uid);
        return {
          rank: i + 1,
          userId: uid,
          name: user?.name || `User #${uid}`,
          avatar: user?.avatar || "",
          value: entry.totalXp || entry.count || entry.streak || 0,
          level: entry.level || 1,
          title: entry.reputationTitle || "Beginner Maker",
        };
      });
    }),

  /** Get loyalty stamps and rewards */
  getLoyaltyInfo: authedQuery.query(async ({ ctx }) => {
    const db = getDb();
    const userId = ctx.user.id;
    const g = await getOrCreateGamification(db, userId);

    const tiers = await db
      .select()
      .from(schema.loyaltyTiers)
      .where(eq(schema.loyaltyTiers.isActive, true))
      .orderBy(schema.loyaltyTiers.requiredStamps);

    return {
      stamps: g.loyaltyStamps || 0,
      totalPurchases: g.totalPurchases || 0,
      tiers: tiers.map((t) => ({
        ...t,
        unlocked: (g.loyaltyStamps || 0) >= t.requiredStamps,
        progress: Math.min(100, ((g.loyaltyStamps || 0) / t.requiredStamps) * 100),
      })),
    };
  }),

  /** Get points store rewards */
  getStoreRewards: authedQuery.query(async () => {
    const db = getDb();
    return db
      .select()
      .from(schema.storeRewards)
      .where(eq(schema.storeRewards.isActive, true));
  }),

  /** Redeem points for reward */
  redeemPoints: authedQuery
    .input(z.object({ rewardId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const db = getDb();
      const userId = ctx.user.id;

      const reward = await db
        .select()
        .from(schema.storeRewards)
        .where(and(
          eq(schema.storeRewards.id, input.rewardId),
          eq(schema.storeRewards.isActive, true),
        ))
        .limit(1)
        .then((r: any[]) => r[0]);

      if (!reward) throw new Error("Reward not found");

      const g = await getOrCreateGamification(db, userId);
      if ((g.points || 0) < reward.pointsCost) {
        throw new Error("Insufficient points");
      }

      if (reward.stock !== -1 && reward.stock <= 0) {
        throw new Error("Reward out of stock");
      }

      const newPoints = (g.points || 0) - reward.pointsCost;
      await db
        .update(schema.userGamification)
        .set({ points: newPoints })
        .where(eq(schema.userGamification.userId, userId));

      await db.insert(schema.userRedemptions).values({
        userId,
        rewardId: reward.id,
        pointsSpent: reward.pointsCost,
      });

      if (reward.stock > 0) {
        await db
          .update(schema.storeRewards)
          .set({ stock: reward.stock - 1 })
          .where(eq(schema.storeRewards.id, reward.id));
      }

      return { success: true, remainingPoints: newPoints };
    }),

  /** Get my redemptions */
  getMyRedemptions: authedQuery.query(async ({ ctx }) => {
    const db = getDb();
    return db
      .select()
      .from(schema.userRedemptions)
      .where(eq(schema.userRedemptions.userId, ctx.user.id))
      .orderBy(desc(schema.userRedemptions.redeemedAt))
      .leftJoin(schema.storeRewards, eq(schema.userRedemptions.rewardId, schema.storeRewards.id));
  }),

  /** Get referral code */
  getReferralCode: authedQuery.query(async ({ ctx }) => {
    const db = getDb();
    const userId = ctx.user.id;

    let rc = await db
      .select()
      .from(schema.referralCodes)
      .where(eq(schema.referralCodes.userId, userId))
      .limit(1)
      .then((r: any[]) => r[0]);

    if (!rc) {
      const code = `MAKERA${userId}${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
      await db.insert(schema.referralCodes).values({ userId, code });
      rc = { code };
    }

    const referrals = await db
      .select()
      .from(schema.referrals)
      .where(eq(schema.referrals.referrerId, userId))
      .orderBy(desc(schema.referrals.createdAt))
      .leftJoin(schema.users, eq(schema.referrals.refereeId, schema.users.id));

    return {
      code: rc.code,
      referrals: referrals.map((r: any) => ({
        id: r.referrals?.id || r.id,
        refereeName: r.users?.name || `User #${r.referrals?.refereeId || r.refereeId}`,
        refereeOrdered: r.referrals?.refereeOrdered || r.refereeOrdered,
        createdAt: r.referrals?.createdAt || r.createdAt,
      })),
    };
  }),

  /** Apply referral code (on registration) */
  applyReferral: authedQuery
    .input(z.object({ code: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const db = getDb();
      const userId = ctx.user.id;

      const rc = await db
        .select()
        .from(schema.referralCodes)
        .where(eq(schema.referralCodes.code, input.code.toUpperCase()))
        .limit(1)
        .then((r: any[]) => r[0]);

      if (!rc) throw new Error("Invalid referral code");
      if (rc.userId === userId) throw new Error("Cannot refer yourself");

      const existing = await db
        .select()
        .from(schema.referrals)
        .where(eq(schema.referrals.refereeId, userId))
        .limit(1)
        .then((r: any[]) => r[0]);

      if (existing) throw new Error("Already referred by someone");

      await db.insert(schema.referrals).values({
        referrerId: rc.userId,
        refereeId: userId,
      });

      // Award XP to both
      await awardXp(rc.userId, "referral_signup", "Referred a new member");
      await awardXp(userId, "referral_signup", "Joined via referral");

      return { success: true };
    }),

  /** Get certificates */
  getMyCertificates: authedQuery.query(async ({ ctx }) => {
    const db = getDb();
    return db
      .select()
      .from(schema.certificates)
      .where(eq(schema.certificates.userId, ctx.user.id))
      .orderBy(desc(schema.certificates.issuedAt));
  }),

  /** Get current spotlight */
  getCurrentSpotlight: authedQuery.query(async () => {
    const db = getDb();
    const month = new Date().toISOString().slice(0, 7);
    return db
      .select()
      .from(schema.makerSpotlight)
      .where(and(
        eq(schema.makerSpotlight.month, month),
        eq(schema.makerSpotlight.isActive, true),
      ))
      .leftJoin(schema.users, eq(schema.makerSpotlight.userId, schema.users.id));
  }),

  // ── Admin Endpoints ──

  /** Get all XP config */
  getXpConfig: adminQuery.query(async () => {
    const db = getDb();
    const configs = await db.select().from(schema.xpConfig);
    // Merge with defaults
    const merged: Record<string, number> = {};
    for (const [action, defaultValue] of Object.entries(defaultXpConfig)) {
      const config = configs.find((c) => c.action === action);
      merged[action] = config ? config.xpValue : defaultValue;
    }
    return Object.entries(merged).map(([action, xpValue]) => ({
      action,
      xpValue,
      description: configs.find((c) => c.action === action)?.description || "",
    }));
  }),

  /** Update XP config value */
  updateXpConfig: adminQuery
    .input(z.object({
      action: z.string(),
      xpValue: z.number().min(0),
    }))
    .mutation(async ({ input }) => {
      const db = getDb();
      const existing = await db
        .select()
        .from(schema.xpConfig)
        .where(eq(schema.xpConfig.action, input.action))
        .limit(1)
        .then((r: any[]) => r[0]);

      if (existing) {
        await db
          .update(schema.xpConfig)
          .set({ xpValue: input.xpValue })
          .where(eq(schema.xpConfig.id, existing.id));
      } else {
        await db.insert(schema.xpConfig).values({
          action: input.action,
          xpValue: input.xpValue,
        });
      }
      return { success: true };
    }),

  /** Seed default data (admin) */
  seedDefaults: adminQuery.mutation(async () => {
    const db = getDb();

    // Seed XP config
    for (const [action, xpValue] of Object.entries(defaultXpConfig)) {
      const existing = await db
        .select()
        .from(schema.xpConfig)
        .where(eq(schema.xpConfig.action, action))
        .limit(1)
        .then((r: any[]) => r[0]);
      if (!existing) {
        await db.insert(schema.xpConfig).values({
          action,
          xpValue,
          description: `XP for ${action.replace(/_/g, " ")}`,
        });
      }
    }

    // Seed reputation levels
    for (const lt of levelThresholds) {
      const existing = await db
        .select()
        .from(schema.reputationLevels)
        .where(eq(schema.reputationLevels.level, lt.level))
        .limit(1)
        .then((r: any[]) => r[0]);
      if (!existing) {
        await db.insert(schema.reputationLevels).values(lt);
      }
    }

    // Seed badges
    const defaultBadges = [
      { slug: "first-project", name: "First Project", description: "Published your first project", icon: "Rocket", category: "projects", requirementType: "projects_count", requirementValue: 1, xpReward: 20 },
      { slug: "first-blog", name: "First Blog", description: "Published your first blog post", icon: "FileText", category: "blog", requirementType: "blogs_count", requirementValue: 1, xpReward: 15 },
      { slug: "5-projects", name: "Project Builder", description: "Published 5 projects", icon: "Layers", category: "projects", requirementType: "projects_count", requirementValue: 5, xpReward: 50 },
      { slug: "10-projects", name: "10 Projects", description: "Published 10 projects", icon: "Package", category: "projects", requirementType: "projects_count", requirementValue: 10, xpReward: 100 },
      { slug: "25-projects", name: "25 Projects", description: "Published 25 projects", icon: "Award", category: "projects", requirementType: "projects_count", requirementValue: 25, xpReward: 250 },
      { slug: "community-helper", name: "Community Helper", description: "Helped fellow makers in the community", icon: "Heart", category: "community", requirementType: "helpful", requirementValue: 1, xpReward: 30 },
      { slug: "featured-creator", name: "Featured Creator", description: "Your work was featured in the spotlight", icon: "Star", category: "community", requirementType: "featured", requirementValue: 1, xpReward: 100 },
      { slug: "competition-winner", name: "Competition Winner", description: "Won a community competition", icon: "Trophy", category: "competition", requirementType: "competition_wins", requirementValue: 1, xpReward: 250 },
      { slug: "electronics-expert", name: "Electronics Expert", description: "Published projects in electronics category", icon: "Zap", category: "specialty", requirementType: "category_electronics", requirementValue: 3, xpReward: 75 },
      { slug: "robotics-expert", name: "Robotics Expert", description: "Published projects in robotics category", icon: "Cpu", category: "specialty", requirementType: "category_robotics", requirementValue: 3, xpReward: 75 },
    ];
    for (const badge of defaultBadges) {
      const existing = await db
        .select()
        .from(schema.badges)
        .where(eq(schema.badges.slug, badge.slug))
        .limit(1)
        .then((r: any[]) => r[0]);
      if (!existing) {
        await db.insert(schema.badges).values(badge);
      }
    }

    // Seed achievements
    const defaultAchievements = [
      { slug: "first-project", name: "First Project", description: "Publish your first project", icon: "Rocket", category: "projects", requirementType: "projects_count", requirementGoal: 1, xpReward: 20, pointsReward: 10 },
      { slug: "10-blogs", name: "Blog Writer", description: "Publish 10 blogs", icon: "FileText", category: "blog", requirementType: "blogs_count", requirementGoal: 10, xpReward: 100, pointsReward: 50 },
      { slug: "500-xp", name: "Getting Started", description: "Reach 500 XP", icon: "Zap", category: "xp", requirementType: "xp_total", requirementGoal: 500, xpReward: 50, pointsReward: 25 },
      { slug: "1000-xp", name: "Experienced Maker", description: "Reach 1000 XP", icon: "Award", category: "xp", requirementType: "xp_total", requirementGoal: 1000, xpReward: 100, pointsReward: 50 },
      { slug: "win-competition", name: "Champion", description: "Win a competition", icon: "Trophy", category: "competition", requirementType: "competition_wins", requirementGoal: 1, xpReward: 250, pointsReward: 100 },
      { slug: "complete-profile", name: "Profile Pro", description: "Complete your profile", icon: "User", category: "onboarding", requirementType: "profile_complete", requirementGoal: 1, xpReward: 20, pointsReward: 10 },
      { slug: "first-purchase", name: "First Purchase", description: "Complete your first purchase", icon: "ShoppingCart", category: "shop", requirementType: "purchases_count", requirementGoal: 1, xpReward: 30, pointsReward: 15 },
    ];
    for (const ach of defaultAchievements) {
      const existing = await db
        .select()
        .from(schema.achievements)
        .where(eq(schema.achievements.slug, ach.slug))
        .limit(1)
        .then((r: any[]) => r[0]);
      if (!existing) {
        await db.insert(schema.achievements).values(ach);
      }
    }

    // Seed daily missions
    const defaultMissions = [
      { slug: "read-blog", title: "Read a Blog", description: "Read one blog post", icon: "BookOpen", xpReward: 5 },
      { slug: "like-project", title: "Like a Project", description: "Like one community project", icon: "Heart", xpReward: 5 },
      { slug: "visit-community", title: "Visit Community", description: "Browse the community page", icon: "MessageSquare", xpReward: 3 },
      { slug: "complete-profile", title: "Complete Profile", description: "Ensure your profile is complete", icon: "User", xpReward: 10 },
      { slug: "shop-visit", title: "Visit Shop", description: "Browse the marketplace", icon: "ShoppingBag", xpReward: 3 },
    ];
    for (const mission of defaultMissions) {
      const existing = await db
        .select()
        .from(schema.dailyMissions)
        .where(eq(schema.dailyMissions.slug, mission.slug))
        .limit(1)
        .then((r: any[]) => r[0]);
      if (!existing) {
        await db.insert(schema.dailyMissions).values(mission);
      }
    }

    // Seed loyalty tiers
    const defaultTiers = [
      { requiredStamps: 10, rewardType: "free_shipping", rewardValue: "Free Standard Shipping", description: "Free standard shipping voucher" },
      { requiredStamps: 15, rewardType: "discount", rewardValue: "15", description: "15% discount coupon" },
      { requiredStamps: 20, rewardType: "exclusive", rewardValue: "Exclusive Member Reward", description: "Exclusive member rewards package" },
    ];
    for (const tier of defaultTiers) {
      const existing = await db
        .select()
        .from(schema.loyaltyTiers)
        .where(eq(schema.loyaltyTiers.requiredStamps, tier.requiredStamps))
        .limit(1)
        .then((r: any[]) => r[0]);
      if (!existing) {
        await db.insert(schema.loyaltyTiers).values(tier);
      }
    }

    // Seed store rewards
    const defaultStoreRewards = [
      { name: "Free Delivery", description: "Free standard delivery on your next order", pointsCost: 100, rewardType: "free_shipping", rewardValue: "Free Shipping", icon: "Truck" },
      { name: "10% Discount", description: "10% off your next order", pointsCost: 250, rewardType: "discount", rewardValue: "10", icon: "Percent" },
      { name: "20% Discount", description: "20% off your next order", pointsCost: 500, rewardType: "discount", rewardValue: "20", icon: "Percent" },
      { name: "Premium Maker Badge", description: "Exclusive premium maker badge on your profile", pointsCost: 1000, rewardType: "badge", rewardValue: "premium-maker", icon: "Award" },
      { name: "Exclusive Merchandise", description: "Limited edition Makera merchandise pack", pointsCost: 1500, rewardType: "merch", rewardValue: "Merch Pack", icon: "Package" },
      { name: "Early Access Features", description: "Get early access to new platform features", pointsCost: 2000, rewardType: "early_access", rewardValue: "Early Access", icon: "Rocket" },
    ];
    for (const reward of defaultStoreRewards) {
      const existing = await db
        .select()
        .from(schema.storeRewards)
        .where(eq(schema.storeRewards.name, reward.name))
        .limit(1)
        .then((r: any[]) => r[0]);
      if (!existing) {
        await db.insert(schema.storeRewards).values(reward);
      }
    }

    return { success: true };
  }),

  // ── Badge Management (admin) ──
  getBadges: adminQuery.query(async () => {
    const db = getDb();
    return db.select().from(schema.badges).orderBy(schema.badges.name);
  }),

  createBadge: adminQuery
    .input(z.object({
      slug: z.string().max(64),
      name: z.string().max(128),
      description: z.string().optional(),
      icon: z.string().optional(),
      category: z.string().optional(),
      requirementType: z.string().optional(),
      requirementValue: z.number().optional().default(1),
      xpReward: z.number().optional().default(0),
    }))
    .mutation(async ({ input }) => {
      const db = getDb();
      await db.insert(schema.badges).values(input);
      return { success: true };
    }),

  updateBadge: adminQuery
    .input(z.object({
      id: z.number(),
      name: z.string().max(128).optional(),
      description: z.string().optional(),
      icon: z.string().optional(),
      xpReward: z.number().optional(),
      isActive: z.boolean().optional(),
    }))
    .mutation(async ({ input }) => {
      const db = getDb();
      const { id, ...data } = input;
      await db.update(schema.badges).set(data).where(eq(schema.badges.id, id));
      return { success: true };
    }),

  deleteBadge: adminQuery
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      const db = getDb();
      await db.delete(schema.badges).where(eq(schema.badges.id, input.id));
      return { success: true };
    }),

  // ── Achievement Management (admin) ──
  getAchievements: adminQuery.query(async () => {
    const db = getDb();
    return db.select().from(schema.achievements).orderBy(schema.achievements.name);
  }),

  createAchievement: adminQuery
    .input(z.object({
      slug: z.string().max(64),
      name: z.string().max(128),
      description: z.string().optional(),
      icon: z.string().optional(),
      category: z.string().optional(),
      requirementType: z.string(),
      requirementGoal: z.number(),
      xpReward: z.number().optional().default(0),
      pointsReward: z.number().optional().default(0),
    }))
    .mutation(async ({ input }) => {
      const db = getDb();
      await db.insert(schema.achievements).values(input);
      return { success: true };
    }),

  // ── Certificates Management (admin) ──
  issueCertificate: adminQuery
    .input(z.object({
      userId: z.number(),
      type: z.string(),
      title: z.string().max(255),
      description: z.string().optional(),
      certificateUrl: z.string().optional(),
    }))
    .mutation(async ({ input }) => {
      const db = getDb();
      await db.insert(schema.certificates).values(input);

      // Notification: Certificate issued
      await createNotification(
        db,
        input.userId,
        "certificate",
        `Certificate Issued: ${input.title}`,
        input.description || `You received a ${input.type} certificate: ${input.title}`,
        "/dashboard/achievements",
      );

      return { success: true };
    }),

  // ── Maker Spotlight Management (admin) ──
  getSpotlights: adminQuery.query(async () => {
    const db = getDb();
    return db
      .select()
      .from(schema.makerSpotlight)
      .orderBy(desc(schema.makerSpotlight.createdAt))
      .leftJoin(schema.users, eq(schema.makerSpotlight.userId, schema.users.id));
  }),

  addToSpotlight: adminQuery
    .input(z.object({
      userId: z.number(),
      reason: z.string().optional(),
      month: z.string().optional(),
    }))
    .mutation(async ({ input }) => {
      const db = getDb();
      const month = input.month || new Date().toISOString().slice(0, 7);

      // Remove previous spotlight for this user in this month
      await db
        .update(schema.makerSpotlight)
        .set({ isActive: false })
        .where(and(
          eq(schema.makerSpotlight.userId, input.userId),
          eq(schema.makerSpotlight.month, month),
        ));

      await db.insert(schema.makerSpotlight).values({
        userId: input.userId,
        reason: input.reason,
        month,
        isAutoGenerated: false,
      });

      // Award XP
      await awardXp(input.userId, "maker_spotlight", "Selected for Maker Spotlight");

      return { success: true };
    }),

  removeFromSpotlight: adminQuery
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      const db = getDb();
      await db
        .update(schema.makerSpotlight)
        .set({ isActive: false })
        .where(eq(schema.makerSpotlight.id, input.id));
      return { success: true };
    }),

  // ── Weekly/Monthly Challenges Management ──
  getWeeklyChallengesAdmin: adminQuery.query(async () => {
    const db = getDb();
    return db.select().from(schema.weeklyChallenges).orderBy(desc(schema.weeklyChallenges.createdAt));
  }),

  createWeeklyChallenge: adminQuery
    .input(z.object({
      slug: z.string().max(64),
      title: z.string().max(128),
      description: z.string().optional(),
      icon: z.string().optional(),
      requirementType: z.string(),
      requirementGoal: z.number(),
      xpReward: z.number().optional().default(50),
      pointsReward: z.number().optional().default(0),
      startsAt: z.string().optional(),
      endsAt: z.string().optional(),
    }))
    .mutation(async ({ input }) => {
      const db = getDb();
      await db.insert(schema.weeklyChallenges).values({
        ...input,
        startsAt: input.startsAt ? new Date(input.startsAt) : undefined,
        endsAt: input.endsAt ? new Date(input.endsAt) : undefined,
      });
      return { success: true };
    }),

  // ── Store Rewards Management ──
  getStoreRewardsAdmin: adminQuery.query(async () => {
    const db = getDb();
    return db.select().from(schema.storeRewards).orderBy(schema.storeRewards.pointsCost);
  }),

  createStoreReward: adminQuery
    .input(z.object({
      name: z.string().max(128),
      description: z.string().optional(),
      pointsCost: z.number(),
      rewardType: z.string(),
      rewardValue: z.string().optional(),
      icon: z.string().optional(),
      stock: z.number().optional().default(-1),
    }))
    .mutation(async ({ input }) => {
      const db = getDb();
      await db.insert(schema.storeRewards).values(input);
      return { success: true };
    }),

  updateStoreReward: adminQuery
    .input(z.object({
      id: z.number(),
      name: z.string().optional(),
      description: z.string().optional(),
      pointsCost: z.number().optional(),
      isActive: z.boolean().optional(),
      stock: z.number().optional(),
    }))
    .mutation(async ({ input }) => {
      const db = getDb();
      const { id, ...data } = input;
      await db.update(schema.storeRewards).set(data).where(eq(schema.storeRewards.id, id));
      return { success: true };
    }),
});
