import { useState } from "react";
import { trpc } from "@/providers/trpc";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StatusBadge } from "@/components/admin/StatusBadge";
import {
  MessageSquare, Flag, Star, UserPlus, Trash2, Check, X,
} from "lucide-react";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";

export default function CommunityManagement() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2"><MessageSquare className="h-6 w-6" /> Community Management</h1>
        <p className="text-muted-foreground mt-1 text-sm">Manage members, comments, reports, and featured creators</p>
      </div>

      <Tabs defaultValue="reports">
        <TabsList>
          <TabsTrigger value="reports">Reports</TabsTrigger>
          <TabsTrigger value="comments">Comments</TabsTrigger>
          <TabsTrigger value="featured">Featured Creators</TabsTrigger>
          <TabsTrigger value="members">Members</TabsTrigger>
        </TabsList>

        <TabsContent value="reports" className="mt-4"><ReportsTab /></TabsContent>
        <TabsContent value="comments" className="mt-4"><CommentsTab /></TabsContent>
        <TabsContent value="featured" className="mt-4"><FeaturedCreatorsTab /></TabsContent>
        <TabsContent value="members" className="mt-4"><MembersTab /></TabsContent>
      </Tabs>
    </div>
  );
}

function ReportsTab() {
  const { data: reports, isLoading, refetch } = trpc.admin.getReports.useQuery(undefined, { retry: false });
  const updateReport = trpc.admin.updateReport.useMutation({
    onSuccess: () => { toast.success("Report updated"); refetch(); },
  });

  if (isLoading) return <div className="space-y-3">{[1,2,3].map((i: number) => <Skeleton key={i} className="h-20 w-full" />)}</div>;

  return (
    <div className="space-y-3">
      {!reports || reports.length === 0 ? (
        <Card><CardContent className="text-center py-12 text-muted-foreground">No reports to review</CardContent></Card>
      ) : (
        (reports as any[]).map((report: any) => (
          <Card key={report.id}>
            <CardContent className="p-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <Flag className="h-4 w-4 text-red-500" />
                    <h3 className="font-medium text-sm">Report #{report.id}</h3>
                    <StatusBadge status={report.status} />
                  </div>
                  <p className="text-sm text-muted-foreground mt-1"><strong>Reason:</strong> {report.reason}</p>
                  {report.description && <p className="text-sm text-muted-foreground">{report.description}</p>}
                  <p className="text-xs text-muted-foreground mt-2">
                    Content: {report.contentType} #{report.contentId} &middot; {formatDistanceToNow(new Date(report.createdAt), { addSuffix: true })}
                  </p>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <Button size="sm" variant="outline" onClick={() => updateReport.mutate({ id: report.id, status: "dismissed" })}>
                    <X className="h-3 w-3 mr-1" /> Dismiss
                  </Button>
                  <Button size="sm" variant="default" onClick={() => updateReport.mutate({ id: report.id, status: "actioned" })}>
                    <Check className="h-3 w-3 mr-1" /> Action
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
}

function CommentsTab() {
  trpc.admin.getComments.useQuery(
    { contentType: "project", contentId: 0 },
    { retry: false, enabled: false },
  );

  return (
    <Card>
      <CardContent className="text-center py-12 text-muted-foreground">
        <MessageSquare className="h-8 w-8 mx-auto mb-3 opacity-50" />
        <p>Select content to view and moderate its comments.</p>
        <p className="text-xs mt-2">Comment moderation becomes available once content is created with community commenting enabled.</p>
      </CardContent>
    </Card>
  );
}

function FeaturedCreatorsTab() {
  const { data, isLoading, refetch } = trpc.admin.getFeaturedCreators.useQuery(undefined, { retry: false });
  const remove = trpc.admin.removeFeaturedCreator.useMutation({
    onSuccess: () => { toast.success("Creator removed from featured"); refetch(); },
  });

  const [isOpen, setIsOpen] = useState(false);
  const [userId, setUserId] = useState("");
  const [reason, setReason] = useState("");
  const add = trpc.admin.addFeaturedCreator.useMutation({
    onSuccess: () => { toast.success("Creator featured"); refetch(); setIsOpen(false); setUserId(""); setReason(""); },
  });

  if (isLoading) return <div className="space-y-3">{[1,2,3].map((i: number) => <Skeleton key={i} className="h-16 w-full" />)}</div>;

  // The API returns join results. Handle both Drizzle join shapes.
  const items: any[] = Array.isArray(data) ? data : [];
  const creators = items.map((item: any) => {
    // Handle flat join or nested join result
    const creator = item.featuredCreators || item.featured_creators || item;
    const user = item.users || item.user || {};
    return {
      id: creator.id,
      userId: creator.userId,
      reason: creator.reason,
      isActive: creator.isActive,
      createdAt: creator.createdAt,
      userName: user.name || user.userName,
      userEmail: user.email,
    };
  });

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <Button onClick={() => setIsOpen(true)}><UserPlus className="h-4 w-4 mr-2" /> Add Featured Creator</Button>
          <DialogContent>
            <DialogHeader><DialogTitle>Add Featured Creator</DialogTitle></DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2"><Label>User ID</Label><Input type="number" value={userId} onChange={(e) => setUserId(e.target.value)} /></div>
              <div className="space-y-2"><Label>Reason</Label><Textarea value={reason} onChange={(e) => setReason(e.target.value)} placeholder="Why is this creator being featured?" /></div>
              <DialogFooter><Button onClick={() => add.mutate({ userId: Number(userId), reason })} disabled={!userId}>Add</Button></DialogFooter>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {creators.length === 0 ? (
        <Card><CardContent className="text-center py-12 text-muted-foreground">No featured creators yet</CardContent></Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {creators.map((item) => (
            <Card key={item.id}>
              <CardContent className="p-5">
                <div className="flex items-center gap-3 mb-3">
                  <Star className="h-5 w-5 text-amber-500 fill-amber-500" />
                  <div>
                    <p className="font-medium">{item.userName || `User #${item.userId}`}</p>
                    {item.userEmail && <p className="text-xs text-muted-foreground">{item.userEmail}</p>}
                  </div>
                </div>
                {item.reason && (
                  <p className="text-sm text-muted-foreground mb-3">{item.reason}</p>
                )}
                <Button size="sm" variant="outline" className="text-destructive"
                  onClick={() => remove.mutate({ userId: item.userId })}>
                  <Trash2 className="h-3 w-3 mr-1" /> Remove
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

function MembersTab() {
  const { data, isLoading } = trpc.admin.getUsers.useQuery({ page: 1, limit: 50 }, { retry: false });

  if (isLoading) return <div className="space-y-3">{[1,2,3].map((i: number) => <Skeleton key={i} className="h-12 w-full" />)}</div>;

  return (
    <Card>
      <CardContent className="p-0">
        <div className="divide-y">
          {data?.users.map((user: any) => (
            <div key={user.id} className="flex items-center gap-3 p-4">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold shrink-0">
                {user.name?.charAt(0)?.toUpperCase() || "?"}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{user.name || "Unnamed"}</p>
                <p className="text-xs text-muted-foreground truncate">{user.email || "No email"}</p>
              </div>
              <Badge variant="outline">{user.role}</Badge>
              <span className="text-xs text-muted-foreground shrink-0">
                {formatDistanceToNow(new Date(user.createdAt), { addSuffix: true })}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
