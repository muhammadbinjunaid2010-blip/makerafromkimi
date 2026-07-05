import { useEffect, useRef } from "react";
import { Link } from "react-router";
import { ShoppingCart, ArrowRight } from "lucide-react";
import { products } from "../data/products";
import { useCartContext } from "../App";

export default function FeaturedProducts() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { addItem } = useCartContext();

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const cards = el.querySelectorAll(".product-card");
            cards.forEach((card, i) => {
              setTimeout(() => {
                (card as HTMLElement).style.opacity = "1";
                (card as HTMLElement).style.transform = "translateY(0)";
              }, i * 80);
            });
            observer.disconnect();
          }
        });
      },
      { threshold: 0.1 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const featured = products.filter((p) => p.featured === 1);

  const handleAddToCart = (product: (typeof products)[0], e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
    });
  };

  return (
    <section className="bg-white py-20 lg:py-28">
      <div ref={sectionRef} className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-12">
          <h2 className="text-3xl lg:text-4xl font-extrabold text-slate-800">
            Featured Products
          </h2>
          <Link
            to="/shop"
            className="flex items-center gap-1.5 text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
          >
            View All
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featured.map((product) => (
            <Link
              key={product.id}
              to={`/shop/${product.slug}`}
              className="product-card group bg-white rounded-xl border border-slate-200 overflow-hidden opacity-0 translate-y-8 transition-all duration-500 hover:shadow-lg hover:-translate-y-1"
            >
              {/* Image */}
              <div className="aspect-square bg-slate-50 flex items-center justify-center p-4 overflow-hidden">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                />
              </div>

              {/* Content */}
              <div className="p-5">
                <h3 className="font-semibold text-slate-800 text-sm mb-1 truncate">
                  {product.name}
                </h3>
                <p className="text-blue-600 font-bold text-lg mb-3">
                  Rs. {parseFloat(product.price).toLocaleString()}
                </p>
                <button
                  onClick={(e) => handleAddToCart(product, e)}
                  className="w-full flex items-center justify-center gap-2 bg-slate-800 text-white py-2.5 rounded-lg font-medium text-sm hover:bg-slate-900 transition-colors"
                >
                  <ShoppingCart className="w-4 h-4" />
                  Add to Cart
                </button>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
