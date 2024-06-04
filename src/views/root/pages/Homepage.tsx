import AboutSection from "@/components/section/AboutSection";
import ExploreSection from "@/components/section/ExploreSection";
import GetStartedSection from "@/components/section/GetStartedSection";
import Navbar from "@/components/Navbar";
import WhatNewSection from "@/components/section/WhatNewSection";
import WorldSection from "@/components/section/WorldSection";
import InsightSection from "@/components/section/InsightSection";
import FeedBackSection from "@/components/section/FeedBackSection";
import Footer from "@/components/section/Footer";
import HeroSection from "@/components/section/HeroSection";

const Homepage = () => {
  return (
    <>
      <div className="overflow-hidden">
        <Navbar />
        <HeroSection />
        <div className="relative">
          <AboutSection />
          <div className="gradient-03 z-0" />
          <ExploreSection />
        </div>
        <div className="relative">
          <GetStartedSection />
          <div className="gradient-04 z-0" />
          <WhatNewSection />
        </div>
        <WorldSection />
        <div className="relative">
          <InsightSection />
          <div className="gradient-04 z-0" />
          <FeedBackSection />
        </div>
        <Footer />
      </div>
    </>
  );
};

export default Homepage;
