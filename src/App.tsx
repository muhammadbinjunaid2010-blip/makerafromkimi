import { createContext, useContext } from "react";
import { Routes, Route, Navigate } from "react-router";
import Header from "./sections/Header";
import Footer from "./sections/Footer";
import Home from "./pages/Home";
import Shop from "./pages/Shop";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import VerifyEmail from "./pages/VerifyEmail";
import Community from "./pages/Community";
import Projects from "./pages/Projects";
import Blog from "./pages/Blog";
import SearchPage from "./pages/Search";
import EventsPage from "./pages/Events";
import ComponentLibrary from "./pages/ComponentLibrary";
import LearningPathsPage from "./pages/LearningPaths";
import MakerPortfolio from "./pages/maker/Portfolio";
import NotFound from "./pages/NotFound";
import { useCart, type CartItem } from "./hooks/useCart";
import { useAuth } from "./hooks/useAuth";
import { AuthLayoutSkeleton } from "./components/AuthLayoutSkeleton";
import AIAssistant from "./components/AIAssistant";
import { LOGIN_PATH } from "./const";
import DashboardLayout from "./components/dashboard/DashboardLayout";
import DashboardOverview from "./pages/dashboard/Overview";
import ProfilePage from "./pages/dashboard/Profile";
import OrdersPage from "./pages/dashboard/Orders";
import WishlistPage from "./pages/dashboard/Wishlist";
import SavedProductsPage from "./pages/dashboard/SavedProducts";
import ProjectsPage from "./pages/dashboard/Projects";
import BlogsPage from "./pages/dashboard/Blogs";
import NotificationsPage from "./pages/dashboard/Notifications";
import SettingsPage from "./pages/dashboard/Settings";
import GamificationPage from "./pages/dashboard/Gamification";

// Admin imports
import AdminLayout from "./components/admin/AdminLayout";
import AdminDashboard from "./pages/admin/Dashboard";
import AdminInventory from "./pages/admin/Inventory";
import AdminOrders from "./pages/admin/AdminOrders";
import AdminCoupons from "./pages/admin/CouponsPage";
import AdminUsers from "./pages/admin/UsersPage";
import ContentModeration from "./pages/admin/ContentModeration";
import AdminCompetitions from "./pages/admin/CompetitionsPage";
import AdminAnalytics from "./pages/admin/AnalyticsPage";
import AdminBlogManagement from "./pages/admin/BlogManagement";
import AdminProjectManagement from "./pages/admin/ProjectManagement";
import AdminCommunity from "./pages/admin/CommunityManagement";
import AdminCommunityStats from "./pages/admin/CommunityStatsPage";
import AdminSettingsPage from "./pages/admin/AdminSettings";
import AdminGamification from "./pages/admin/AdminGamification";

interface CartContextType {
  items: CartItem[];
  sessionId: string;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  addItem: (product: { id: number; name: string; price: string; image: string }) => void;
  removeItem: (id: number) => void;
  updateQuantity: (id: number, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
}

export const CartContext = createContext<CartContextType | null>(null);

export function useCartContext() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCartContext must be used within CartProvider");
  return context;
}

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <AuthLayoutSkeleton />;
  }

  if (!isAuthenticated) {
    return <Navigate to={LOGIN_PATH} replace />;
  }

  return <>{children}</>;
}

function AdminRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading, user } = useAuth();

  if (isLoading) {
    return <AuthLayoutSkeleton />;
  }

  if (!isAuthenticated) {
    return <Navigate to={LOGIN_PATH} replace />;
  }

  if (user?.role !== "admin") {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}

function PublicLayout() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/shop/:slug" element={<ProductDetail />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/events" element={<EventsPage />} />
        <Route path="/components" element={<ComponentLibrary />} />
        <Route path="/components/:slug" element={<ComponentLibrary />} />
        <Route path="/learn" element={<LearningPathsPage />} />
        <Route path="/learn/:slug" element={<LearningPathsPage />} />
        <Route path="/maker/:id" element={<MakerPortfolio />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/community" element={<Community />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Footer />
    </>
  );
}

