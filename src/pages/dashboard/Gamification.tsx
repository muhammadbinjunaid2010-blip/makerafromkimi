import { useState } from "react";
import { trpc } from "@/providers/trpc";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";
import {
  Zap, Award, Star, Medal, Gift, Users, Target, FileText, ShoppingBag,
  TrendingUp, CheckCircle, Crown, Rocket, Sparkles, RefreshCw, Copy, ExternalLink,
} from "lucide-react";
import { toast } from "sonner";

export default function GamificationPage() {
  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
          <Sparkles className="h-6 w-6 text-amber-500" />
          My Achievements
        </h1>
        <p className="text-muted-foreground mt-1">Track your XP, badges, challenges, and rewards</p>
      </motion.div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid grid-cols-2 md:grid-cols-5 w-full">
          <TabsTrigger value="overview"><Zap className="h-3.5 w-3.5 mr-1.5" /> Overview</TabsTrigger>
          <TabsTrigger value="badges"><Award className="h-3.5 w-3.5 mr-1.5" /> Badges</TabsTrigger>
          <TabsTrigger value="rewards"><Gift className="h-3.5 w-3.5 mr-1.5" /> Rewards</TabsTrigger>
          <TabsTrigger value="challenges"><Target className="h-3.5 w-3.5 mr-1.5" /> Challenges</TabsTrigger>
          <TabsTrigger value="leaderboard"><Medal className="h-3.5 w-3.5 mr-1.5" /> Leaderboard</TabsTrigger>
        </TabsList>

        <TabsContent value="overview"><OverviewTab /></TabsContent>
        <TabsContent value="badges"><BadgesTab /></TabsContent>
        <TabsContent value="rewards"><RewardsTab /></TabsContent>
        <TabsContent value="challenges"><ChallengesTab /></TabsContent>
        <TabsContent value="leaderboard"><LeaderboardTab /></TabsContent>
      </Tabs>
    </div>
  );
}

