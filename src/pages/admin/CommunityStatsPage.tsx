import { trpc } from "@/providers/trpc";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SectionHeader } from "@/components/admin/SectionHeader";
import { StatCard, StatsGrid } from "@/components/admin/StatCard";
import { DataCard } from "@/components/admin/DataCard";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import {
  Users, UserCheck, FolderGit2, FileText, CheckCircle, XCircle,
  Trophy, TrendingUp, Activity, Star,
} from "lucide-react";

export default function AdminCommunityStats() {
  const { data: stats, isLoading: statsLoading } = trpc.admin.getCommunityStats.useQuery(undefined, { retry: false });
  const { data: popular } = trpc.admin.getPopularContent.useQuery(undefined, { retry: false });

  if (statsLoading) {
    return (
      <div className="space-y-6">
        <div><Skeleton className="h-8 w-64" /><Skeleton className="h-4 w-96 mt-2" /></div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {[1,2,3,4,5,6,7,8].map(i => <Skeleton key={i} className="h-28" />)}
        </div>
      </div>
    );
  }

  const approvalRate = stats?.projectsSubmitted
    ? Math.round((stats.projectsApproved / stats.projectsSubmitted) * 100)
    : 0;

  return (
    <div className="space-y-6">
      <SectionHeader
        icon={Users}
        title="Community Statistics"
        description="Member growth, content metrics, and top contributors"
      />

      {/* Community Stats Cards */}
      <StatsGrid columns={4}>
        <StatCard
          label="Total Members"
          value={stats?.totalMembers || 0}
          icon={Users}
          color="text-blue-600"
          bg="bg-blue-100"
          link="/admin/users"
        />
        <StatCard
          label="Active Members (30d)"
          value={stats?.activeMembers || 0}
          icon={UserCheck}
          color="text-green-600"
          bg="bg-green-100"
        />
        <StatCard
          label="Projects Submitted"
          value={stats?.projectsSubmitted || 0}
          icon={FolderGit2}
          color="text-purple-600"
          bg="bg-purple-100"
          link="/admin/projects"
        />
        <StatCard
          label="Projects Approved"
          value={stats?.projectsApproved || 0}
          icon={CheckCircle}
          color="text-blue-600"
          bg="bg-blue-100"
        />
        <StatCard
          label="Blogs Submitted"
          value={stats?.blogsSubmitted || 0}
          icon={FileText}
          color="text-amber-600"
          bg="bg-amber-100"
          link="/admin/blogs"
        />
        <StatCard
          label="Blogs Approved"
          value={stats?.blogsApproved || 0}
          icon={CheckCircle}
          color="text-green-600"
          bg="bg-green-100"
        />
        <StatCard
          label="Competition Entries"
          value={stats?.competitionEntries || 0}
          icon={Trophy}
          color="text-rose-600"
          bg="bg-rose-100"
          link="/admin/competitions"
        />
        <StatCard
          label="Approval Rate"
          value={`${approvalRate}%`}
          icon={TrendingUp}
          color="text-teal-600"
          bg="bg-teal-100"
        />
      </StatsGrid>

      {/* Content Quality */}
      <Card>
        <CardHeader><CardTitle className="text-lg flex items-center gap-2"><Activity className="h-5 w-5" /> Content Quality Overview</CardTitle></CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-3">
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">Projects</p>
              <div className="flex items-center gap-4">
                <div className="flex-1 bg-secondary rounded-full h-3 overflow-hidden">
                  <div className="bg-green-500 h-full rounded-full transition-all" style={{ width: `${stats?.projectsSubmitted ? (stats.projectsApproved / stats.projectsSubmitted) * 100 : 0}%` }} />
                </div>
                <span className="text-sm font-medium">{stats?.projectsSubmitted ? Math.round((stats.projectsApproved / stats.projectsSubmitted) * 100) : 0}%</span>
              </div>
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span className="flex items-center gap-1"><CheckCircle className="h-3 w-3 text-green-500" /> {stats?.projectsApproved || 0} approved</span>
                <span className="flex items-center gap-1"><XCircle className="h-3 w-3 text-red-500" /> {stats?.projectsSubmitted ? stats.projectsSubmitted - stats.projectsApproved : 0} pending/rejected</span>
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">Blogs</p>
              <div className="flex items-center gap-4">
                <div className="flex-1 bg-secondary rounded-full h-3 overflow-hidden">
                  <div className="bg-blue-500 h-full rounded-full transition-all" style={{ width: `${stats?.blogsSubmitted ? (stats.blogsApproved / stats.blogsSubmitted) * 100 : 0}%` }} />
                </div>
                <span className="text-sm font-medium">{stats?.blogsSubmitted ? Math.round((stats.blogsApproved / stats.blogsSubmitted) * 100) : 0}%</span>
              </div>
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span className="flex items-center gap-1"><CheckCircle className="h-3 w-3 text-green-500" /> {stats?.blogsApproved || 0} approved</span>
                <span className="flex items-center gap-1"><XCircle className="h-3 w-3 text-red-500" /> {stats?.blogsSubmitted ? stats.blogsSubmitted - stats.blogsApproved : 0} pending/rejected</span>
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">Competition Engagement</p>
              <div className="flex items-center gap-4">
                <div className="flex-1 bg-secondary rounded-full h-3 overflow-hidden">
                  <div className="bg-purple-500 h-full rounded-full transition-all" style={{ width: `${Math.min(100, ((stats?.competitionEntries || 0) / Math.max(1, (stats?.totalMembers || 1))) * 100)}%` }} />
                </div>
                <span className="text-sm font-medium">{stats?.totalMembers ? Math.round(((stats?.competitionEntries || 0) / stats.totalMembers) * 100) : 0}%</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Trophy className="h-3 w-3 text-amber-500" />
                <span>{stats?.competitionEntries || 0} total entries</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Active Contributors */}
      <DataCard
        title="Most Active Contributors"
        icon={<Star className="h-5 w-5 text-amber-500" />}
        description="Top contributors by projects, blogs, and competition entries"
        isEmpty={!stats?.activeContributors || stats.activeContributors.length === 0}
        emptyMessage="No contributor data yet"
      >
        <div className="space-y-2">
          {stats?.activeContributors.map((contributor, i) => (
            <div key={contributor.userId} className="flex items-center justify-between py-2 border-b last:border-0">
              <div className="flex items-center gap-3">
                <span className={`text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center ${
                  i === 0 ? "bg-amber-100 text-amber-700" :
                  i === 1 ? "bg-slate-100 text-slate-600" :
                  i === 2 ? "bg-orange-100 text-orange-700" :
                  "bg-muted text-muted-foreground"
                }`}>
                  {i + 1}
                </span>
                <div>
                  <p className="text-sm font-medium">User #{contributor.userId}</p>
                  <p className="text-xs text-muted-foreground">{contributor.contributions} contributions</p>
                </div>
              </div>
              <Badge variant="outline">{contributor.contributions} items</Badge>
            </div>
          ))}
        </div>
      </DataCard>

      {/* Popular Content Preview */}
      <div className="grid gap-6 md:grid-cols-2">
        <DataCard
          title="Recent Approved Projects"
          icon={<FolderGit2 className="h-5 w-5 text-muted-foreground" />}
          isEmpty={!popular?.popularProjects || popular.popularProjects.length === 0}
          emptyMessage="No approved projects yet"
        >
          <div className="space-y-2">
            {popular?.popularProjects?.slice(0, 5).map((project) => (
              <div key={project.id} className="flex items-center justify-between py-1.5 border-b last:border-0">
                <span className="text-sm truncate">{project.title}</span>
                <Badge variant="outline" className="text-[10px] capitalize">{project.difficulty || project.status}</Badge>
              </div>
            ))}
          </div>
        </DataCard>

        <DataCard
          title="Recent Approved Blogs"
          icon={<FileText className="h-5 w-5 text-muted-foreground" />}
          isEmpty={!popular?.popularBlogs || popular.popularBlogs.length === 0}
          emptyMessage="No approved blogs yet"
        >
          <div className="space-y-2">
            {popular?.popularBlogs?.slice(0, 5).map((blog) => (
              <div key={blog.id} className="flex items-center justify-between py-1.5 border-b last:border-0">
                <span className="text-sm truncate">{blog.title}</span>
                {blog.category && <Badge variant="outline" className="text-[10px]">{blog.category}</Badge>}
              </div>
            ))}
          </div>
        </DataCard>
      </div>
    </div>
  );
}
