import { motion } from "framer-motion";
import styles from "@/styles";
import {
  slideIn,
  staggerContainer,
  textVariant,
  HeroSlider,
} from "@/utils/motion";
import star from "@/assets/hero_img/star.jpg";

const HeroSection = () => {
  return (
    <section className={`${styles.yPaddings} sm:pl-16 pl-6`}>
      <motion.div
        variants={staggerContainer(0, 0)}
        initial="hidden"
        whileInView="show"
        viewport={{ once: false, amount: 0.25 }}
        className={`${styles.innerWidth} mx-auto flex flex-col`}
      >
        <div className="flex justify-center items-center flex-col relative z-10">
          <motion.div
            variants={textVariant(1.1)}
            className={styles.heroHeading}
          >
            <h2 className="text-black dark:text-white">Mumu Empower</h2>
          </motion.div>
          <motion.div
            variants={textVariant(1.2)}
            className="flex flex-row justify-center items-center"
          >
            <h2 className="font-bold lg:text-[144px] md:text-[100px] sm:text-[60px] text-[44px] lg:leading-[158.4px] md:leading-[114.4px] sm:leading-[74.4px] leading-[64.4px] uppercase  text-black dark:text-white">
              Your
            </h2>
            {/* <div className="md:w-[212px] sm:w-[80px] w-[60px] md:h-[108px] sm:h-[48px] h-[38px] md:border-[18px] border-[9px] rounded-r-[50px] border-black dark:border-white sm:mx-2 mx-[6px]" /> */}
            <h2 className="font-bold lg:text-[144px] md:text-[100px] sm:text-[60px] text-[44px] lg:leading-[158.4px] md:leading-[114.4px] sm:leading-[74.4px] leading-[64.4px] uppercase  text-black dark:text-white">
              DReams
            </h2>
          </motion.div>
        </div>

        <div className="relative items-center justify-center">
          <motion.div
            variants={HeroSlider}
            initial="initial"
            animate="animate"
            className="absolute text-[50vh] bottom-[-120px] whitespace-nowrap text-slate-100 dark:text-[#ffffff09] w-1/2 font-bold select-none -z-40"
          >
            Empower Your Dreams
          </motion.div>
        </div>

        <motion.div
          variants={slideIn("right", "tween", 0.2, 1)}
          className="relative w-full md:-mt-[20px] -mt-[12px]"
        >
          <div className="absolute w-full h-[300px] hero-gradient rounded-tl-[140px] z-[0] -top-[30px]" />

          <img
            src={star}
            alt="star"
            className="w-full sm:h-[500px] h-[350px] object-cover rounded-tl-[140px] z-10 relative"
          />
        </motion.div>
      </motion.div>
    </section>
  );
};

export default HeroSection;
