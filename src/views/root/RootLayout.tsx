import { Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import Header from "@/components/Header";

const RootLayout = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setIsScrolled(scrollTop > 0);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <>
      <div className={`${isScrolled ? "fixed" : "relative"} w-full z-50`}>
        <Header />
      </div>

      <Outlet />
    </>
  );
};

export default RootLayout;
