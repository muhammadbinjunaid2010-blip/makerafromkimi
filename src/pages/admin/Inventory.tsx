import { useState } from "react";
import { trpc } from "@/providers/trpc";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Plus, Search, Download, Edit2, Trash2, Star, Package, AlertTriangle } from "lucide-react";
import { toast } from "sonner";

export default function AdminInventory() {
  const [search, setSearch] = useState("");
  const [filterOutOfStock, setFilterOutOfStock] = useState(false);
  const [filterLowStock, setFilterLowStock] = useState(false);
  const [page, setPage] = useState(1);

  const { data, isLoading, refetch } = trpc.inventory.list.useQuery({
    page,
    limit: 20,
    search: search || undefined,
    outOfStock: filterOutOfStock || undefined,
    lowStock: filterLowStock || undefined,
  }, { retry: false });

  const deleteMutation = trpc.inventory.delete.useMutation({
    onSuccess: () => { toast.success("Product deleted"); refetch(); },
    onError: (err) => toast.error(err.message),
  });

  const toggleFeaturedMutation = trpc.inventory.toggleFeatured.useMutation({
    onSuccess: () => refetch(),
  });

  const exportMutation = trpc.inventory.exportProducts.useQuery(undefined, { enabled: false });

  const handleExport = async () => {
    try {
      const result = await exportMutation.refetch();
      if (result.data) {
        const csv = ["name,slug,price,sku,barcode,stock,supplier,category",
          ...result.data.map(p => `${p.name},${p.slug},${p.price},${p.sku||''},${p.barcode||''},${p.stock},${p.supplier||''},${p.categoryName||''}`)
        ].join("\n");
        const blob = new Blob([csv], { type: "text/csv" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `products-export-${new Date().toISOString().split("T")[0]}.csv`;
        a.click();
        toast.success("Products exported");
      }
    } catch {
      toast.error("Export failed");
    }
  };

  const products = data?.products || [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Inventory</h1>
          <p className="text-muted-foreground mt-1 text-sm">Manage your products and stock levels</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleExport}>
            <Download className="h-4 w-4 mr-2" /> Export
          </Button>
          <Button asChild>
            <a href="/admin/products/new"><Plus className="h-4 w-4 mr-2" /> Add Product</a>
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search products by name, SKU, barcode..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="pl-9 h-9"
          />
        </div>
        <Button variant={filterOutOfStock ? "default" : "outline"} size="sm" onClick={() => { setFilterOutOfStock(!filterOutOfStock); setPage(1); }}>
          <AlertTriangle className="h-4 w-4 mr-1" /> Out of Stock
        </Button>
        <Button variant={filterLowStock ? "default" : "outline"} size="sm" onClick={() => { setFilterLowStock(!filterLowStock); setPage(1); }}>
          <Package className="h-4 w-4 mr-1" /> Low Stock
        </Button>
      </div>

      {/* Products Table */}
      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-6 space-y-4">
              {[1,2,3,4,5].map(i => <Skeleton key={i} className="h-10 w-full" />)}
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-12">
              <Package className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
              <h3 className="font-medium mb-1">No products found</h3>
              <p className="text-sm text-muted-foreground">Add your first product to get started</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>SKU</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Stock</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center overflow-hidden shrink-0">
                          {product.image ? <img src={product.image} alt="" className="w-full h-full object-cover" /> : <Package className="h-5 w-5 text-muted-foreground" />}
                        </div>
                        <div>
                          <p className="font-medium text-sm">{product.name}</p>
                          <p className="text-xs text-muted-foreground">{product.slug}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-xs font-mono">{product.sku || "—"}</TableCell>
                    <TableCell>
                      <div>
                        <p className="text-sm font-medium">Rs. {parseFloat(product.price.toString()).toLocaleString()}</p>
                        {product.discountPrice && <p className="text-xs text-green-600">Rs. {parseFloat(product.discountPrice.toString()).toLocaleString()}</p>}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span className={`text-sm font-medium ${product.stock === 0 ? "text-red-600" : product.stock <= (product.lowStockThreshold || 10) ? "text-amber-600" : "text-green-600"}`}>
                          {product.stock}
                        </span>
                        {product.stock === 0 && <Badge variant="destructive" className="text-[10px] h-5">OOS</Badge>}
                        {product.stock > 0 && product.stock <= (product.lowStockThreshold || 10) && <Badge variant="secondary" className="text-[10px] h-5">Low</Badge>}
                      </div>
                    </TableCell>
                    <TableCell className="text-sm">{product.categoryName || "—"}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        {product.featured === 1 && <Star className="h-3 w-3 text-amber-500 fill-amber-500" />}
                        {product.studentDiscount && <Badge variant="outline" className="text-[10px] h-5">Student</Badge>}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => toggleFeaturedMutation.mutate({ id: product.id, featured: product.featured !== 1 })}>
                          <Star className={`h-4 w-4 ${product.featured === 1 ? "text-amber-500 fill-amber-500" : ""}`} />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => { if (confirm("Delete this product?")) deleteMutation.mutate({ id: product.id }); }}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Pagination */}
      {data && data.total > 20 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">Showing {(page-1)*20+1}-{Math.min(page*20, data.total)} of {data.total}</p>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage(page-1)}>Previous</Button>
            <Button variant="outline" size="sm" disabled={page*20 >= data.total} onClick={() => setPage(page+1)}>Next</Button>
          </div>
        </div>
      )}
    </div>
  );
}
