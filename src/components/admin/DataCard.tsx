import { type ReactNode } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface DataCardProps {
  title: string;
  description?: string;
  icon?: ReactNode;
  children: ReactNode;
  className?: string;
  isLoading?: boolean;
  isEmpty?: boolean;
  emptyMessage?: string;
}

export function DataCard({ title, description, icon, children, className = "", isLoading, isEmpty, emptyMessage = "No data available" }: DataCardProps) {
  return (
    <Card className={className}>
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <div>
          <CardTitle className="text-lg flex items-center gap-2">
            {icon}
            {title}
          </CardTitle>
          {description && <CardDescription>{description}</CardDescription>}
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => <Skeleton key={i} className="h-12 w-full" />)}
          </div>
        ) : isEmpty ? (
          <div className="text-center py-8 text-muted-foreground">
            <p className="text-sm">{emptyMessage}</p>
          </div>
        ) : (
          children
        )}
      </CardContent>
    </Card>
  );
}

interface EmptyStateProps {
  icon?: ReactNode;
  title?: string;
  description?: string;
  action?: ReactNode;
}

export function EmptyState({ icon, title = "Nothing here yet", description, action }: EmptyStateProps) {
  return (
    <Card>
      <CardContent className="text-center py-12">
        {icon && <div className="flex justify-center mb-3 text-muted-foreground/50">{icon}</div>}
        <p className="font-medium text-muted-foreground">{title}</p>
        {description && <p className="text-sm text-muted-foreground/70 mt-1">{description}</p>}
        {action && <div className="mt-4">{action}</div>}
      </CardContent>
    </Card>
  );
}
