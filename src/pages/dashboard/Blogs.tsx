import { trpc } from "@/providers/trpc";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { FileText, Plus, ExternalLink, Trash2, Eye, EyeOff } from "lucide-react";
import { Link } from "react-router";
import { formatDistanceToNow } from "date-fns";
import { toast } from "sonner";

export default function BlogsPage() {
  const { data: blogs, isLoading, refetch } = trpc.user.getMyBlogs.useQuery(undefined, {
    retry: false,
  });
  const deleteMutation = trpc.user.deleteBlog.useMutation({
    onSuccess: () => {
      refetch();
      toast.success("Blog post deleted");
    },
    onError: (err) => toast.error(err.message),
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <div className="space-y-4">
          {[1, 2].map((i) => (
            <Skeleton key={i} className="h-32 w-full" />
          ))}
        </div>
      </div>
    );
  }

  const items = blogs || [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <FileText className="h-6 w-6 text-green-500" />
            My Blog Posts
          </h1>
          <p className="text-muted-foreground mt-1">
            Write and manage your blog posts
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          New Post
        </Button>
      </div>

      {items.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <FileText className="h-12 w-12 text-muted-foreground/50 mb-4" />
            <h3 className="text-lg font-medium mb-1">No blog posts yet</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Share your knowledge and experience with the community
            </p>
            <Button variant="outline">
              <Plus className="h-4 w-4 mr-2" />
              Write your first post
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {items.map((blog) => (
            <Card key={blog.id} className="hover:shadow-sm transition-shadow">
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium truncate">{blog.title}</h3>
                      {blog.published ? (
                        <Badge variant="secondary" className="shrink-0">
                          <Eye className="h-3 w-3 mr-1" />
                          Published
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="shrink-0">
                          <EyeOff className="h-3 w-3 mr-1" />
                          Draft
                        </Badge>
                      )}
                    </div>
                    {blog.excerpt && (
                      <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                        {blog.excerpt}
                      </p>
                    )}
                    <div className="flex items-center gap-3 mt-2">
                      <span className="text-xs text-muted-foreground">
                        {formatDistanceToNow(new Date(blog.createdAt), { addSuffix: true })}
                      </span>
                      {blog.tags && blog.tags.length > 0 && (
                        <div className="flex gap-1">
                          {blog.tags.slice(0, 3).map((tag) => (
                            <Badge key={tag} variant="secondary" className="text-[10px]">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <Button variant="ghost" size="icon" asChild>
                      <Link to={`/blog/${blog.slug}`}>
                        <ExternalLink className="h-4 w-4" />
                      </Link>
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => deleteMutation.mutate({ id: blog.id })}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
