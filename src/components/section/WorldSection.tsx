import { motion } from "framer-motion";
import styles from "@/styles";
import { TitleText, TypingText } from "../shared/CustomText";
import { fadeIn, staggerContainer } from "../../utils/motion";
import { map, p1, p2, p3 } from "../../assets/world_img/index";

const WorldSection = () => {
  return (
    <section className={`${styles.paddings} relative z-10`}>
      <motion.div
        variants={staggerContainer(0, 0)}
        initial="hidden"
        whileInView="show"
        viewport={{ once: false, amount: 0.25 }}
        className={`${styles.innerWidth} mx-auto flex flex-col`}
      >
        <TypingText
          title="| People on the World"
          textStyles="text-center font-normal text-[14px] text-secondary-white"
        />
        <TitleText
          title={
            <>
              做為一個專注於促進跨領域合作和創新的募資平台。它不僅提供了募資的功能，還鼓
              勵不同領域的創作者、專家和投資者共同合作，推動跨界創新項目的發展。
            </>
          }
          textStyles="text-center"
        />

        <motion.div
          variants={fadeIn("up", "tween", 0.3, 1)}
          className="relative mt-[68px] flex w-full h-[550px]"
        >
          <div className=" bg-slate-100 dark:bg-inherit rounded-3xl">
            <img src={map} alt="map" className="w-full h-full object-cover" />
          </div>

          <div className="absolute bottom-20 right-20 w-[70px] h-[70px] p-[6px] rounded-full bg-[#5D6680]">
            <img src={p1} alt="people" className="w-full h-full" />
          </div>

          <div className="absolute top-10 left-20 w-[70px] h-[70px] p-[6px] rounded-full bg-[#5D6680]">
            <img src={p2} alt="people" className="w-full h-full" />
          </div>

          <div className="absolute top-1/2 left-[45%] w-[70px] h-[70px] p-[6px] rounded-full bg-[#5D6680]">
            <img src={p3} alt="people" className="w-full h-full" />
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default WorldSection;
