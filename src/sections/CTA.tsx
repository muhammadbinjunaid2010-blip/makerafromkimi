import { useEffect, useRef } from "react";
import { Link } from "react-router";

export default function CTA() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const children = el.querySelectorAll(".cta-animate");
            children.forEach((child, i) => {
              setTimeout(() => {
                (child as HTMLElement).style.opacity = "1";
                (child as HTMLElement).style.transform = "translateY(0)";
              }, i * 150);
            });
            observer.disconnect();
          }
        });
      },
      { threshold: 0.3 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="bg-gradient-to-r from-blue-600 to-blue-700 py-20">
      <div
        ref={sectionRef}
        className="max-w-2xl mx-auto px-4 text-center"
      >
        <h2
          className="cta-animate text-3xl lg:text-4xl font-extrabold text-white opacity-0 translate-y-5 transition-all duration-700"
        >
          Ready to Start Your Next Project?
        </h2>
        <p
          className="cta-animate mt-4 text-white/80 text-base opacity-0 translate-y-5 transition-all duration-700"
        >
          Browse our collection of quality electronics components.
        </p>
        <div
          className="cta-animate mt-8 opacity-0 translate-y-5 transition-all duration-700"
        >
          <Link
            to="/shop"
            className="inline-block px-10 py-4 bg-white text-blue-600 font-semibold rounded-lg hover:bg-slate-100 transition-colors shadow-lg"
          >
            Shop Now
          </Link>
        </div>
      </div>
    </section>
  );
}
