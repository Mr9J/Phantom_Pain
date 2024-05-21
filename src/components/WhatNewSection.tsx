import { motion } from "framer-motion";
import styles from "@/styles";
import { TitleText, TypingText } from "../components/shared/CustomText";
import NewFeatures from "./shared/NewFeatures";
import { planetVariants, staggerContainer, fadeIn } from "../utils/motion";
import { newFeatures } from "../constants";
import whatNew from "../assets/news_img/whats-new.png";

const WhatNewSection = () => {
  return (
    <section className={`${styles.paddings} relative z-10`}>
      <motion.div
        variants={staggerContainer(0, 0)}
        initial="hidden"
        whileInView="show"
        viewport={{ once: false, amount: 0.25 }}
        className={`${styles.innerWidth} mx-auto flex lg:flex-row flex-col gap-8`}
      >
        <motion.div
          variants={fadeIn("right", "tween", 0.2, 1)}
          className="flex-[0.95] flex justify-center flex-col"
        >
          <TypingText title="| Whats new?" textStyles="" />
          <TitleText title={<>What's new about Mumu?</>} textStyles="" />
          <div className="mt-[48px] flex flex-wrap justify-between gap-[24px]">
            {newFeatures.map((feature) => (
              <NewFeatures key={feature.title} {...feature} />
            ))}
          </div>
        </motion.div>
        <motion.div
          variants={planetVariants("right")}
          className={`flex-1 ${styles.flexCenter}`}
        >
          <img
            src={whatNew}
            alt="get-started"
            className="w-[90%] h-[90%] object-contain"
          />
        </motion.div>
      </motion.div>
    </section>
  );
};

export default WhatNewSection;
