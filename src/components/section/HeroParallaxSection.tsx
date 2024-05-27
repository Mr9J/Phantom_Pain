import { bg, mountain, moon, road } from "@/assets/parallax_img";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

const HeroParallaxSection = () => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);
  const backgroundM = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const backgroundMT = useTransform(scrollYProgress, [0, 1], ["0%", "-50%"]);
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <section
      ref={ref}
      className="w-full h-screen overflow-hidden relative grid place-items-center section-parallax"
    >
      <motion.div
        style={{ y: textY }}
        className="text-white text-7xl md:text-[200px] font-extrabold relative z-20 text-center "
      >
        MUMU
        <br />
        EMPOWER YOUR DREAMS
      </motion.div>
      <motion.div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `url(${bg})`,
          backgroundPosition: "bottom",
          backgroundSize: "cover",
          y: backgroundY,
        }}
      />
      <motion.div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `url(${moon})`,
          backgroundPosition: "bottom",
          backgroundSize: "cover",
          x: backgroundM,
        }}
      />
      <motion.div
        className="absolute inset-0 z-10 bottom-[120px]"
        style={{
          backgroundImage: `url(${mountain})`,
          backgroundPosition: "bottom",
          backgroundSize: "cover",
          y: backgroundMT,
        }}
      />
      <div
        className="absolute inset-0 z-20"
        style={{
          backgroundImage: `url(${road})`,
          backgroundPosition: "bottom",
          backgroundSize: "cover",
        }}
      />
    </section>
  );
};

export default HeroParallaxSection;
