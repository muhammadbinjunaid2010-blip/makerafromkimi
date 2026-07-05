import Hero3D from "../sections/Hero3D";
import TrustedBy from "../sections/TrustedBy";
import FeaturedProducts from "../sections/FeaturedProducts";
import Categories from "../sections/Categories";
import WhyChooseUs from "../sections/WhyChooseUs";
import CTA from "../sections/CTA";

export default function Home() {
  return (
    <main>
      <Hero3D />
      <div className="relative z-20 bg-white">
        <TrustedBy />
        <FeaturedProducts />
        <Categories />
        <WhyChooseUs />
        <CTA />
      </div>
    </main>
  );
}
