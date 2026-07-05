import { trpc } from "@/providers/trpc";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Heart, ShoppingCart, Trash2 } from "lucide-react";
import { Link } from "react-router";
import { toast } from "sonner";

export default function WishlistPage() {
  const { data: wishlist, isLoading, refetch } = trpc.user.getWishlist.useQuery(undefined, {
    retry: false,
  });
  const toggleMutation = trpc.user.toggleSaveProduct.useMutation({
    onSuccess: () => {
      refetch();
      toast.success("Removed from wishlist");
    },
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-48 w-full" />
          ))}
        </div>
      </div>
    );
  }

  const items = wishlist || [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
          <Heart className="h-6 w-6 text-red-500" />
          Wishlist
        </h1>
        <p className="text-muted-foreground mt-1">
          Products you've saved to your wishlist
        </p>
      </div>

      {items.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Heart className="h-12 w-12 text-muted-foreground/50 mb-4" />
            <h3 className="text-lg font-medium mb-1">Your wishlist is empty</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Save products to your wishlist to keep track of them
            </p>
            <Link
              to="/shop"
              className="text-sm text-primary hover:underline font-medium"
            >
              Browse products
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <Card key={item.id} className="overflow-hidden hover:shadow-md transition-shadow">
              <div className="aspect-square bg-secondary/50 flex items-center justify-center">
                {item.product?.image ? (
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <ShoppingCart className="h-12 w-12 text-muted-foreground/30" />
                )}
              </div>
              <CardContent className="p-4">
                <Link
                  to={`/shop/${item.product?.slug}`}
                  className="font-medium text-sm hover:text-primary transition-colors line-clamp-1"
                >
                  {item.product?.name || "Product"}
                </Link>
                <p className="text-sm font-semibold mt-1">
                  LKR {item.product?.price ? parseFloat(item.product.price.toString()).toLocaleString() : "0"}
                </p>
                <div className="flex gap-2 mt-3">
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1"
                    onClick={() => toggleMutation.mutate({ productId: item.productId, wishlist: true })}
                  >
                    <Trash2 className="h-3 w-3 mr-1" />
                    Remove
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
