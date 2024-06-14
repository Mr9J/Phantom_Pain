import { Outlet } from "react-router-dom";
import React, { useEffect, useState } from "react";
import Header from "@/components/Header";

const RootLayout = ({
  input,
  setInput,
}: {
  input: string;
  setInput: React.Dispatch<React.SetStateAction<string>>;
}) => {
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
  }, [input]);

  return (
    <>
      <div className={`${isScrolled ? "fixed" : "relative"} w-full z-50`}>
        <Header input={input} setInput={setInput} />
      </div>

      <Outlet />
    </>
  );
};

export default RootLayout;
