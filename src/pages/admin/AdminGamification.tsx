import { useState } from "react";
import { trpc } from "@/providers/trpc";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SectionHeader } from "@/components/admin/SectionHeader";
import {
  Zap, Award, Trophy, Gift, Target, Star, Shield, Save, Plus, Trash2, Crown, Sparkles,
} from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";

export default function AdminGamification() {
  const [activeTab, setActiveTab] = useState("xp");

  return (
    <div className="space-y-6 pb-20">
      <SectionHeader icon={Sparkles} title="Gamification" description="Manage XP values, badges, achievements, rewards, challenges, and certificates" />

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid grid-cols-3 md:grid-cols-7 w-full">
          <TabsTrigger value="xp"><Zap className="h-3.5 w-3.5 mr-1" /> XP</TabsTrigger>
          <TabsTrigger value="badges"><Award className="h-3.5 w-3.5 mr-1" /> Badges</TabsTrigger>
          <TabsTrigger value="achievements"><Trophy className="h-3.5 w-3.5 mr-1" /> Achievements</TabsTrigger>
          <TabsTrigger value="rewards"><Gift className="h-3.5 w-3.5 mr-1" /> Rewards</TabsTrigger>
          <TabsTrigger value="challenges"><Target className="h-3.5 w-3.5 mr-1" /> Challenges</TabsTrigger>
          <TabsTrigger value="spotlight"><Star className="h-3.5 w-3.5 mr-1" /> Spotlight</TabsTrigger>
          <TabsTrigger value="certs"><Shield className="h-3.5 w-3.5 mr-1" /> Certs</TabsTrigger>
        </TabsList>

        <TabsContent value="xp"><XpConfigTab /></TabsContent>
        <TabsContent value="badges"><BadgesAdminTab /></TabsContent>
        <TabsContent value="achievements"><AchievementsAdminTab /></TabsContent>
        <TabsContent value="rewards"><RewardsAdminTab /></TabsContent>
        <TabsContent value="challenges"><ChallengesAdminTab /></TabsContent>
        <TabsContent value="spotlight"><SpotlightAdminTab /></TabsContent>
        <TabsContent value="certs"><CertsAdminTab /></TabsContent>
      </Tabs>
    </div>
  );
}

