import { useAuth } from "@/hooks/useAuth";
import { trpc } from "@/providers/trpc";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ShoppingBag,
  Heart,
  FolderGit2,
  FileText,
  Bell,
  User,
  Package,
  TrendingUp,
} from "lucide-react";
import { Link } from "react-router";

export default function DashboardOverview() {
  const { user } = useAuth();
  const { data: stats, isLoading } = trpc.user.getDashboardStats.useQuery(undefined, {
    retry: false,
  });
  const { data: profileData } = trpc.user.getProfile.useQuery(undefined, {
    retry: false,
  });

  const statCards = [
    { label: "Orders", value: stats?.orderCount ?? 0, icon: ShoppingBag, color: "text-blue-600", bg: "bg-blue-100", link: "/dashboard/orders" },
    { label: "Wishlist", value: stats?.savedCount ?? 0, icon: Heart, color: "text-red-600", bg: "bg-red-100", link: "/dashboard/wishlist" },
    { label: "Projects", value: stats?.projectCount ?? 0, icon: FolderGit2, color: "text-purple-600", bg: "bg-purple-100", link: "/dashboard/projects" },
    { label: "Blog Posts", value: stats?.blogCount ?? 0, icon: FileText, color: "text-green-600", bg: "bg-green-100", link: "/dashboard/blogs" },
    { label: "Notifications", value: stats?.unreadNotifications ?? 0, icon: Bell, color: "text-amber-600", bg: "bg-amber-100", link: "/dashboard/notifications" },
  ];

  const profile = profileData?.profile;

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="flex items-start gap-4">
        <Avatar className="h-16 w-16 border-2">
          <AvatarImage src={user?.avatar || ""} />
          <AvatarFallback className="text-lg font-medium">
            {user?.name?.charAt(0)?.toUpperCase() || "U"}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <h1 className="text-2xl font-bold tracking-tight">
            Welcome back, {user?.name || "Maker"}!
          </h1>
          <p className="text-muted-foreground mt-1">
            Here's what's happening with your account today.
          </p>
          <div className="flex items-center gap-2 mt-2">
            <Badge variant="secondary" className="capitalize">
              {user?.role || "member"}
            </Badge>
            {profile?.badges && profile.badges.length > 0 && profile.badges.map((badge) => (
              <Badge key={badge} variant="outline" className="capitalize">
                {badge.replace("-", " ")}
              </Badge>
            ))}
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {statCards.map((stat) => (
          <Link key={stat.label} to={stat.link}>
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div className={`p-2 rounded-lg ${stat.bg}`}>
                    <stat.icon className={`h-5 w-5 ${stat.color}`} />
                  </div>
                  {isLoading ? (
                    <Skeleton className="h-8 w-16" />
                  ) : (
                    <span className="text-2xl font-bold">{stat.value}</span>
                  )}
                </div>
                <p className="text-sm text-muted-foreground mt-3">{stat.label}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <User className="h-5 w-5" />
              Profile Overview
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Display Name</span>
              <span className="text-sm font-medium">{profile?.displayName || user?.name || "Not set"}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Email</span>
              <span className="text-sm font-medium">{user?.email || "Not set"}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">University</span>
              <span className="text-sm font-medium">{profile?.university || "Not set"}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">GitHub</span>
              <span className="text-sm font-medium">{profile?.github || "Not set"}</span>
            </div>
            {profile?.skills && profile.skills.length > 0 && (
              <div className="flex justify-between items-start">
                <span className="text-sm text-muted-foreground">Skills</span>
                <div className="flex flex-wrap gap-1 justify-end">
                  {profile.skills.map((skill) => (
                    <Badge key={skill} variant="secondary" className="text-xs">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
            <Link
              to="/dashboard/profile"
              className="text-sm text-primary hover:underline inline-block mt-2"
            >
              Edit profile →
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Link
              to="/dashboard/projects"
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-accent transition-colors"
            >
              <div className="p-2 rounded-lg bg-purple-100">
                <FolderGit2 className="h-4 w-4 text-purple-600" />
              </div>
              <div>
                <p className="text-sm font-medium">Manage Projects</p>
                <p className="text-xs text-muted-foreground">Create or edit your maker projects</p>
              </div>
            </Link>
            <Link
              to="/dashboard/blogs"
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-accent transition-colors"
            >
              <div className="p-2 rounded-lg bg-green-100">
                <FileText className="h-4 w-4 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium">Write a Blog Post</p>
                <p className="text-xs text-muted-foreground">Share your knowledge with the community</p>
              </div>
            </Link>
            <Link
              to="/dashboard/orders"
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-accent transition-colors"
            >
              <div className="p-2 rounded-lg bg-blue-100">
                <Package className="h-4 w-4 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium">View Orders</p>
                <p className="text-xs text-muted-foreground">Check your order history and status</p>
              </div>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
