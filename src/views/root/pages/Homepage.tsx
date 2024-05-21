import AboutSection from "@/components/AboutSection";
import ExploreSection from "@/components/ExploreSection";
import GetStartedSection from "@/components/GetStartedSection";
import HeroSection from "@/components/HeroSection";
import Navbar from "@/components/Navbar";
import WhatNewSection from "@/components/WhatNewSection";
import WorldSection from "@/components/WorldSection";
import InsightSection from "@/components/InsightSection";
import FeedBackSection from "@/components/FeedBackSection";
import Footer from "@/components/Footer";
import { ModeToggle } from "@/components/dark-theme/mode-toggle";

const Homepage = () => {
  return (
    <>
      <div className="overflow-hidden">
        <ModeToggle />
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