function App() {
  const cart = useCart();

  return (
    <CartContext.Provider value={cart}>
      <div className="min-h-screen bg-white">
        <AIAssistant />
        <Routes>
          {/* Public routes with Header/Footer */}
          <Route path="/*" element={<PublicLayout />} />

          {/* Dashboard routes - protected */}
          <Route path="/dashboard" element={
            <ProtectedRoute><DashboardLayout><DashboardOverview /></DashboardLayout></ProtectedRoute>
          } />
          <Route path="/dashboard/profile" element={
            <ProtectedRoute><DashboardLayout><ProfilePage /></DashboardLayout></ProtectedRoute>
          } />
          <Route path="/dashboard/orders" element={
            <ProtectedRoute><DashboardLayout><OrdersPage /></DashboardLayout></ProtectedRoute>
          } />
          <Route path="/dashboard/wishlist" element={
            <ProtectedRoute><DashboardLayout><WishlistPage /></DashboardLayout></ProtectedRoute>
          } />
          <Route path="/dashboard/saved" element={
            <ProtectedRoute><DashboardLayout><SavedProductsPage /></DashboardLayout></ProtectedRoute>
          } />
          <Route path="/dashboard/projects" element={
            <ProtectedRoute><DashboardLayout><ProjectsPage /></DashboardLayout></ProtectedRoute>
          } />
          <Route path="/dashboard/blogs" element={
            <ProtectedRoute><DashboardLayout><BlogsPage /></DashboardLayout></ProtectedRoute>
          } />
          <Route path="/dashboard/notifications" element={
            <ProtectedRoute><DashboardLayout><NotificationsPage /></DashboardLayout></ProtectedRoute>
          } />
          <Route path="/dashboard/achievements" element={
            <ProtectedRoute><DashboardLayout><GamificationPage /></DashboardLayout></ProtectedRoute>
          } />
          <Route path="/dashboard/settings" element={
            <ProtectedRoute><DashboardLayout><SettingsPage /></DashboardLayout></ProtectedRoute>
          } />
          <Route path="/dashboard/*" element={
            <ProtectedRoute><DashboardLayout><DashboardOverview /></DashboardLayout></ProtectedRoute>
          } />

          {/* Admin routes - protected + admin role */}
          <Route path="/admin" element={
            <AdminRoute><AdminLayout><AdminDashboard /></AdminLayout></AdminRoute>
          } />
          <Route path="/admin/inventory" element={
            <AdminRoute><AdminLayout><AdminInventory /></AdminLayout></AdminRoute>
          } />
          <Route path="/admin/orders" element={
            <AdminRoute><AdminLayout><AdminOrders /></AdminLayout></AdminRoute>
          } />
          <Route path="/admin/coupons" element={
            <AdminRoute><AdminLayout><AdminCoupons /></AdminLayout></AdminRoute>
          } />
          <Route path="/admin/users" element={
            <AdminRoute><AdminLayout><AdminUsers /></AdminLayout></AdminRoute>
          } />
          <Route path="/admin/community" element={
            <AdminRoute><AdminLayout><AdminCommunity /></AdminLayout></AdminRoute>
          } />
          <Route path="/admin/blogs" element={
            <AdminRoute><AdminLayout><AdminBlogManagement /></AdminLayout></AdminRoute>
          } />
          <Route path="/admin/projects" element={
            <AdminRoute><AdminLayout><AdminProjectManagement /></AdminLayout></AdminRoute>
          } />
          <Route path="/admin/queue" element={
            <AdminRoute><AdminLayout><ContentModeration /></AdminLayout></AdminRoute>
          } />
          <Route path="/admin/competitions" element={
            <AdminRoute><AdminLayout><AdminCompetitions /></AdminLayout></AdminRoute>
          } />
          <Route path="/admin/analytics" element={
            <AdminRoute><AdminLayout><AdminAnalytics /></AdminLayout></AdminRoute>
          } />
          <Route path="/admin/community/stats" element={
            <AdminRoute><AdminLayout><AdminCommunityStats /></AdminLayout></AdminRoute>
          } />
          <Route path="/admin/gamification" element={
            <AdminRoute><AdminLayout><AdminGamification /></AdminLayout></AdminRoute>
          } />
          <Route path="/admin/settings" element={
            <AdminRoute><AdminLayout><AdminSettingsPage /></AdminLayout></AdminRoute>
          } />
          <Route path="/admin/categories" element={
            <AdminRoute><AdminLayout><AdminInventory /></AdminLayout></AdminRoute>
          } />
          <Route path="/admin/variants" element={
            <AdminRoute><AdminLayout><AdminInventory /></AdminLayout></AdminRoute>
          } />
          <Route path="/admin/products" element={
            <AdminRoute><AdminLayout><AdminInventory /></AdminLayout></AdminRoute>
          } />
          <Route path="/admin/*" element={
            <AdminRoute><AdminLayout><AdminDashboard /></AdminLayout></AdminRoute>
          } />
        </Routes>
      </div>
    </CartContext.Provider>
  );
}

export default App;
