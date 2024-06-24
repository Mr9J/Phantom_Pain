import { motion } from "framer-motion";
import { TypingText } from "@/components/shared/CustomText";
import styles from "@/styles";
import { fadeIn, staggerContainer } from "@/utils/motion";

const AboutSection = () => {
  return (
    <section className={`${styles.paddings} relative z-10`}>
      <div className="gradient-02 z-0" />
      <motion.div
        variants={staggerContainer(0, 0)}
        initial="hidden"
        whileInView="show"
        viewport={{ once: false, amount: 0.25 }}
        className={`${styles.innerWidth} mx-auto ${styles.flexCenter} flex-col`}
      >
        <TypingText
          title="| About Mumu"
          textStyles="text-center font-normal text-[14px] text-secondary-white"
        />

        <motion.p
          variants={fadeIn("up", "tween", 0.2, 1)}
          className="mt-[8px] font-normal sm:text-[32px] text-[20px] text-center text-secondary-white"
        >
          <span className="font-extrabold">Mumu</span>
          做為一個專注於促進跨領域合作和創新的募資平台。它不僅提供了募資的功能，還鼓
          勵不同領域的創作者、專家和投資者共同合作，推動跨界創新項目的發展。
        </motion.p>
      </motion.div>
    </section>
  );
};

export default AboutSection;
