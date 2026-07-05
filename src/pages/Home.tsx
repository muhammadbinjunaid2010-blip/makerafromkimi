import Hero3D from "../sections/Hero3D";
import TrustedBy from "../sections/TrustedBy";
import FeaturedCommunityProjects from "../sections/FeaturedCommunityProjects";
import LatestBlogs from "../sections/LatestBlogs";
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
        {/* Community first - not marketplace */}
        <FeaturedCommunityProjects />
        <LatestBlogs />
        {/* Marketplace preview - de-emphasized */}
        <FeaturedProducts />
        <Categories />
        <WhyChooseUs />
        <CTA />
      </div>
    </main>
  );
}
