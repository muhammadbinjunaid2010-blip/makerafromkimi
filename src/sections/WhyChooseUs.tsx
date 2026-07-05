import { useEffect, useRef } from "react";
import {
  Shield,
  Truck,
  GraduationCap,
  HeadphonesIcon,
  CreditCard,
  RotateCcw,
} from "lucide-react";

const features = [
  {
    icon: <Shield className="w-8 h-8" />,
    title: "Genuine Components",
    description:
      "We source only authentic, high-quality components from trusted manufacturers.",
  },
  {
    icon: <Truck className="w-8 h-8" />,
    title: "Fast Delivery",
    description:
      "Island-wide shipping within 2-3 business days. Free delivery on orders over Rs. 5,000.",
  },
  {
    icon: <GraduationCap className="w-8 h-8" />,
    title: "Student Pricing",
    description:
      "Special discounts for students and educational institutions. Bulk order pricing available.",
  },
  {
    icon: <HeadphonesIcon className="w-8 h-8" />,
    title: "Project Support",
    description:
      "Get help with your projects from our community of makers and engineers.",
  },
  {
    icon: <CreditCard className="w-8 h-8" />,
    title: "Secure Payments",
    description:
      "Multiple payment options including card, bank transfer, and cash on delivery.",
  },
  {
    icon: <RotateCcw className="w-8 h-8" />,
    title: "Easy Returns",
    description:
      "Hassle-free returns within 7 days for defective or incorrect items.",
  },
];

export default function WhyChooseUs() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const cards = el.querySelectorAll(".feature-card");
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
    <section id="why-choose" className="bg-slate-50 py-20 lg:py-28">
      <div ref={sectionRef} className="max-w-7xl mx-auto px-4 sm:px-6">
        <h2 className="text-3xl lg:text-4xl font-extrabold text-slate-800 text-center mb-12">
          Why Makera?
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="feature-card bg-white rounded-xl p-8 shadow-sm opacity-0 translate-y-5 transition-all duration-600"
            >
              <div className="text-blue-600 mb-4">{feature.icon}</div>
              <h3 className="font-bold text-xl text-slate-800 mb-2">
                {feature.title}
              </h3>
              <p className="text-slate-500 text-[15px] leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
