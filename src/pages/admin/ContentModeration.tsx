import { useState } from "react";
import { trpc } from "@/providers/trpc";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import {
  FolderGit2, FileText, Check, X, Eye, MessageSquare, ThumbsDown, Send,
} from "lucide-react";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";

export default function ContentModeration() {
  const { data, isLoading, refetch } = trpc.admin.getPendingContent.useQuery(undefined, { retry: false });
  const approveProject = trpc.admin.approveProject.useMutation({
    onSuccess: () => { toast.success("Project approved"); refetch(); },
  });
  const approveBlog = trpc.admin.approveBlog.useMutation({
    onSuccess: () => { toast.success("Blog approved"); refetch(); },
  });
  const rejectContent = trpc.admin.rejectContent.useMutation({
    onSuccess: () => { toast.success("Content rejected"); refetch(); setRejectDialog(null); },
  });
  const requestChanges = trpc.admin.requestChanges.useMutation({
    onSuccess: () => { toast.success("Changes requested"); refetch(); setFeedbackDialog(null); },
  });
  const deleteContent = trpc.admin.deleteUserContent.useMutation({
    onSuccess: () => { toast.success("Content removed"); refetch(); },
  });

  const [rejectDialog, setRejectDialog] = useState<{ type: "project" | "blog"; id: number } | null>(null);
  const [rejectFeedback, setRejectFeedback] = useState("");
  const [feedbackDialog, setFeedbackDialog] = useState<{ type: "project" | "blog"; id: number } | null>(null);
  const [feedbackMsg, setFeedbackMsg] = useState("");
  const [previewItem, setPreviewItem] = useState<any>(null);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Approval Queue</h1>
        <p className="text-muted-foreground mt-1 text-sm">Review, approve, or reject community content</p>
      </div>

      <Tabs defaultValue="projects">
        <TabsList>
          <TabsTrigger value="projects">
            <FolderGit2 className="h-4 w-4 mr-1.5" />
            Projects ({data?.pendingProjects.length || 0})
          </TabsTrigger>
          <TabsTrigger value="blogs">
            <FileText className="h-4 w-4 mr-1.5" />
            Blogs ({data?.pendingBlogs.length || 0})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="projects" className="mt-4">
          {isLoading ? (
            <div className="space-y-3">{[1,2,3].map(i => <Skeleton key={i} className="h-24 w-full" />)}</div>
          ) : !data?.pendingProjects.length ? (
            <Card><CardContent className="text-center py-12 text-muted-foreground">No pending projects</CardContent></Card>
          ) : (
            <div className="space-y-3">
              {data.pendingProjects.map((project: any) => (
                <Card key={project.id}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <FolderGit2 className="h-4 w-4 text-purple-500 shrink-0" />
                          <h3 className="font-semibold">{project.title}</h3>
                          {project.difficulty && (
                            <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${
                              project.difficulty === "Beginner" ? "bg-green-100 text-green-700" :
                              project.difficulty === "Intermediate" ? "bg-amber-100 text-amber-700" :
                              "bg-red-100 text-red-700"
                            }`}>{project.difficulty}</span>
                          )}
                        </div>
                        {project.description && (
                          <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{project.description}</p>
                        )}
                        <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                          <span>User #{project.userId}</span>
                          {project.category && <span>{project.category}</span>}
                          {project.componentsUsed && <span>Components: {project.componentsUsed}</span>}
                          <span>{formatDistanceToNow(new Date(project.createdAt), { addSuffix: true })}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        <Button size="sm" variant="ghost" onClick={() => setPreviewItem(project)}>
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => setFeedbackDialog({ type: "project", id: project.id })}>
                          <MessageSquare className="h-4 w-4 text-purple-600" />
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => setRejectDialog({ type: "project", id: project.id })}>
                          <ThumbsDown className="h-4 w-4 text-red-500" />
                        </Button>
                        <Button size="sm" variant="ghost" className="text-green-600"
                          onClick={() => approveProject.mutate({ id: project.id })}>
                          <Check className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="ghost" className="text-destructive"
                          onClick={() => { if (confirm("Delete this project?")) deleteContent.mutate({ type: "project", id: project.id }); }}>
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="blogs" className="mt-4">
          {isLoading ? (
            <div className="space-y-3">{[1,2,3].map(i => <Skeleton key={i} className="h-24 w-full" />)}</div>
          ) : !data?.pendingBlogs.length ? (
            <Card><CardContent className="text-center py-12 text-muted-foreground">No pending blogs</CardContent></Card>
          ) : (
            <div className="space-y-3">
              {data.pendingBlogs.map((blog: any) => (
                <Card key={blog.id}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4 text-green-500 shrink-0" />
                          <h3 className="font-semibold">{blog.title}</h3>
                          {blog.category && (
                            <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">{blog.category}</span>
                          )}
                        </div>
                        {blog.excerpt && (
                          <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{blog.excerpt}</p>
                        )}
                        <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                          <span>User #{blog.userId}</span>
                          {blog.seoTitle && <span>SEO: {blog.seoTitle}</span>}
                          <span>{formatDistanceToNow(new Date(blog.createdAt), { addSuffix: true })}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        <Button size="sm" variant="ghost" onClick={() => setPreviewItem(blog)}>
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => setFeedbackDialog({ type: "blog", id: blog.id })}>
                          <MessageSquare className="h-4 w-4 text-purple-600" />
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => setRejectDialog({ type: "blog", id: blog.id })}>
                          <ThumbsDown className="h-4 w-4 text-red-500" />
                        </Button>
                        <Button size="sm" variant="ghost" className="text-green-600"
                          onClick={() => approveBlog.mutate({ id: blog.id })}>
                          <Check className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="ghost" className="text-destructive"
                          onClick={() => { if (confirm("Delete this blog?")) deleteContent.mutate({ type: "blog", id: blog.id }); }}>
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Preview Dialog */}
      <Dialog open={!!previewItem} onOpenChange={() => setPreviewItem(null)}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{previewItem?.title || "Preview"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {previewItem?.image && (
              <img src={previewItem.image} alt="" className="w-full rounded-lg object-cover max-h-64" />
            )}
            {previewItem?.excerpt && (
              <p className="text-muted-foreground">{previewItem.excerpt}</p>
            )}
            {previewItem?.description && (
              <p className="text-muted-foreground">{previewItem.description}</p>
            )}
            {previewItem?.content && (
              <div className="prose prose-sm max-w-none">
                <p>{previewItem.content}</p>
              </div>
            )}
            {previewItem?.tags && previewItem.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {previewItem.tags.map((tag: string) => (
                  <span key={tag} className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full">{tag}</span>
                ))}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Reject Dialog */}
      <Dialog open={!!rejectDialog} onOpenChange={() => setRejectDialog(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>Reject Content</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Feedback to author (optional)</Label>
              <Textarea value={rejectFeedback} onChange={(e) => setRejectFeedback(e.target.value)}
                placeholder="Explain why this content was rejected..." />
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setRejectDialog(null)}>Cancel</Button>
              <Button variant="destructive" onClick={() => {
                if (rejectDialog) rejectContent.mutate({ type: rejectDialog.type, id: rejectDialog.id, feedback: rejectFeedback });
                setRejectFeedback("");
              }}>Reject</Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>

      {/* Request Changes Dialog */}
      <Dialog open={!!feedbackDialog} onOpenChange={() => setFeedbackDialog(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>Request Changes</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Feedback for author</Label>
              <Textarea value={feedbackMsg} onChange={(e) => setFeedbackMsg(e.target.value)}
                placeholder="Describe what changes are needed..." />
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setFeedbackDialog(null)}>Cancel</Button>
              <Button onClick={() => {
                if (feedbackDialog) requestChanges.mutate({ type: feedbackDialog.type, id: feedbackDialog.id, feedback: feedbackMsg });
                setFeedbackMsg("");
              }}>
                <Send className="h-4 w-4 mr-1" /> Send Feedback
              </Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
