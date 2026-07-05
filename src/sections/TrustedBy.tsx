import { useEffect, useRef } from "react";

const institutions = [
  "University of Colombo",
  "SLIIT",
  "Moratuwa",
  "UOM",
  "NSBM",
  "IIT",
];

export default function TrustedBy() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const children = el.querySelectorAll(".logo-item");
            children.forEach((child, i) => {
              setTimeout(() => {
                (child as HTMLElement).style.opacity = "1";
                (child as HTMLElement).style.transform = "translateY(0)";
              }, i * 100);
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
    <section className="bg-white border-t border-slate-200 py-12">
      <div ref={ref} className="max-w-6xl mx-auto px-4">
        <p className="text-center text-sm text-slate-500 mb-6">
          Trusted by students and makers at
        </p>
        <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12">
          {institutions.map((name) => (
            <span
              key={name}
              className="logo-item text-slate-400 font-medium text-sm md:text-base opacity-0 translate-y-3 transition-all duration-500"
            >
              {name}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
