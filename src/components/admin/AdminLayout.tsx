import { useAuth } from "@/hooks/useAuth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { Badge } from "@/components/ui/badge";
import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "@/components/ui/button";
import { AuthLayoutSkeleton } from "@/components/AuthLayoutSkeleton";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  ShoppingBag,
  FolderTree,
  Tags,
  Ticket,
  Users,
  MessageSquare,
  FileText,
  FolderGit2,
  Trophy,
  BarChart3,
  Settings,
  LogOut,
  PanelLeft,
  User,
  Shield,
  CheckSquare,
  Sparkles,
} from "lucide-react";
import { type CSSProperties, type ReactNode, useEffect, useRef, useState } from "react";
import { useLocation, useNavigate, Link } from "react-router";

const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/admin" },
  { icon: Package, label: "Inventory", path: "/admin/inventory" },
  { icon: ShoppingCart, label: "Orders", path: "/admin/orders" },
  { icon: ShoppingBag, label: "Products", path: "/admin/products" },
  { icon: FolderTree, label: "Categories", path: "/admin/categories" },
  { icon: Tags, label: "Variants", path: "/admin/variants" },
  { icon: Ticket, label: "Coupons", path: "/admin/coupons" },
  { icon: Users, label: "Users", path: "/admin/users" },
  { icon: MessageSquare, label: "Community", path: "/admin/community" },
  { icon: FileText, label: "Blogs", path: "/admin/blogs" },
  { icon: FolderGit2, label: "Projects", path: "/admin/projects" },
  { icon: Trophy, label: "Competitions", path: "/admin/competitions" },
  { icon: CheckSquare, label: "Approval Queue", path: "/admin/queue" },
  { icon: BarChart3, label: "Analytics", path: "/admin/analytics" },
  { icon: Sparkles, label: "Gamification", path: "/admin/gamification" },
  { icon: Settings, label: "Settings", path: "/admin/settings" },
];

const SIDEBAR_WIDTH_KEY = "admin-sidebar-width";
const DEFAULT_WIDTH = 260;
const MIN_WIDTH = 200;
const MAX_WIDTH = 400;

