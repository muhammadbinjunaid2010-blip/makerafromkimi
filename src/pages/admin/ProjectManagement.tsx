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
  FolderGit2, Trash2, Search, Star, Plus, Pencil,
} from "lucide-react";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";

export default function ProjectManagement() {
  const { data, isLoading, refetch } = trpc.admin.getAllContent.useQuery(undefined, { retry: false });
  const deleteContent = trpc.admin.deleteUserContent.useMutation({
    onSuccess: () => { toast.success("Project deleted"); refetch(); },
  });
  const toggleFeatured = trpc.admin.toggleFeaturedProject.useMutation({
    onSuccess: () => { toast.success("Featured status updated"); refetch(); },
  });

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isOpen, setIsOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<any>(null);
  const [form, setForm] = useState({
    title: "", description: "", content: "", category: "",
    difficulty: "", componentsUsed: "", status: "draft",
  });

  const resetForm = () => {
    setEditingProject(null);
    setForm({ title: "", description: "", content: "", category: "", difficulty: "", componentsUsed: "", status: "draft" });
  };

  const openCreate = () => {
    resetForm();
    setIsOpen(true);
  };

  const openEdit = (project: any) => {
    setEditingProject(project);
    setForm({
      title: project.title || "",
      description: project.description || "",
      content: project.content || "",
      category: project.category || "",
      difficulty: project.difficulty || "",
      componentsUsed: project.componentsUsed || "",
      status: project.status || "draft",
    });
    setIsOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success(editingProject ? "Project update requires a dedicated API endpoint" : "Project creation requires a dedicated API endpoint");
    setIsOpen(false);
    resetForm();
  };

  if (isLoading) return <div className="space-y-3">{[1,2,3].map((i: number) => <Skeleton key={i} className="h-16 w-full" />)}</div>;

  const projects = data?.allProjects || [];
  const filtered = projects.filter((p: any) => {
    const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || p.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2"><FolderGit2 className="h-6 w-6" /> Project Management</h1>
          <p className="text-muted-foreground mt-1 text-sm">Create, edit, and manage community projects</p>
        </div>
        <Button onClick={openCreate}><Plus className="h-4 w-4 mr-2" /> Add Project</Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search projects..."
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
            <DialogTitle>{editingProject ? "Edit Project" : "Add Project"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label>Title *</Label>
              <Input value={form.title} onChange={(e) => setForm({...form, title: e.target.value})} required />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Category</Label>
                <Input value={form.category} onChange={(e) => setForm({...form, category: e.target.value})} placeholder="e.g. Robotics, 3D Printing" />
              </div>
              <div className="space-y-2">
                <Label>Difficulty</Label>
                <Select value={form.difficulty} onValueChange={(v: string) => setForm({...form, difficulty: v})}>
                  <SelectTrigger><SelectValue placeholder="Select difficulty" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Beginner">Beginner</SelectItem>
                    <SelectItem value="Intermediate">Intermediate</SelectItem>
                    <SelectItem value="Advanced">Advanced</SelectItem>
                    <SelectItem value="All Levels">All Levels</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
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
              <div className="space-y-2">
                <Label>Components Used</Label>
                <Input value={form.componentsUsed} onChange={(e) => setForm({...form, componentsUsed: e.target.value})} placeholder="e.g. Arduino, Raspberry Pi" />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea value={form.description} onChange={(e) => setForm({...form, description: e.target.value})} rows={2} />
            </div>
            <div className="space-y-2">
              <Label>Content</Label>
              <Textarea value={form.content} onChange={(e) => setForm({...form, content: e.target.value})} rows={6} />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => { setIsOpen(false); resetForm(); }}>Cancel</Button>
              <Button type="submit">{editingProject ? "Update" : "Create"}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {filtered.length === 0 ? (
        <Card><CardContent className="text-center py-12 text-muted-foreground">No projects found</CardContent></Card>
      ) : (
        <div className="space-y-3">
          {filtered.map((project: any) => (
            <Card key={project.id} className="hover:shadow-sm transition-shadow">
              <CardContent className="p-4 flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    {project.featured && <Star className="h-4 w-4 text-amber-500 fill-amber-500" />}
                    <FolderGit2 className="h-4 w-4 text-purple-500 shrink-0" />
                    <h3 className="font-medium truncate">{project.title}</h3>
                    <StatusBadge status={project.status} />
                    {project.difficulty && (
                      <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${
                        project.difficulty === "Beginner" ? "bg-green-100 text-green-700" :
                        project.difficulty === "Intermediate" ? "bg-amber-100 text-amber-700" :
                        "bg-red-100 text-red-700"
                      }`}>{project.difficulty}</span>
                    )}
                    {project.category && (
                      <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">{project.category}</span>
                    )}
                  </div>
                  {project.description && (
                    <p className="text-sm text-muted-foreground line-clamp-1">{project.description}</p>
                  )}
                  <div className="flex items-center gap-3 mt-1.5 text-xs text-muted-foreground">
                    <span>by {project.userId}</span>
                    <span>{formatDistanceToNow(new Date(project.createdAt), { addSuffix: true })}</span>
                    {project.componentsUsed && <span>Components: {project.componentsUsed}</span>}
                  </div>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <Button size="sm" variant="ghost" className={project.featured ? "text-amber-500" : ""}
                    onClick={() => toggleFeatured.mutate({ id: project.id, featured: !project.featured })}>
                    <Star className={`h-4 w-4 ${project.featured ? "fill-amber-500" : ""}`} />
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => openEdit(project)}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="ghost" className="text-destructive"
                    onClick={() => { if (confirm("Delete this project?")) deleteContent.mutate({ type: "project", id: project.id }); }}>
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
