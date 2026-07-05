import { useEffect, useRef } from "react";
import { useNavigate } from "react-router";
import {
  Cpu,
  Activity,
  Zap,
  Monitor,
  Wifi,
  Layers,
  Wrench,
  Package,
} from "lucide-react";
import { categories } from "../data/products";

const iconMap: Record<string, React.ReactNode> = {
  Cpu: <Cpu className="w-6 h-6" />,
  Activity: <Activity className="w-6 h-6" />,
  Zap: <Zap className="w-6 h-6" />,
  Monitor: <Monitor className="w-6 h-6" />,
  Wifi: <Wifi className="w-6 h-6" />,
  Layers: <Layers className="w-6 h-6" />,
  Wrench: <Wrench className="w-6 h-6" />,
  Package: <Package className="w-6 h-6" />,
};

export default function Categories() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const cards = el.querySelectorAll(".category-card");
            cards.forEach((card, i) => {
              setTimeout(() => {
                (card as HTMLElement).style.opacity = "1";
                (card as HTMLElement).style.transform = "scale(1)";
              }, i * 60);
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

  return (
    <section id="categories" className="bg-white py-20 lg:py-28">
      <div ref={sectionRef} className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-extrabold text-slate-800 mb-3">
            Shop by Category
          </h2>
          <p className="text-slate-500 text-base">
            Find everything you need for your next project
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => navigate(`/shop?category=${cat.id}`)}
              className="category-card group bg-slate-50 rounded-xl p-6 border border-slate-200 text-left opacity-0 scale-95 transition-all duration-500 hover:bg-blue-50 hover:border-blue-200 hover:shadow-md"
            >
              <div className="w-14 h-14 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mb-4 group-hover:bg-blue-200 transition-colors">
                {iconMap[cat.icon]}
              </div>
              <h3 className="font-semibold text-lg text-slate-800 mb-1">
                {cat.name}
              </h3>
              <p className="text-sm text-slate-500">
                {cat.itemCount} items
              </p>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
