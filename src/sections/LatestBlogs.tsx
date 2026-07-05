import { useEffect, useRef } from "react";
import { Link } from "react-router";
import { ArrowRight, Clock, User } from "lucide-react";

const blogPosts = [
  {
    id: 1,
    title: "Getting Started with ESP32: A Beginner's Guide",
    excerpt: "Learn how to set up your ESP32 development board, write your first program, and connect to WiFi.",
    author: "Makera Team",
    date: "Jul 2, 2026",
    readTime: "8 min read",
    category: "Tutorials",
    image: "https://images.unsplash.com/photo-1555664424-778a1e5e1b60?w=600&h=400&fit=crop",
  },
  {
    id: 2,
    title: "Building a Line-Following Robot with Arduino",
    excerpt: "Step-by-step guide to building an autonomous line-following robot using IR sensors and Arduino.",
    author: "Ravin Fernando",
    date: "Jun 28, 2026",
    readTime: "12 min read",
    category: "Projects",
    image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=600&h=400&fit=crop",
  },
  {
    id: 3,
    title: "Top 10 Sensors Every Maker Should Have",
    excerpt: "A curated list of essential sensors for your electronics projects, from temperature to motion detection.",
    author: "Sachin Perera",
    date: "Jun 25, 2026",
    readTime: "6 min read",
    category: "Resources",
    image: "https://images.unsplash.com/photo-1581091226033-d5c48150dbaa?w=600&h=400&fit=crop",
  },
];

export default function LatestBlogs() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const cards = el.querySelectorAll(".blog-card");
            cards.forEach((card, i) => {
              setTimeout(() => {
                (card as HTMLElement).style.opacity = "1";
                (card as HTMLElement).style.transform = "translateY(0)";
              }, i * 100);
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
    <section className="bg-slate-50 py-20 lg:py-28">
      <div ref={sectionRef} className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="flex items-end justify-between mb-12">
          <div>
            <p className="text-blue-600 font-semibold text-xs uppercase tracking-widest mb-2">
              Maker Knowledge
            </p>
            <h2 className="text-3xl lg:text-4xl font-extrabold text-slate-800">
              Latest from the Blog
            </h2>
            <p className="text-slate-500 mt-2">
              Tutorials, guides, and stories from the maker community
            </p>
          </div>
          <Link
            to="/blog"
            className="hidden sm:flex items-center gap-1.5 text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
          >
            View All Articles
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {blogPosts.map((post) => (
            <div
              key={post.id}
              className="blog-card group bg-white rounded-2xl border border-slate-200 overflow-hidden opacity-0 translate-y-8 transition-all duration-500 hover:shadow-xl hover:-translate-y-1.5"
            >
              {/* Image */}
              <div className="aspect-[16/9] overflow-hidden">
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>

              {/* Content */}
              <div className="p-6">
                <span className="inline-block text-[11px] font-semibold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full mb-3">
                  {post.category}
                </span>
                <h3 className="font-bold text-slate-800 text-[15px] mb-2 leading-snug group-hover:text-blue-600 transition-colors">
                  {post.title}
                </h3>
                <p className="text-slate-500 text-sm leading-relaxed mb-4 line-clamp-2">
                  {post.excerpt}
                </p>
                <div className="flex items-center justify-between text-xs text-slate-400 pt-3 border-t border-slate-100">
                  <span className="flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5" />
                    {post.author}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5" />
                    {post.readTime}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Mobile CTA */}
        <div className="mt-8 text-center sm:hidden">
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition-colors"
          >
            View All Articles
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
