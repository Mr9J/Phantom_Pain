import { useState } from "react";
import { motion } from "framer-motion";
import ExploreCard from "../shared/ExploreCard";
import { TitleText, TypingText } from "@/components/shared/CustomText";
import styles from "@/styles";
import { staggerContainer } from "@/utils/motion";
import { exploreGames } from "@/assets/games_img/index";

const ExploreSection = () => {
  const [active, setActive] = useState("DS");

  return (
    <section className={`${styles.paddings}`} id="explore">
      <motion.div
        variants={staggerContainer(0, 0)}
        initial="hidden"
        whileInView="show"
        viewport={{ once: false, amount: 0.25 }}
        className={`${styles.innerWidth} mx-auto flex flex-col`}
      >
        <TypingText title="| FROM SOFTWARE" textStyles="text-center" />
        <TitleText
          title={
            <>
              Choose the game you like <br className="md:block hidden" /> to
              explore
            </>
          }
          textStyles="text-center"
        />
        <div className="mt-[50px] flex lg:flex-row flex-col min-h-[70vh] gap-5">
          {exploreGames.map((world, index: number) => (
            <ExploreCard
              key={world.id}
              {...world}
              index={index}
              active={active}
              handleClick={setActive}
            />
          ))}
        </div>
      </motion.div>
    </section>
  );
};

export default ExploreSection;
