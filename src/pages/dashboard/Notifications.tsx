import { trpc } from "@/providers/trpc";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";import {
  Bell, CheckCheck, Info, ShoppingBag, Heart, FolderGit2, MessageCircle,
  Zap, Award, Star, Trophy, Shield, TrendingUp,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { toast } from "sonner";
import { Link } from "react-router";

const notificationIcons: Record<string, typeof Bell> = {
  order: ShoppingBag,
  wishlist: Heart,
  project: FolderGit2,
  message: MessageCircle,
  info: Info,
  xp: Zap,
  level_up: TrendingUp,
  badge: Award,
  achievement: Star,
  spotlight: Trophy,
  certificate: Shield,
};

export default function NotificationsPage() {
  const { data, isLoading, refetch } = trpc.user.getNotifications.useQuery(undefined, {
    retry: false,
  });
  const markReadMutation = trpc.user.markNotificationRead.useMutation({
    onSuccess: () => refetch(),
  });
  const markAllReadMutation = trpc.user.markAllNotificationsRead.useMutation({
    onSuccess: () => {
      refetch();
      toast.success("All notifications marked as read");
    },
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-20 w-full" />
          ))}
        </div>
      </div>
    );
  }

  const notifications = data?.notifications || [];
  const unreadCount = data?.unreadCount || 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <Bell className="h-6 w-6 text-amber-500" />
            Notifications
          </h1>
          <p className="text-muted-foreground mt-1">
            Stay updated with your activity
          </p>
        </div>
        {unreadCount > 0 && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => markAllReadMutation.mutate()}
          >
            <CheckCheck className="h-4 w-4 mr-2" />
            Mark all as read
          </Button>
        )}
      </div>

      {notifications.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Bell className="h-12 w-12 text-muted-foreground/50 mb-4" />
            <h3 className="text-lg font-medium mb-1">No notifications</h3>
            <p className="text-sm text-muted-foreground">
              You're all caught up!
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-2">
          {notifications.map((notification) => {
            const Icon = notificationIcons[notification.type] || Info;
            return (
              <Card
                key={notification.id}
                className={`transition-colors ${
                  !notification.read ? "border-primary/30 bg-primary/5" : ""
                }`}
              >
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-lg ${
                      notification.read ? "bg-secondary" : "bg-primary/10"
                    }`}>
                      <Icon className={`h-4 w-4 ${
                        notification.read ? "text-muted-foreground" : "text-primary"
                      }`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className={`text-sm ${!notification.read ? "font-medium" : ""}`}>
                            {notification.title}
                          </p>
                          {notification.message && (
                            <p className="text-xs text-muted-foreground mt-1">
                              {notification.message}
                            </p>
                          )}
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <span className="text-[10px] text-muted-foreground whitespace-nowrap">
                            {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                          </span>
                          {!notification.read && (
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6"
                              onClick={() => markReadMutation.mutate({ id: notification.id })}
                            >
                              <CheckCheck className="h-3 w-3" />
                            </Button>
                          )}
                        </div>
                      </div>
                  {notification.link && (
                    <Link
                      to={notification.link}
                      className="text-xs text-primary hover:underline mt-1 inline-block"
                    >
                      {notification.type === "xp" || notification.type === "level_up" || notification.type === "badge" || notification.type === "achievement"
                        ? "View achievements"
                        : "View details"}
                    </Link>
                  )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
