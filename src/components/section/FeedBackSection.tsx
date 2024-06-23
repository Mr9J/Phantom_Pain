import { motion } from "framer-motion";
import styles from "@/styles";
import { fadeIn, staggerContainer, zoomIn } from "../../utils/motion";
import star from "@/assets/_shared_img/reign-abarintos--cKXtsJWU-I-unsplash.jpg";
import { SearchIcon } from "lucide-react";

const FeedBackSection = () => {
  return (
    <section className={`${styles.paddings}`}>
      <motion.div
        variants={staggerContainer(0, 0)}
        initial="hidden"
        whileInView="show"
        viewport={{ once: false, amount: 0.25 }}
        className={`${styles.innerWidth} mx-auto flex lg:flex-row flex-col gap-6`}
      >
        <motion.div
          variants={fadeIn("right", "tween", 0.2, 1)}
          className="flex-[0.5] lg:max-w-[370px] flex justify-end flex-col gradient-05 sm:p-8 p-4 rounded-[32px] border-[1px] border-[#6A6A6A] relative"
        >
          <div className="feedback-gradient" />
          <div>
            <h4 className="font-bold sm:text-[32px] text-[26px] sm:leading-[40.32px] leading-[36.32px] text-black dark:text-white">
              MSIT158
            </h4>
            <p className="mt-[8px] font-normal sm:text-[18px] text-[12px] sm:leading-[22.68px] leading-[16.68px] text-black dark:text-white">
              第四組
            </p>
          </div>

          <p className="mt-[24px] font-normal sm:text-[24px] text-[18px] sm:leading-[45.6px] leading-[39.6px] text-black dark:text-white">
            資策會 智慧應用微軟C#工程師就業養成班 MSIT158 專題成果發表 <br />
            這個網站是我們的專題成果，僅作為展示用途，不作任何商業使用。以防萬一，請勿留下任何個人資料，例如信用卡資料，或個人隱私資訊。如有任何問題，請聯絡我們。
          </p>
        </motion.div>

        <motion.div
          variants={fadeIn("left", "tween", 0.2, 1)}
          className="relative flex-1 flex justify-center items-center"
        >
          <img
            src={star}
            alt="p4"
            className="w-full lg:h-[610px] h-auto min-h-[210px] object-cover rounded-[40px]"
          />

          <motion.div
            variants={zoomIn(0.4, 1)}
            className="lg:block hidden absolute -left-[10%] top-[3%]"
          >
            <SearchIcon className="w-[155px] h-[155px] object-contain text-blue-500" />
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default FeedBackSection;
