import { trpc } from "@/providers/trpc";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "react-router";
import {
  DollarSign, ShoppingCart, Package, ShoppingBag, Users,
  MessageSquare, FileText, FolderGit2, AlertTriangle,
  TrendingUp,
} from "lucide-react";

export default function AdminDashboard() {
  const { data: stats, isLoading } = trpc.admin.getDashboardStats.useQuery(undefined, { retry: false });
  const { data: recentOrders } = trpc.admin.getRecentOrders.useQuery(undefined, { retry: false });

  const statCards = [
    { label: "Revenue (All Time)", value: `Rs. ${(stats?.totalRevenue || 0).toLocaleString()}`, icon: DollarSign, color: "text-green-600", bg: "bg-green-100", link: "/admin/analytics" },
    { label: "Revenue (This Month)", value: `Rs. ${(stats?.monthRevenue || 0).toLocaleString()}`, icon: TrendingUp, color: "text-blue-600", bg: "bg-blue-100", link: "/admin/analytics" },
    { label: "Total Orders", value: stats?.totalOrders || 0, icon: ShoppingCart, color: "text-purple-600", bg: "bg-purple-100", link: "/admin/orders" },
    { label: "Pending Orders", value: stats?.pendingOrders || 0, icon: AlertTriangle, color: "text-amber-600", bg: "bg-amber-100", link: "/admin/orders" },
    { label: "Total Products", value: stats?.totalProducts || 0, icon: ShoppingBag, color: "text-blue-600", bg: "bg-blue-100", link: "/admin/inventory" },
    { label: "Out of Stock", value: stats?.outOfStock || 0, icon: Package, color: "text-red-600", bg: "bg-red-100", link: "/admin/inventory" },
    { label: "Low Stock", value: stats?.lowStock || 0, icon: AlertTriangle, color: "text-orange-600", bg: "bg-orange-100", link: "/admin/inventory" },
    { label: "Total Users", value: stats?.totalUsers || 0, icon: Users, color: "text-indigo-600", bg: "bg-indigo-100", link: "/admin/users" },
    { label: "Projects", value: stats?.totalProjects || 0, icon: FolderGit2, color: "text-purple-600", bg: "bg-purple-100", link: "/admin/projects" },
    { label: "Blog Posts", value: stats?.totalBlogs || 0, icon: FileText, color: "text-green-600", bg: "bg-green-100", link: "/admin/blogs" },
    { label: "Pending Projects", value: stats?.pendingProjects || 0, icon: MessageSquare, color: "text-amber-600", bg: "bg-amber-100", link: "/admin/projects" },
    { label: "Pending Blogs", value: stats?.pendingBlogs || 0, icon: FileText, color: "text-amber-600", bg: "bg-amber-100", link: "/admin/blogs" },
  ];

  const statusColors: Record<string, string> = {
    pending: "bg-amber-100 text-amber-700", processing: "bg-blue-100 text-blue-700",
    shipped: "bg-purple-100 text-purple-700", delivered: "bg-green-100 text-green-700",
    cancelled: "bg-red-100 text-red-700",
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Admin Dashboard</h1>
        <p className="text-muted-foreground mt-1">Overview of your store and community</p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {statCards.map((stat) => (
          <Link key={stat.label} to={stat.link}>
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-4 sm:p-5">
                <div className="flex items-center justify-between">
                  <div className={`p-2 rounded-lg ${stat.bg}`}>
                    <stat.icon className={`h-5 w-5 ${stat.color}`} />
                  </div>
                  {isLoading ? (
                    <Skeleton className="h-7 w-20" />
                  ) : (
                    <span className="text-xl font-bold">{stat.value}</span>
                  )}
                </div>
                <p className="text-xs text-muted-foreground mt-2">{stat.label}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* Recent Orders */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg">Recent Orders</CardTitle>
          <Link to="/admin/orders" className="text-sm text-primary hover:underline">View all</Link>
        </CardHeader>
        <CardContent>
          {!recentOrders || recentOrders.length === 0 ? (
            <p className="text-sm text-muted-foreground py-4 text-center">No orders yet</p>
          ) : (
            <div className="space-y-3">
              {recentOrders.slice(0, 10).map((order) => (
                <div key={order.id} className="flex items-center justify-between py-2 border-b last:border-0">
                  <div>
                    <p className="text-sm font-medium">#{order.id} - {order.fullName}</p>
                    <p className="text-xs text-muted-foreground">{order.email}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge className={statusColors[order.status] || ""}>{order.status}</Badge>
                    <span className="text-sm font-semibold">Rs. {parseFloat(order.totalAmount.toString()).toLocaleString()}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
