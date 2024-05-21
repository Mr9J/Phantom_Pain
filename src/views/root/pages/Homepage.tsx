import AboutSection from "@/components/AboutSection";
import ExploreSection from "@/components/ExploreSection";
import HeroSection from "@/components/HeroSection";
import Navbar from "@/components/Navbar";

const Homepage = () => {
  return (
    <>
      <div className="overflow-hidden">
        <Navbar />
        <HeroSection />
        <AboutSection />
        <ExploreSection />
      </div>
    </>
  );
};

export default Homepage;
