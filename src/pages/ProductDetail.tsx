import { useParams, Link, useNavigate } from "react-router";
import { ShoppingCart, ArrowLeft, Check, Truck, Shield } from "lucide-react";
import { getProductBySlug, products } from "../data/products";
import { useCartContext } from "../App";
import { useState } from "react";

export default function ProductDetail() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { addItem } = useCartContext();
  const [added, setAdded] = useState(false);

  const product = getProductBySlug(slug || "");

  if (!product) {
    return (
      <div className="pt-32 pb-16 text-center">
        <p className="text-slate-500 text-lg">Product not found</p>
        <Link
          to="/shop"
          className="mt-4 inline-block text-blue-600 font-medium hover:underline"
        >
          Back to Shop
        </Link>
      </div>
    );
  }

  const relatedProducts = products
    .filter((p) => p.categoryId === product.categoryId && p.id !== product.id)
    .slice(0, 4);

  const handleAddToCart = () => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="pt-20 pb-16 bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Back */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-slate-500 text-sm font-medium mb-6 hover:text-slate-800 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>

        {/* Product */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Image */}
          <div className="aspect-square bg-slate-50 rounded-2xl flex items-center justify-center p-8">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-contain"
            />
          </div>

          {/* Details */}
          <div className="flex flex-col justify-center">
            <p className="text-blue-600 font-medium text-sm mb-2">
              {product.categoryName}
            </p>
            <h1 className="text-3xl lg:text-4xl font-extrabold text-slate-800 mb-4">
              {product.name}
            </h1>
            <p className="text-3xl font-bold text-blue-600 mb-6">
              Rs. {parseFloat(product.price).toLocaleString()}
            </p>
            <p className="text-slate-500 leading-relaxed mb-8">
              {product.description}
            </p>

            {/* Features */}
            <div className="flex flex-wrap gap-4 mb-8">
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <Truck className="w-4 h-4 text-blue-600" />
                Free delivery over Rs. 5,000
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <Shield className="w-4 h-4 text-blue-600" />
                Genuine component
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={handleAddToCart}
                className={`flex items-center justify-center gap-2 px-8 py-4 rounded-lg font-semibold text-base transition-all ${
                  added
                    ? "bg-green-500 text-white"
                    : "bg-blue-600 text-white hover:bg-blue-700"
                }`}
              >
                {added ? (
                  <>
                    <Check className="w-5 h-5" />
                    Added to Cart
                  </>
                ) : (
                  <>
                    <ShoppingCart className="w-5 h-5" />
                    Add to Cart
                  </>
                )}
              </button>
              <a
                href="https://wa.me/94771234567"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 px-8 py-4 border border-slate-200 rounded-lg font-semibold text-base text-slate-700 hover:bg-slate-50 transition-colors"
              >
                Order via WhatsApp
              </a>
            </div>

            {/* Stock */}
            <p className="mt-4 text-sm text-slate-500">
              {product.stock > 0 ? (
                <span className="text-green-600 font-medium">
                  In stock ({product.stock} available)
                </span>
              ) : (
                <span className="text-red-500 font-medium">Out of stock</span>
              )}
            </p>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div>
            <h2 className="text-2xl font-extrabold text-slate-800 mb-6">
              Related Products
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((p) => (
                <Link
                  key={p.id}
                  to={`/shop/${p.slug}`}
                  className="group bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
                >
                  <div className="aspect-square bg-slate-50 flex items-center justify-center p-4 overflow-hidden">
                    <img
                      src={p.image}
                      alt={p.name}
                      className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-5">
                    <h3 className="font-semibold text-slate-800 text-sm mb-1 truncate">
                      {p.name}
                    </h3>
                    <p className="text-blue-600 font-bold">
                      Rs. {parseFloat(p.price).toLocaleString()}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
