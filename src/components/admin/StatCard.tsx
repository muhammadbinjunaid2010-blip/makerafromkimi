import { type LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "react-router";

interface StatCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  color?: string;
  bg?: string;
  link?: string;
  isLoading?: boolean;
  trend?: { value: number; isUp: boolean };
}

export function StatCard({ label, value, icon: Icon, color = "text-blue-600", bg = "bg-blue-100", link, isLoading, trend }: StatCardProps) {
  const content = (
    <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
      <CardContent className="p-4 sm:p-5">
        <div className="flex items-center justify-between">
          <div className={`p-2 rounded-lg ${bg}`}>
            <Icon className={`h-5 w-5 ${color}`} />
          </div>
          {isLoading ? (
            <Skeleton className="h-7 w-20" />
          ) : (
            <div className="text-right">
              <span className="text-xl font-bold">{value}</span>
              {trend && (
                <p className={`text-xs mt-0.5 ${trend.isUp ? "text-green-600" : "text-red-600"}`}>
                  {trend.isUp ? "↑" : "↓"} {Math.abs(trend.value)}%
                </p>
              )}
            </div>
          )}
        </div>
        <p className="text-xs text-muted-foreground mt-2">{label}</p>
      </CardContent>
    </Card>
  );

  if (link) return <Link to={link} className="block">{content}</Link>;
  return content;
}

interface StatsGridProps {
  children: React.ReactNode;
  columns?: number;
}

const colMap: Record<number, string> = {
  2: "xl:grid-cols-2",
  3: "xl:grid-cols-3",
  4: "xl:grid-cols-4",
};

export function StatsGrid({ children, columns }: StatsGridProps) {
  const cols = colMap[columns ?? 4] || "xl:grid-cols-4";
  return (
    <div className={`grid gap-4 sm:grid-cols-2 lg:grid-cols-3 ${cols}`}>
      {children}
    </div>
  );
}