function XpConfigTab() {
  const { data, isLoading, refetch } = trpc.gamification.getXpConfig.useQuery(undefined, { retry: false });
  const updateXp = trpc.gamification.updateXpConfig.useMutation({
    onSuccess: () => { toast.success("XP value updated"); refetch(); },
    onError: (err) => toast.error(err.message),
  });
  const seedData = trpc.gamification.seedDefaults.useMutation({
    onSuccess: () => { toast.success("Default data seeded"); refetch(); },
    onError: (err) => toast.error(err.message),
  });

  const [editValues, setEditValues] = useState<Record<string, number>>({});

  if (isLoading) return <div className="space-y-3">{[1,2,3].map(i => <Skeleton key={i} className="h-12 w-full" />)}</div>;

  const configs = Array.isArray(data) ? data : [];

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-lg">XP Values</CardTitle>
          <CardDescription>Edit how much XP users earn for each action</CardDescription>
        </div>
        <Button size="sm" variant="outline" onClick={() => seedData.mutate()} disabled={seedData.isPending}>
          <Save className="h-3 w-3 mr-1" /> Seed Defaults
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {configs.map((cfg: { action: string; xpValue: number; description?: string }) => (
            <motion.div key={cfg.action} layout className="flex items-center justify-between rounded-lg border p-3">
              <div className="flex-1">
                <p className="text-sm font-medium capitalize">{cfg.action.replace(/_/g, " ")}</p>
                <p className="text-xs text-muted-foreground">{cfg.description || ""}</p>
              </div>
              <div className="flex items-center gap-2 shrink-0 ml-3">
                <Input
                  type="number"
                  className="w-20 h-8 text-sm"
                  value={editValues[cfg.action] ?? cfg.xpValue}
                  onChange={(e) => setEditValues({ ...editValues, [cfg.action]: parseInt(e.target.value) || 0 })}
                />
                <Button size="sm" variant="ghost" className="h-8"
                  onClick={() => {
                    updateXp.mutate({ action: cfg.action, xpValue: editValues[cfg.action] ?? cfg.xpValue });
                    setEditValues((prev) => {
                      const next = { ...prev };
                      delete next[cfg.action];
                      return next;
                    });
                  }}>
                  <Save className="h-3 w-3" />
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function BadgesAdminTab() {
  const { data, isLoading } = trpc.gamification.getBadges.useQuery(undefined, { retry: false });

  if (isLoading) return <Skeleton className="h-40 w-full" />;

  return (
    <div>
      <p className="text-sm text-muted-foreground mb-4">Manage badges from the database. Badges are seeded with defaults.</p>
      <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {(data || []).map((badge: { id: number; name: string; description?: string | null; xpReward?: number | null; category?: string | null; requirementType?: string | null; slug: string }) => (
          <Card key={badge.id}>
            <CardContent className="p-4 text-center">
              <div className="text-2xl mb-2">🏅</div>
              <p className="font-medium text-sm">{badge.name}</p>
              <p className="text-xs text-muted-foreground">{badge.description}</p>
              <Badge variant="outline" className="mt-2">+{badge.xpReward || 0} XP</Badge>
              <p className="text-xs text-muted-foreground mt-1">{badge.category || "general"} · {badge.requirementType || "manual"}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

function AchievementsAdminTab() {
  const { data, isLoading } = trpc.gamification.getAchievements.useQuery(undefined, { retry: false });

  if (isLoading) return <Skeleton className="h-40 w-full" />;

  return (
    <div className="grid gap-3 md:grid-cols-2">
      {(data || []).map((ach: any) => (
        <Card key={ach.id}>
          <CardContent className="p-4">
            <div className="flex items-start justify-between">
              <div>
                <p className="font-medium text-sm">{ach.name}</p>
                <p className="text-xs text-muted-foreground">{ach.description}</p>
                <div className="flex gap-2 mt-2">
                  <Badge variant="outline" className="text-amber-600">+{ach.xpReward || 0} XP</Badge>
                  {(ach.pointsReward ?? 0) > 0 && <Badge variant="outline" className="text-purple-600">+{ach.pointsReward} pts</Badge>}
                </div>
              </div>
            </div>
            <div className="mt-2">
              <p className="text-xs text-muted-foreground mb-1">Goal: {ach.requirementGoal} {(ach.requirementType || "").replace(/_/g, " ")}</p>
              <Progress value={ach.completed ? 100 : Math.min(100, ((ach.progress || 0) / ach.requirementGoal) * 100)} className="h-1.5" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function RewardsAdminTab() {
  const { data, isLoading } = trpc.gamification.getStoreRewards.useQuery(undefined, { retry: false });

  if (isLoading) return <Skeleton className="h-40 w-full" />;

  return (
    <div className="grid gap-3 md:grid-cols-2">
      {(data || []).map((reward: { id: number; name: string; description?: string | null; pointsCost: number; stock?: number | null; rewardType?: string | null }) => (
        <Card key={reward.id}>
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="font-medium text-sm">{reward.name}</p>
              <p className="text-xs text-muted-foreground">{reward.description}</p>
              <p className="text-xs text-muted-foreground mt-1">Stock: {reward.stock === -1 ? "Unlimited" : reward.stock} · {reward.rewardType || "reward"}</p>
            </div>
            <Badge className="text-purple-600 shrink-0">{reward.pointsCost} pts</Badge>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function ChallengesAdminTab() {
  return (
    <Card>
      <CardHeader><CardTitle className="text-lg">Weekly Challenges</CardTitle></CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">Challenges are managed through the database. Use the seed defaults to populate initial challenges, or insert them directly.</p>
      </CardContent>
    </Card>
  );
}

function SpotlightAdminTab() {
  const { data, isLoading, refetch } = trpc.gamification.getSpotlights.useQuery(undefined, { retry: false });
  const add = trpc.gamification.addToSpotlight.useMutation({
    onSuccess: () => { toast.success("Added to spotlight"); refetch(); },
    onError: (err) => toast.error(err.message),
  });
  const remove = trpc.gamification.removeFromSpotlight.useMutation({
    onSuccess: () => { toast.success("Removed from spotlight"); refetch(); },
    onError: (err) => toast.error(err.message),
  });
  const [userId, setUserId] = useState("");
  const [reason, setReason] = useState("");

  if (isLoading) return <Skeleton className="h-40 w-full" />;

  return (
    <div className="space-y-4">
      <Card>
        <CardContent className="p-4 flex gap-3 items-end">
          <div className="space-y-1 flex-1">
            <Label className="text-xs">User ID</Label>
            <Input type="number" value={userId} onChange={(e) => setUserId(e.target.value)} />
          </div>
          <div className="space-y-1 flex-1">
            <Label className="text-xs">Reason</Label>
            <Input value={reason} onChange={(e) => setReason(e.target.value)} />
          </div>
          <Button onClick={() => add.mutate({ userId: Number(userId), reason })} disabled={!userId || add.isPending}>
            <Plus className="h-3 w-3 mr-1" /> Add
          </Button>
        </CardContent>
      </Card>

      {(data || []).map((entry: any) => {
        const creator = entry.makerSpotlight || entry;
        const user = entry.users || {};
        return (
          <div key={creator.id} className="flex items-center justify-between rounded-lg border p-3">
            <div className="flex items-center gap-3">
              <Crown className="h-5 w-5 text-amber-500" />
              <div>
                <p className="text-sm font-medium">{user.name || `User #${creator.userId}`}</p>
                <p className="text-xs text-muted-foreground">{creator.reason} · {creator.month}</p>
              </div>
            </div>
            <Button size="sm" variant="ghost" className="text-destructive" onClick={() => remove.mutate({ id: creator.id })} disabled={remove.isPending}>
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>
        );
      })}
    </div>
  );
}

function CertsAdminTab() {
  const [form, setForm] = useState({ userId: "", type: "competition", title: "", description: "", certificateUrl: "" });
  const issue = trpc.gamification.issueCertificate.useMutation({
    onSuccess: () => {
      toast.success("Certificate issued");
      setForm({ userId: "", type: "competition", title: "", description: "", certificateUrl: "" });
    },
    onError: (err) => toast.error(err.message),
  });

  return (
    <Card>
      <CardHeader><CardTitle>Issue Certificate</CardTitle></CardHeader>
      <CardContent className="space-y-3">
        <div className="grid gap-3 md:grid-cols-2">
          <div className="space-y-1"><Label className="text-xs">User ID</Label><Input type="number" value={form.userId} onChange={(e) => setForm({...form, userId: e.target.value})} /></div>
          <div className="space-y-1"><Label className="text-xs">Type</Label><Input value={form.type} onChange={(e) => setForm({...form, type: e.target.value})} /></div>
        </div>
        <div className="space-y-1"><Label className="text-xs">Title</Label><Input value={form.title} onChange={(e) => setForm({...form, title: e.target.value})} /></div>
        <div className="space-y-1"><Label className="text-xs">Description</Label><Textarea value={form.description} onChange={(e) => setForm({...form, description: e.target.value})} rows={2} /></div>
        <div className="space-y-1"><Label className="text-xs">Certificate URL (optional)</Label><Input value={form.certificateUrl} onChange={(e) => setForm({...form, certificateUrl: e.target.value})} /></div>
        <Button onClick={() => issue.mutate({
          userId: Number(form.userId),
          type: form.type,
          title: form.title,
          description: form.description || undefined,
          certificateUrl: form.certificateUrl || undefined,
        })} disabled={!form.userId || !form.title || issue.isPending}>
          <Shield className="h-3 w-3 mr-1" /> Issue Certificate
        </Button>
      </CardContent>
    </Card>
  );
}
