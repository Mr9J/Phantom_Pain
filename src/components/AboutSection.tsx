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
        <TypingText title="| About Mumu" textStyles="text-center" />

        <motion.p
          variants={fadeIn("up", "tween", 0.2, 1)}
          className="mt-[8px] font-normal sm:text-[32px] text-[20px] text-center text-secondary-white"
        >
          <span className="font-extrabold text-white">MyGo</span> Lorem ipsum
          dolor sit amet consectetur, adipisicing elit. Deserunt eaque rem enim
          eius odio blanditiis provident, quas possimus, iusto assumenda
          voluptatibus eos ipsum voluptatem recusandae distinctio maxime. Cum,
          fugit velit?
        </motion.p>
      </motion.div>
    </section>
  );
};

export default AboutSection;
