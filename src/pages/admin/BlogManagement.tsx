import { useState } from "react";
import { trpc } from "@/providers/trpc";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import {
  FileText, Trash2, Search, Eye, Plus, Pencil,
} from "lucide-react";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";

export default function BlogManagement() {
  const { data, isLoading, refetch } = trpc.admin.getAllContent.useQuery(undefined, { retry: false });
  const deleteContent = trpc.admin.deleteUserContent.useMutation({
    onSuccess: () => { toast.success("Blog deleted"); refetch(); },
  });

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isOpen, setIsOpen] = useState(false);
  const [editingBlog, setEditingBlog] = useState<any>(null);
  const [form, setForm] = useState({
    title: "", excerpt: "", content: "", category: "",
    seoTitle: "", seoDescription: "", seoKeywords: "", status: "draft",
  });

  const createBlog = { isPending: false } as any;

  const resetForm = () => {
    setEditingBlog(null);
    setForm({ title: "", excerpt: "", content: "", category: "", seoTitle: "", seoDescription: "", seoKeywords: "", status: "draft" });
  };

  const openCreate = () => {
    resetForm();
    setIsOpen(true);
  };

  const openEdit = (blog: any) => {
    setEditingBlog(blog);
    setForm({
      title: blog.title || "",
      excerpt: blog.excerpt || "",
      content: blog.content || "",
      category: blog.category || "",
      seoTitle: blog.seoTitle || "",
      seoDescription: blog.seoDescription || "",
      seoKeywords: Array.isArray(blog.seoKeywords) ? blog.seoKeywords.join(", ") : blog.seoKeywords || "",
      status: blog.status || "draft",
    });
    setIsOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success(editingBlog
      ? "Blog update requires a dedicated API endpoint"
      : "Blog creation requires a dedicated API endpoint");
    setIsOpen(false);
    resetForm();
  };

  if (isLoading) return <div className="space-y-3">{[1,2,3].map((i: number) => <Skeleton key={i} className="h-16 w-full" />)}</div>;

  const blogs = data?.allBlogs || [];
  const filtered = blogs.filter((b: any) => {
    const matchesSearch = b.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || b.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2"><FileText className="h-6 w-6" /> Blog Management</h1>
          <p className="text-muted-foreground mt-1 text-sm">Create, edit, and manage all blog content</p>
        </div>
        <Button onClick={openCreate}><Plus className="h-4 w-4 mr-2" /> Create Blog</Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search blogs..."
            className="pl-9"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="draft">Drafts</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="approved">Approved</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
            <SelectItem value="changes_requested">Changes Requested</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Create/Edit Dialog */}
      <Dialog open={isOpen} onOpenChange={(open) => { if (!open) { setIsOpen(false); resetForm(); } }}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editingBlog ? "Edit Blog" : "Create Blog"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label>Title *</Label>
              <Input value={form.title} onChange={(e) => setForm({...form, title: e.target.value})} required />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Category</Label>
                <Input value={form.category} onChange={(e) => setForm({...form, category: e.target.value})} placeholder="e.g. Tutorial, News" />
              </div>
              <div className="space-y-2">
                <Label>Status</Label>
                <Select value={form.status} onValueChange={(v: string) => setForm({...form, status: v})}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="pending">Pending Approval</SelectItem>
                    <SelectItem value="approved">Published</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Excerpt</Label>
              <Textarea value={form.excerpt} onChange={(e) => setForm({...form, excerpt: e.target.value})} rows={2} />
            </div>
            <div className="space-y-2">
              <Label>Content</Label>
              <Textarea value={form.content} onChange={(e) => setForm({...form, content: e.target.value})} rows={6} />
            </div>

            {/* SEO Metadata */}
            <div className="border rounded-lg p-4 space-y-3">
              <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <Eye className="h-4 w-4" /> SEO Metadata
              </div>
              <div className="space-y-2">
                <Label>SEO Title</Label>
                <Input value={form.seoTitle} onChange={(e) => setForm({...form, seoTitle: e.target.value})} placeholder="Custom title for search engines" />
              </div>
              <div className="space-y-2">
                <Label>SEO Description</Label>
                <Textarea value={form.seoDescription} onChange={(e) => setForm({...form, seoDescription: e.target.value})} rows={2} />
              </div>
              <div className="space-y-2">
                <Label>SEO Keywords (comma-separated)</Label>
                <Input value={form.seoKeywords} onChange={(e) => setForm({...form, seoKeywords: e.target.value})} placeholder="keyword1, keyword2, keyword3" />
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => { setIsOpen(false); resetForm(); }}>Cancel</Button>
              <Button type="submit" disabled={createBlog.isPending}>{editingBlog ? "Update" : "Create"}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {filtered.length === 0 ? (
        <Card><CardContent className="text-center py-12 text-muted-foreground">No blogs found</CardContent></Card>
      ) : (
        <div className="space-y-3">
          {filtered.map((blog: any) => (
            <Card key={blog.id} className="hover:shadow-sm transition-shadow">
              <CardContent className="p-4 flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <FileText className="h-4 w-4 text-blue-500 shrink-0" />
                    <h3 className="font-medium truncate">{blog.title}</h3>
                    <StatusBadge status={blog.status} />
                    {blog.category && (
                      <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full shrink-0">{blog.category}</span>
                    )}
                  </div>
                  {blog.excerpt && (
                    <p className="text-sm text-muted-foreground line-clamp-1">{blog.excerpt}</p>
                  )}
                  <div className="flex items-center gap-3 mt-1.5 text-xs text-muted-foreground">
                    <span>by {blog.userId}</span>
                    <span>{formatDistanceToNow(new Date(blog.createdAt), { addSuffix: true })}</span>
                    {blog.seoTitle && <span className="flex items-center gap-1"><Eye className="h-3 w-3" />SEO</span>}
                  </div>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <Button size="sm" variant="ghost" onClick={() => openEdit(blog)}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="ghost" className="text-destructive" onClick={() => { if (confirm("Delete this blog?")) deleteContent.mutate({ type: "blog", id: blog.id }); }}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
