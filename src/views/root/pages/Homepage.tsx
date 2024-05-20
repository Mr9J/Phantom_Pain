import ExploreSection from "@/components/ExploreSection";
import HeroSection from "@/components/HeroSection";
import Navbar from "@/components/Navbar";

const Homepage = () => {
  return (
    <>
      <div className="overflow-hidden">
        <Navbar />
        <HeroSection />
        <ExploreSection />
      </div>
    </>
  );
};

export default Homepage;