export default function AdminLayout({ children }: { children: ReactNode }) {
  const [sidebarWidth, setSidebarWidth] = useState(() => {
    const saved = localStorage.getItem(SIDEBAR_WIDTH_KEY);
    return saved ? parseInt(saved, 10) : DEFAULT_WIDTH;
  });
  const { isLoading, user } = useAuth();

  useEffect(() => {
    localStorage.setItem(SIDEBAR_WIDTH_KEY, sidebarWidth.toString());
  }, [sidebarWidth]);

  if (isLoading) return <AuthLayoutSkeleton />;

  if (!user || user.role !== "admin") {
    return (
      <div className="flex items-center justify-center min-h-screen bg-secondary/30">
        <div className="flex flex-col items-center gap-6 p-8 max-w-md w-full text-center">
          <Shield className="h-12 w-12 text-muted-foreground/50" />
          <h1 className="text-2xl font-semibold tracking-tight">Access Denied</h1>
          <p className="text-sm text-muted-foreground">You need admin permissions to access this area.</p>
          <Button onClick={() => window.location.href = "/"} variant="outline">Go to Home</Button>
        </div>
      </div>
    );
  }

  return (
    <SidebarProvider style={{ "--sidebar-width": `${sidebarWidth}px` } as CSSProperties}>
      <AdminSidebar setSidebarWidth={setSidebarWidth} />
      <SidebarInset>
        <MobileHeader />
        <main className="flex-1 p-4 md:p-6 lg:p-8 bg-secondary/10 min-h-screen">
          <div className="max-w-7xl mx-auto">{children}</div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}

function AdminSidebar({ setSidebarWidth }: { setSidebarWidth: (width: number) => void }) {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const { state, toggleSidebar } = useSidebar();
  const isCollapsed = state === "collapsed";
  const [isResizing, setIsResizing] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isCollapsed) setIsResizing(false);
  }, [isCollapsed]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing) return;
      const sidebarLeft = sidebarRef.current?.getBoundingClientRect().left ?? 0;
      const newWidth = e.clientX - sidebarLeft;
      if (newWidth >= MIN_WIDTH && newWidth <= MAX_WIDTH) setSidebarWidth(newWidth);
    };
    const handleMouseUp = () => setIsResizing(false);
    if (isResizing) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      document.body.style.cursor = "col-resize";
      document.body.style.userSelect = "none";
    }
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    };
  }, [isResizing, setSidebarWidth]);

  return (
    <div className="relative" ref={sidebarRef}>
      <Sidebar collapsible="icon" className="border-r">
        <SidebarHeader className="h-16 justify-center border-b">
          <div className="flex items-center gap-3 px-2 w-full">
            <button onClick={toggleSidebar} className="h-8 w-8 flex items-center justify-center hover:bg-accent rounded-lg shrink-0" aria-label="Toggle sidebar">
              <PanelLeft className="h-4 w-4 text-muted-foreground" />
            </button>
            {!isCollapsed && (
              <Link to="/admin" className="flex items-center gap-2 min-w-0">
                <span className="font-bold tracking-tight truncate text-lg">Admin</span>
                <Badge variant="outline" className="text-[10px] h-5">v1.0</Badge>
              </Link>
            )}
          </div>
        </SidebarHeader>

        <SidebarContent className="gap-0 py-2">
          <SidebarMenu className="px-2">
            {menuItems.map((item) => {
              const isActive = location.pathname === item.path || location.pathname.startsWith(item.path + "/");
              return (
                <SidebarMenuItem key={item.path}>
                  <SidebarMenuButton
                    isActive={isActive}
                    onClick={() => navigate(item.path)}
                    tooltip={item.label}
                    className={`h-9 text-sm ${isActive ? "bg-accent font-medium" : ""}`}
                  >
                    <item.icon className={`h-4 w-4 shrink-0 ${isActive ? "text-primary" : ""}`} />
                    <span className="flex-1">{item.label}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarContent>

        <SidebarFooter className="p-3 border-t">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-3 rounded-lg px-1 py-1.5 hover:bg-accent/50 transition-colors w-full text-left group-data-[collapsible=icon]:justify-center">
                <Avatar className="h-8 w-8 border shrink-0">
                  <AvatarImage src={user?.avatar || ""} />
                  <AvatarFallback className="text-xs font-medium">{user?.name?.charAt(0)?.toUpperCase() || "A"}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0 group-data-[collapsible=icon]:hidden">
                  <p className="text-sm font-medium truncate leading-none">{user?.name || "Admin"}</p>
                  <p className="text-xs text-muted-foreground truncate mt-0.5">{user?.email || ""}</p>
                </div>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem onClick={() => navigate("/dashboard")}><User className="mr-2 h-4 w-4" /><span>User Dashboard</span></DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate("/")}><LayoutDashboard className="mr-2 h-4 w-4" /><span>Front Site</span></DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={logout} className="text-destructive focus:text-destructive">
                <LogOut className="mr-2 h-4 w-4" /><span>Sign out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarFooter>
      </Sidebar>
      <div
        className={`absolute top-0 right-0 w-1 h-full cursor-col-resize hover:bg-primary/20 transition-colors ${isCollapsed ? "hidden" : ""}`}
        onMouseDown={() => { if (!isCollapsed) setIsResizing(true); }}
        style={{ zIndex: 50 }}
      />
    </div>
  );
}

function MobileHeader() {
  const isMobile = useIsMobile();
  if (!isMobile) return null;
  return (
    <div className="flex border-b h-14 items-center bg-background/95 px-2 backdrop-blur sticky top-0 z-40">
      <SidebarTrigger className="h-9 w-9 rounded-lg" />
      <span className="tracking-tight font-medium ml-2">Admin</span>
    </div>
  );
}


