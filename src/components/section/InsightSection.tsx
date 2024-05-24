import { motion } from "framer-motion";
import styles from "@/styles";
import { staggerContainer } from "../../utils/motion";
import { TitleText, TypingText } from "../shared/CustomText";
import { insights } from "../../assets/insight_img/index";
import InsightCard from "../shared/InsightCard";

const InsightSection = () => {
  return (
    <section className={`${styles.paddings} relative z-10`}>
      <motion.div
        variants={staggerContainer(0, 0)}
        initial="hidden"
        whileInView="show"
        viewport={{ once: false, amount: 0.25 }}
        className={`${styles.innerWidth} mx-auto flex flex-col`}
      >
        <TypingText title="| Insight" textStyles="text-center" />
        <TitleText title={<>Insight about mumu</>} textStyles="text-center" />
        <div className="mt-[50px] flex flex-col gap-[30px]">
          {insights.map((item, index) => (
            <InsightCard key={`insight-${index}`} {...item} index={index + 1} />
          ))}
        </div>
      </motion.div>
    </section>
  );
};

export default InsightSection;
