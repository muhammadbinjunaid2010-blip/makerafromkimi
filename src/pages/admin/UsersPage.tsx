import { useState } from "react";
import { trpc } from "@/providers/trpc";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Select, SelectContent, SelectItem, SelectTrigger,
} from "@/components/ui/select";
import { Users } from "lucide-react";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";

const roleColors: Record<string, string> = {
  admin: "bg-red-100 text-red-700", moderator: "bg-purple-100 text-purple-700",
  member: "bg-blue-100 text-blue-700", user: "bg-secondary text-secondary-foreground",
};

export default function AdminUsers() {
  const [page, setPage] = useState(1);
  const { data, isLoading, refetch } = trpc.admin.getUsers.useQuery({ page, limit: 20 }, { retry: false });
  const updateRoleMutation = trpc.admin.updateUserRole.useMutation({
    onSuccess: () => { toast.success("Role updated"); refetch(); },
    onError: (err) => toast.error(err.message),
  });

  const users = data?.users || [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
          <Users className="h-6 w-6" /> Users
        </h1>
        <p className="text-muted-foreground mt-1 text-sm">Manage user accounts and roles</p>
      </div>

      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-6 space-y-4">{[1,2,3,4,5].map(i => <Skeleton key={i} className="h-10 w-full" />)}</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Joined</TableHead>
                  <TableHead>Last Sign In</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-xs font-medium">
                          {user.name?.charAt(0)?.toUpperCase() || "U"}
                        </div>
                        <span className="font-medium text-sm">{user.name || "Unknown"}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm">{user.email || "—"}</TableCell>
                    <TableCell>
                      <Select value={user.role} onValueChange={(v: any) => updateRoleMutation.mutate({ userId: user.id, role: v })}>
                        <SelectTrigger className="h-7 w-32">
                          <Badge className={roleColors[user.role] || ""}>{user.role}</Badge>
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="member">Member</SelectItem>
                          <SelectItem value="moderator">Moderator</SelectItem>
                          <SelectItem value="admin">Admin</SelectItem>
                          <SelectItem value="user">User</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(user.createdAt), { addSuffix: true })}
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(user.lastSignInAt), { addSuffix: true })}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {data && data.total > 20 && (
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">{data.total} total users</span>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage(page-1)}>Previous</Button>
            <Button variant="outline" size="sm" disabled={page*20 >= data.total} onClick={() => setPage(page+1)}>Next</Button>
          </div>
        </div>
      )}
    </div>
  );
}
