import { trpc } from "@/providers/trpc";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SectionHeader } from "@/components/admin/SectionHeader";
import { StatCard, StatsGrid } from "@/components/admin/StatCard";
import { DataCard } from "@/components/admin/DataCard";
import {
  BarChart3, TrendingUp, DollarSign, ShoppingCart, Package,
  ShoppingBag, Activity, Eye, FileText, FolderGit2,
} from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, AreaChart, Area, PieChart, Pie, Cell,
} from "recharts";

const COLORS = ["#2563eb", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899", "#06b6d4", "#84cc16"];

export default function AdminAnalytics() {
  const { data, isLoading } = trpc.admin.getAnalytics.useQuery({}, { retry: false });

  const totalRevenue = data?.revenueData?.reduce((sum, d) => sum + Number(d.revenue), 0) || 0;
  const totalOrders = data?.dailyOrders?.reduce((sum, d) => sum + Number(d.count), 0) || 0;
  const avgOrderValue = totalOrders > 0 ? Math.round(totalRevenue / totalOrders) : 0;

  // Mock visitor data (for demo purposes - replace with real analytics when available)
  const visitorData = [
    { date: "Mon", visitors: 120, pageViews: 340 },
    { date: "Tue", visitors: 145, pageViews: 410 },
    { date: "Wed", visitors: 110, pageViews: 290 },
    { date: "Thu", visitors: 180, pageViews: 520 },
    { date: "Fri", visitors: 165, pageViews: 480 },
    { date: "Sat", visitors: 200, pageViews: 610 },
    { date: "Sun", visitors: 155, pageViews: 430 },
  ];

  return (
    <div className="space-y-6">
      <SectionHeader
        icon={BarChart3}
        title="Analytics"
        description="Revenue, sales trends, and platform performance"
      />

      {/* Summary Cards */}
      <StatsGrid columns={4}>
        <StatCard
          label="Total Revenue (30d)"
          value={`Rs. ${totalRevenue.toLocaleString()}`}
          icon={DollarSign}
          color="text-green-600"
          bg="bg-green-100"
          isLoading={isLoading}
        />
        <StatCard
          label="Orders (30d)"
          value={totalOrders}
          icon={ShoppingCart}
          color="text-blue-600"
          bg="bg-blue-100"
          isLoading={isLoading}
        />
        <StatCard
          label="Avg. Order Value"
          value={`Rs. ${avgOrderValue.toLocaleString()}`}
          icon={ShoppingBag}
          color="text-purple-600"
          bg="bg-purple-100"
          isLoading={isLoading}
        />
        <StatCard
          label="Conversion Rate"
          value="3.2%"
          icon={TrendingUp}
          color="text-amber-600"
          bg="bg-amber-100"
        />
      </StatsGrid>

      {isLoading ? (
        <div className="grid gap-6 md:grid-cols-2">
          {[1,2,3,4].map(i => <div key={i}><Card><CardContent className="h-64" /></Card></div>)}
        </div>
      ) : (
        <>
          {/* Revenue Chart - Area */}
          <Card>
            <CardHeader><CardTitle className="text-lg flex items-center gap-2"><TrendingUp className="h-5 w-5" /> Revenue Trend (30 Days)</CardTitle></CardHeader>
            <CardContent>
              {data?.revenueData && data.revenueData.length > 0 ? (
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data.revenueData}>
                      <defs>
                        <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#2563eb" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                      <XAxis dataKey="date" tick={{ fontSize: 11 }} className="text-muted-foreground" />
                      <YAxis tick={{ fontSize: 11 }} className="text-muted-foreground" tickFormatter={(v) => `Rs.${(v/1000).toFixed(0)}k`} />
                      <Tooltip
                        contentStyle={{ borderRadius: 8, border: "1px solid #e2e8f0" }}
                        formatter={(value: number) => [`Rs. ${value.toLocaleString()}`, "Revenue"]}
                      />
                      <Area type="monotone" dataKey="revenue" stroke="#2563eb" fill="url(#revenueGradient)" strokeWidth={2} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground text-center py-16">No revenue data yet</p>
              )}
            </CardContent>
          </Card>

          {/* Visitors & Orders */}
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader><CardTitle className="text-lg flex items-center gap-2"><Eye className="h-5 w-5" /> Website Visitors</CardTitle></CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={visitorData}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                      <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                      <YAxis tick={{ fontSize: 11 }} />
                      <Tooltip contentStyle={{ borderRadius: 8 }} />
                      <Bar dataKey="visitors" fill="#2563eb" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="pageViews" fill="#93c5fd" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader><CardTitle className="text-lg flex items-center gap-2"><ShoppingCart className="h-5 w-5" /> Daily Orders</CardTitle></CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data?.dailyOrders || []}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                      <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                      <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
                      <Tooltip contentStyle={{ borderRadius: 8 }} />
                      <Line type="monotone" dataKey="count" stroke="#10b981" strokeWidth={2} dot={{ r: 3 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Popular Products / Community Growth */}
          <div className="grid gap-6 md:grid-cols-2">
            <DataCard
              title="Top Selling Products"
              icon={<Package className="h-5 w-5 text-muted-foreground" />}
              isEmpty={!data?.topProducts || data.topProducts.length === 0}
              emptyMessage="No sales data yet"
            >
              <div className="space-y-2">
                {data?.topProducts?.slice(0, 10).map((product, i) => (
                  <div key={product.productId} className="flex items-center justify-between py-2 border-b last:border-0">
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="text-xs font-bold text-muted-foreground w-5 shrink-0">#{i + 1}</span>
                      <div className="min-w-0">
                        <p className="text-sm font-medium truncate">{product.productName}</p>
                        <p className="text-xs text-muted-foreground">{product.totalSold} sold</p>
                      </div>
                    </div>
                    <span className="text-sm font-medium shrink-0">Rs. {Number(product.revenue).toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </DataCard>

            <Card>
              <CardHeader><CardTitle className="text-lg flex items-center gap-2"><Activity className="h-5 w-5" /> Revenue Distribution</CardTitle></CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center">
                  {data?.topProducts && data.topProducts.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={data.topProducts.slice(0, 6)}
                          dataKey="revenue"
                          nameKey="productName"
                          cx="50%"
                          cy="50%"
                          outerRadius={80}
                          label={({ percent }: { percent: number }) => `${(percent * 100).toFixed(0)}%`}
                        >
                          {data.topProducts.slice(0, 6).map((_, i) => (
                            <Cell key={i} fill={COLORS[i % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value: number) => [`Rs. ${value.toLocaleString()}`, "Revenue"]} />
                      </PieChart>
                    </ResponsiveContainer>
                  ) : (
                    <p className="text-sm text-muted-foreground">No data</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Popular Blogs & Projects */}
          <PopularContentSection />
        </>
      )}
    </div>
  );
}

function PopularContentSection() {
  const { data } = trpc.admin.getPopularContent.useQuery(undefined, { retry: false });

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <DataCard
        title="Popular Blogs"
        icon={<FileText className="h-5 w-5 text-muted-foreground" />}
        isEmpty={!data?.popularBlogs || data.popularBlogs.length === 0}
        emptyMessage="No approved blogs yet"
      >
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {data?.popularBlogs?.map((blog) => (
            <div key={blog.id} className="flex items-center justify-between py-1.5 border-b last:border-0">
              <div className="min-w-0 flex-1">
                <p className="text-sm truncate">{blog.title}</p>
                {blog.excerpt && <p className="text-xs text-muted-foreground truncate">{blog.excerpt}</p>}
              </div>
              {blog.category && <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full ml-2 shrink-0">{blog.category}</span>}
            </div>
          ))}
        </div>
      </DataCard>

      <DataCard
        title="Popular Projects"
        icon={<FolderGit2 className="h-5 w-5 text-muted-foreground" />}
        isEmpty={!data?.popularProjects || data.popularProjects.length === 0}
        emptyMessage="No approved projects yet"
      >
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {data?.popularProjects?.map((project) => (
            <div key={project.id} className="flex items-center justify-between py-1.5 border-b last:border-0">
              <div className="min-w-0 flex-1">
                <p className="text-sm truncate">{project.title}</p>
                {project.description && <p className="text-xs text-muted-foreground truncate">{project.description}</p>}
              </div>
              {project.difficulty && (
                <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ml-2 shrink-0 ${
                  project.difficulty === "Beginner" ? "bg-green-100 text-green-700" :
                  project.difficulty === "Intermediate" ? "bg-amber-100 text-amber-700" :
                  "bg-red-100 text-red-700"
                }`}>{project.difficulty}</span>
              )}
            </div>
          ))}
        </div>
      </DataCard>
    </div>
  );
}