function OverviewTab() {
  const { data, isLoading, refetch } = trpc.gamification.getMyProfile.useQuery(undefined, { retry: false });
  const dailyMissions = trpc.gamification.getDailyMissions.useQuery(undefined, { retry: false });
  const completeMission = trpc.gamification.completeDailyMission.useMutation({
    onSuccess: () => { toast.success("Mission completed!"); refetch(); dailyMissions.refetch(); },
    onError: (err) => toast.error(err.message),
  });
  const { data: loyalty } = trpc.gamification.getLoyaltyInfo.useQuery(undefined, { retry: false });
  const { data: certs } = trpc.gamification.getMyCertificates.useQuery(undefined, { retry: false });

  if (isLoading) return <div className="grid gap-4 md:grid-cols-3">{[1,2,3].map(i => <Skeleton key={i} className="h-40" />)}</div>;
  const g = data?.gamification;
  const level = data?.levelInfo;

  return (
    <div className="space-y-6">
      {/* XP & Level Card */}
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.3 }}>
        <Card className="relative overflow-hidden bg-gradient-to-br from-slate-50 to-blue-50 border-blue-100">
          <CardContent className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-sm font-medium text-blue-600 flex items-center gap-1.5">
                  <Zap className="h-4 w-4" /> Level {level?.currentLevelNumber || 1}
                </p>
                <h2 className="text-2xl font-bold mt-1">{level?.currentLevel || "Beginner Maker"}</h2>
                <p className="text-sm text-muted-foreground mt-1">
                  {level?.nextLevelNumber && level?.nextLevelNumber > level?.currentLevelNumber
                    ? `${level?.xpToNext} XP to ${level?.nextLevel}`
                    : "Max level reached!"}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <div className="text-right">
                  <p className="text-2xl font-bold">{level?.totalXp?.toLocaleString() || 0}</p>
                  <p className="text-xs text-muted-foreground">Total XP</p>
                </div>
              </div>
            </div>
            <Progress value={level?.xpProgress || 0} className="h-2.5" />
            <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
              <span>{level?.currentLevel}</span>
              <span>{Math.round(level?.xpProgress || 0)}%</span>
              <span>{level?.nextLevel || "Max"}</span>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card><CardContent className="p-4 text-center">
            <Star className="h-6 w-6 text-amber-500 mx-auto mb-1" />
            <p className="text-lg font-bold">{data?.badges?.filter(b => b.earned).length || 0}/{data?.badges?.length || 0}</p>
            <p className="text-xs text-muted-foreground">Badges</p>
          </CardContent></Card>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
          <Card><CardContent className="p-4 text-center">
            <Award className="h-6 w-6 text-blue-500 mx-auto mb-1" />
            <p className="text-lg font-bold">{data?.achievements?.filter(a => a.completed).length || 0}/{data?.achievements?.length || 0}</p>
            <p className="text-xs text-muted-foreground">Achievements</p>
          </CardContent></Card>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card><CardContent className="p-4 text-center">
            <Gift className="h-6 w-6 text-green-500 mx-auto mb-1" />
            <p className="text-lg font-bold">{g?.points || 0}</p>
            <p className="text-xs text-muted-foreground">Points</p>
          </CardContent></Card>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
          <Card><CardContent className="p-4 text-center">
            <TrendingUp className="h-6 w-6 text-purple-500 mx-auto mb-1" />
            <p className="text-lg font-bold">{g?.streak || 0} days</p>
            <p className="text-xs text-muted-foreground">Streak</p>
          </CardContent></Card>
        </motion.div>
      </div>

      {/* Daily Missions */}
      <Card>
        <CardHeader><CardTitle className="text-lg flex items-center gap-2"><RefreshCw className="h-5 w-5" /> Daily Missions</CardTitle></CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
            {dailyMissions.data?.map((mission) => (
              <motion.div key={mission.id} whileHover={{ scale: 1.02 }} className={`rounded-lg border p-3 ${mission.completed ? "bg-green-50 border-green-200" : ""}`}>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-medium">{mission.title}</p>
                  {mission.completed ? <CheckCircle className="h-4 w-4 text-green-500" /> : <Zap className="h-4 w-4 text-amber-500" />}
                </div>
                <p className="text-xs text-muted-foreground mb-2">{mission.description} · +{mission.xpReward} XP</p>
                {!mission.completed && (
                  <Button size="sm" variant="outline" className="w-full text-xs" onClick={() => completeMission.mutate({ missionSlug: mission.slug })}>
                    Complete
                  </Button>
                )}
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Loyalty & Certificates */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader><CardTitle className="text-lg flex items-center gap-2"><ShoppingBag className="h-5 w-5" /> Loyalty Stamps</CardTitle></CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 mb-3">
              {Array.from({ length: Math.min(loyalty?.stamps || 0, 20) }).map((_, i) => (
                <motion.div key={i} initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: i * 0.05 }}
                  className="w-7 h-7 rounded-full bg-amber-100 border-2 border-amber-300 flex items-center justify-center text-xs">
                  ⭐
                </motion.div>
              ))}
              {Array.from({ length: Math.max(0, 10 - (loyalty?.stamps || 0)) }).map((_, i) => (
                <div key={i} className="w-7 h-7 rounded-full bg-slate-100 border-2 border-dashed border-slate-300" />
              ))}
            </div>
            <p className="text-sm text-muted-foreground">{loyalty?.stamps || 0} stamps earned · {loyalty?.totalPurchases || 0} purchases</p>
            <div className="space-y-2 mt-3">
              {loyalty?.tiers?.map((tier) => (
                <div key={tier.id} className={`text-xs p-2 rounded-lg ${tier.unlocked ? "bg-green-50 text-green-700" : "bg-slate-50 text-muted-foreground"}`}>
                  <span className="font-medium">{tier.rewardValue}</span> — {tier.description}
                  {!tier.unlocked && <span className="ml-1">({tier.requiredStamps - (loyalty?.stamps || 0)} more stamps)</span>}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-lg flex items-center gap-2"><FileText className="h-5 w-5" /> Certificates</CardTitle></CardHeader>
          <CardContent>
            {!certs?.length ? (
              <p className="text-sm text-muted-foreground text-center py-6">No certificates yet</p>
            ) : (
              <div className="space-y-2">
                {(certs as any[])?.map((cert: any) => (
                  <motion.div key={cert.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                    className="flex items-center justify-between p-2 rounded-lg border">
                    <div>
                      <p className="text-sm font-medium">{cert.title}</p>
                      <p className="text-xs text-muted-foreground">{cert.type} · {new Date(cert.issuedAt).toLocaleDateString()}</p>
                    </div>
                    {cert.certificateUrl && (
                      <Button size="sm" variant="ghost" asChild>
                        <a href={cert.certificateUrl} target="_blank"><ExternalLink className="h-3 w-3" /></a>
                      </Button>
                    )}
                  </motion.div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function BadgesTab() {
  const { data, isLoading } = trpc.gamification.getMyProfile.useQuery(undefined, { retry: false });
  if (isLoading) return <div className="grid gap-4 sm:grid-cols-3">{[1,2,3,4,5,6].map(i => <Skeleton key={i} className="h-32" />)}</div>;

  const badges = data?.badges || [];
  const earned = badges.filter(b => b.earned);
  const locked = badges.filter(b => !b.earned);

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {earned.map((badge, i) => (
          <motion.div key={badge.id} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.05 }}
            className="relative rounded-xl border-2 border-amber-200 bg-gradient-to-b from-amber-50 to-white p-4 text-center">
            <div className="text-3xl mb-2">🏅</div>
            <p className="font-semibold text-sm">{badge.name}</p>
            <p className="text-xs text-muted-foreground mt-1">{badge.description}</p>
            <Badge variant="outline" className="mt-2 text-amber-600 border-amber-300">+{badge.xpReward} XP</Badge>
          </motion.div>
        ))}
      </div>
      {locked.length > 0 && (
        <>
          <h3 className="font-medium text-muted-foreground">Locked Badges ({locked.length})</h3>
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {locked.map((badge) => (
              <div key={badge.id} className="rounded-xl border border-dashed border-slate-200 p-4 text-center opacity-60">
                <div className="text-3xl mb-2 grayscale">🏅</div>
                <p className="font-semibold text-sm">{badge.name}</p>
                <p className="text-xs text-muted-foreground mt-1">{badge.description}</p>
                <p className="text-xs text-blue-600 mt-1">???</p>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function RewardsTab() {
  const { data: rewards } = trpc.gamification.getStoreRewards.useQuery(undefined, { retry: false });
  const { data: profile, refetch: refetchProfile } = trpc.gamification.getMyProfile.useQuery(undefined, { retry: false });
  const redeem = trpc.gamification.redeemPoints.useMutation({ onSuccess: () => { toast.success("Reward redeemed!"); refetchProfile(); }, onError: (err) => toast.error(err.message) });
  const { data: referral } = trpc.gamification.getReferralCode.useQuery(undefined, { retry: false });
  const applyReferral = trpc.gamification.applyReferral.useMutation({ onSuccess: () => toast.success("Referral applied!"), onError: (err) => toast.error(err.message) });
  const [referralCode, setReferralCode] = useState("");

  const points = profile?.gamification?.points || 0;

  return (
    <div className="space-y-6">
      {/* Points Balance */}
      <Card className="bg-gradient-to-r from-purple-50 to-blue-50 border-blue-100">
        <CardContent className="p-6 flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">Available Points</p>
            <p className="text-3xl font-bold">{points.toLocaleString()}</p>
          </div>
          <Gift className="h-10 w-10 text-purple-500" />
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Points Store */}
        <div>
          <h3 className="font-semibold mb-3 flex items-center gap-2"><ShoppingBag className="h-4 w-4" /> Points Store</h3>
          <div className="space-y-3">
            {rewards?.map((reward) => (
              <motion.div key={reward.id} whileHover={{ scale: 1.01 }} className="flex items-center justify-between rounded-lg border p-4">
                <div>
                  <p className="font-medium text-sm">{reward.name}</p>
                  <p className="text-xs text-muted-foreground">{reward.description}</p>
                </div>
                <div className="text-right shrink-0 ml-3">
                  <p className="text-sm font-bold text-purple-600">{reward.pointsCost} pts</p>
                  <Button size="sm" variant={points >= reward.pointsCost ? "default" : "outline"} disabled={points < reward.pointsCost}
                    onClick={() => redeem.mutate({ rewardId: reward.id })}>
                    Redeem
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Referral */}
        <div>
          <h3 className="font-semibold mb-3 flex items-center gap-2"><Users className="h-4 w-4" /> Referrals</h3>
          <Card className="mb-4"><CardContent className="p-4">
            <p className="text-sm font-medium mb-1">Your Referral Code</p>
            <div className="flex items-center gap-2">
              <code className="flex-1 bg-slate-100 px-3 py-2 rounded text-sm font-mono">{referral?.code || "Loading..."}</code>
              <Button size="sm" variant="outline" onClick={() => { navigator.clipboard.writeText(referral?.code || ""); toast.success("Copied!"); }}>
                <Copy className="h-3 w-3" />
              </Button>
            </div>
          </CardContent></Card>

          <Card><CardContent className="p-4">
            <p className="text-sm font-medium mb-2">Apply Referral Code</p>
            <div className="flex gap-2">
              <input className="flex-1 border rounded px-3 py-2 text-sm" placeholder="Enter code" value={referralCode} onChange={(e) => setReferralCode(e.target.value.toUpperCase())} />
              <Button size="sm" onClick={() => applyReferral.mutate({ code: referralCode })}>Apply</Button>
            </div>
          </CardContent></Card>
        </div>
      </div>
    </div>
  );
}

function ChallengesTab() {
  const weekly = trpc.gamification.getWeeklyChallenges.useQuery(undefined, { retry: false });
  const monthly = trpc.gamification.getMonthlyChallenges.useQuery(undefined, { retry: false });

  return (
    <div className="space-y-6">
      {/* Weekly Challenges */}
      <Card>
        <CardHeader><CardTitle className="text-lg flex items-center gap-2"><Target className="h-5 w-5 text-blue-500" /> Weekly Challenges</CardTitle></CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-2">
            {weekly.data?.length ? weekly.data.map((c, i) => (
              <motion.div key={c.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
                className={`rounded-lg border p-4 ${c.completed ? "bg-green-50 border-green-200" : ""}`}>
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="font-medium text-sm">{c.title}</p>
                    <p className="text-xs text-muted-foreground">{c.description}</p>
                  </div>
                  {c.completed && <CheckCircle className="h-5 w-5 text-green-500 shrink-0" />}
                </div>
                <Progress value={c.completed ? 100 : Math.min(100, (c.progress / c.requirementGoal) * 100)} className="h-2 mb-1" />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>{c.progress}/{c.requirementGoal}</span>
                  <span className="text-amber-600">+{c.xpReward} XP</span>
                </div>
              </motion.div>
            )) : <p className="text-sm text-muted-foreground col-span-2 text-center py-4">No weekly challenges yet</p>}
          </div>
        </CardContent>
      </Card>

      {/* Monthly Challenges */}
      <Card>
        <CardHeader><CardTitle className="text-lg flex items-center gap-2"><Crown className="h-5 w-5 text-purple-500" /> Monthly Challenges</CardTitle></CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-2">
            {monthly.data?.length ? monthly.data.map((c, i) => (
              <motion.div key={c.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
                className={`rounded-lg border p-4 ${c.completed ? "bg-purple-50 border-purple-200" : ""}`}>
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="font-medium text-sm">{c.title}</p>
                    <p className="text-xs text-muted-foreground">{c.description}</p>
                  </div>
                  {c.completed && <CheckCircle className="h-5 w-5 text-purple-500 shrink-0" />}
                </div>
                <Progress value={c.completed ? 100 : Math.min(100, (c.progress / c.requirementGoal) * 100)} className="h-2 mb-1" />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>{c.progress}/{c.requirementGoal}</span>
                  <span className="text-purple-600">+{c.xpReward} XP</span>
                </div>
              </motion.div>
            )) : <p className="text-sm text-muted-foreground col-span-2 text-center py-4">No monthly challenges yet</p>}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function LeaderboardTab() {
  const [type, setType] = useState<string>("xp");
  const { data, isLoading } = trpc.gamification.getLeaderboard.useQuery({ type: type as any, limit: 20 }, { retry: false });

  return (
    <div className="space-y-4">
      <div className="flex gap-2 flex-wrap">
        {[
          { value: "xp", label: "Top XP", icon: Zap },
          { value: "projects", label: "Projects", icon: Rocket },
          { value: "blogs", label: "Blogs", icon: FileText },
          { value: "streak", label: "Streak", icon: TrendingUp },
        ].map(({ value, label, icon: Icon }) => (
          <Button key={value} size="sm" variant={type === value ? "default" : "outline"} onClick={() => setType(value)}>
            <Icon className="h-3.5 w-3.5 mr-1" /> {label}
          </Button>
        ))}
      </div>

      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-4 space-y-3">{[1,2,3,4,5].map(i => <Skeleton key={i} className="h-12 w-full" />)}</div>
          ) : (
            <div className="divide-y">
              {data?.map((entry, i) => (
                <motion.div key={entry.userId} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.03 }}
                  className="flex items-center gap-3 p-3">
                  <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                    i === 0 ? "bg-amber-100 text-amber-700" : i === 1 ? "bg-slate-100 text-slate-600" : i === 2 ? "bg-orange-100 text-orange-700" : "bg-muted text-muted-foreground"
                  }`}>{i + 1}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{entry.name}</p>
                    <p className="text-xs text-muted-foreground">{entry.title} · Level {entry.level}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-sm font-bold">{type === "xp" ? entry.value.toLocaleString() : entry.value}</p>
                    <p className="text-xs text-muted-foreground">{type === "xp" ? "XP" : type === "streak" ? "days" : "count"}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
