import { useState } from "react";
import { trpc } from "@/providers/trpc";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter,
} from "@/components/ui/dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Ticket, Plus, Edit2, Trash2, Copy } from "lucide-react";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";

export default function AdminCoupons() {
  const { data: coupons, isLoading, refetch } = trpc.coupon.list.useQuery(undefined, { retry: false });
  const deleteMutation = trpc.coupon.delete.useMutation({
    onSuccess: () => { toast.success("Coupon deleted"); refetch(); },
  });
  const createMutation = trpc.coupon.create.useMutation({
    onSuccess: () => { toast.success("Coupon created"); refetch(); setIsOpen(false); resetForm(); },
    onError: (err) => toast.error(err.message),
  });

  const [isOpen, setIsOpen] = useState(false);
  const [form, setForm] = useState({
    code: "", type: "percentage", value: "", minPurchase: "", maxUses: 0,
    startsAt: "", expiresAt: "",
  });
  const resetForm = () => setForm({ code: "", type: "percentage", value: "", minPurchase: "", maxUses: 0, startsAt: "", expiresAt: "" });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate({
      code: form.code,
      type: form.type as any,
      value: form.value,
      minPurchase: form.minPurchase || undefined,
      maxUses: form.maxUses || undefined,
      startsAt: form.startsAt || undefined,
      expiresAt: form.expiresAt || undefined,
    });
  };

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    toast.success("Copied!");
  };

  const typeLabels: Record<string, string> = {
    percentage: "% Off", fixed: "Fixed Off", student_discount: "Student", bulk: "Bulk",
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <Ticket className="h-6 w-6" /> Coupons
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">Manage discount coupons and vouchers</p>
        </div>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button><Plus className="h-4 w-4 mr-2" /> Create Coupon</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Create Coupon</DialogTitle></DialogHeader>
            <form onSubmit={handleCreate} className="space-y-4">
              <div className="space-y-2">
                <Label>Code</Label>
                <Input value={form.code} onChange={(e) => setForm({...form, code: e.target.value.toUpperCase()})} placeholder="SUMMER20" required />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Type</Label>
                  <Select value={form.type} onValueChange={(v) => setForm({...form, type: v})}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="percentage">Percentage</SelectItem>
                      <SelectItem value="fixed">Fixed Amount</SelectItem>
                      <SelectItem value="student_discount">Student Discount</SelectItem>
                      <SelectItem value="bulk">Bulk Discount</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Value</Label>
                  <Input type="number" step="0.01" value={form.value} onChange={(e) => setForm({...form, value: e.target.value})} placeholder={form.type === "fixed" ? "500" : "10"} required />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Min Purchase (optional)</Label>
                  <Input type="number" value={form.minPurchase} onChange={(e) => setForm({...form, minPurchase: e.target.value})} placeholder="1000" />
                </div>
                <div className="space-y-2">
                  <Label>Max Uses (optional)</Label>
                  <Input type="number" value={form.maxUses} onChange={(e) => setForm({...form, maxUses: parseInt(e.target.value) || 0})} placeholder="100" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Start Date (optional)</Label>
                  <Input type="datetime-local" value={form.startsAt} onChange={(e) => setForm({...form, startsAt: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <Label>Expiry Date (optional)</Label>
                  <Input type="datetime-local" value={form.expiresAt} onChange={(e) => setForm({...form, expiresAt: e.target.value})} />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" disabled={createMutation.isPending}>
                  {createMutation.isPending ? "Creating..." : "Create Coupon"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-6 space-y-4">{[1,2,3].map(i => <Skeleton key={i} className="h-10 w-full" />)}</div>
          ) : !coupons || coupons.length === 0 ? (
            <div className="text-center py-12">
              <Ticket className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
              <h3 className="font-medium mb-1">No coupons yet</h3>
              <p className="text-sm text-muted-foreground">Create your first coupon</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Code</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Value</TableHead>
                  <TableHead>Usage</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Expires</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {coupons.map((coupon) => (
                  <TableRow key={coupon.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <code className="px-2 py-1 bg-secondary rounded text-sm font-mono font-bold">{coupon.code}</code>
                        <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => copyCode(coupon.code)}>
                          <Copy className="h-3 w-3" />
                        </Button>
                      </div>
                    </TableCell>
                    <TableCell><Badge variant="outline">{typeLabels[coupon.type] || coupon.type}</Badge></TableCell>
                    <TableCell className="font-medium">
                      {coupon.type === "fixed" ? `Rs. ${Number(coupon.value).toLocaleString()}` : `${coupon.value}%`}
                    </TableCell>
                    <TableCell className="text-sm">{coupon.usedCount || 0}{coupon.maxUses ? ` / ${coupon.maxUses}` : ""}</TableCell>
                    <TableCell>
                      <Badge variant={coupon.isActive ? "default" : "secondary"}>
                        {coupon.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {coupon.expiresAt ? formatDistanceToNow(new Date(coupon.expiresAt), { addSuffix: true }) : "No expiry"}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" className="h-8 w-8"><Edit2 className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => deleteMutation.mutate({ id: coupon.id })}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
