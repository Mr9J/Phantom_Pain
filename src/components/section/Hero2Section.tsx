import { motion } from "framer-motion";
import { HeroTextVariant, staggerContainer, fadeIn } from "@/utils/motion";
import hero from "@/assets/hero2_img/hero.png";

const Hero2Section = () => {
  return (
    <motion.div
      variants={staggerContainer(0, 0)}
      initial="hidden"
      whileInView="show"
      viewport={{ once: false, amount: 0.25 }}
      className="w-screen h-screen"
    >
      <div
        className="overflow-hidden relative"
        style={{ height: "calc(100vh - 100px)" }}
      >
        <div className="max-w-[1366px] h-full m-auto">
          <motion.div
            className="lg:w-1/2 lg:h-full w-full h-1/2 gap-5 flex flex-col justify-center items-center lg:items-baseline text-center lg:text-start lg:gap-10"
            variants={HeroTextVariant}
            initial="initial"
            animate="animate"
          >
            <motion.h2
              variants={HeroTextVariant}
              className="text-[30px] text-[#663399] tracking-[10px]"
            >
              Build Our Future
            </motion.h2>
            <motion.h2
              variants={HeroTextVariant}
              className="lg:text-[88px] text-[36px]"
            >
              Mumu Empower Your Dreams
            </motion.h2>
            <motion.div variants={HeroTextVariant}>
              <motion.button
                variants={HeroTextVariant}
                className="group group-hover:before:duration-500 group-hover:after:duration-500 after:duration-500 hover:border-rose-300 hover:before:[box-shadow:_20px_20px_20px_30px_#a21caf] duration-500 before:duration-500 hover:duration-500 underline underline-offset-2 hover:after:-right-8 hover:before:right-12 hover:before:-bottom-8 hover:before:blur hover:underline hover:underline-offset-4  origin-left hover:decoration-2 hover:text-rose-300 relative bg-neutral-800 h-16 w-64 border text-left p-3 text-gray-50 text-base font-bold rounded-lg  overflow-hidden  before:absolute before:w-12 before:h-12 before:content[''] before:right-1 before:top-1 before:z-10 before:bg-violet-500 before:rounded-full before:blur-lg  after:absolute after:z-10 after:w-20 after:h-20 after:content['']  after:bg-rose-300 after:right-8 after:top-3 after:rounded-full after:blur-lg"
              >
                Explore
              </motion.button>
              <span className="px-2"></span>
              <motion.button
                variants={HeroTextVariant}
                className="group group-hover:before:duration-500 group-hover:after:duration-1000 after:duration-500 hover:border-sky-300  duration-500 before:duration-500 hover:duration-500 underline underline-offset-2    hover:after:-right-2 hover:before:top-8 hover:before:right-16 hover:after:scale-150 hover:after:blur-none hover:before:-bottom-8 hover:before:blur-none hover:bg-sky-300 hover:underline hover:underline-offset-4  origin-left hover:decoration-2 hover:text-sky-900 relative bg-sky-800 h-16 w-64 border text-left p-3 text-gray-50 text-base font-bold rounded-lg  overflow-hidden  before:absolute before:w-12 before:h-12 before:content[''] before:right-1 before:top-1 before:z-10 before:bg-sky-400 before:rounded-full before:blur-lg  after:absolute after:z-10 after:w-20 after:h-20 after:content['']  after:bg-cyan-600 after:right-8 after:top-3 after:rounded-full after:blur"
              >
                Contact Us
              </motion.button>
            </motion.div>
          </motion.div>
        </div>
        <motion.div
          className="absolute text-[50vh] bottom-[-120px] whitespace-nowrap text-slate-100 dark:text-[#ffffff09] w-1/2 font-bold select-none -z-40"
          variants={HeroTextVariant}
          initial="initial"
          animate="animate"
        >
          Empower Your Dreams, Build Our Future
        </motion.div>
        <motion.div
          variants={fadeIn("up", "tween", 0.2, 1)}
          className="lg:h-full absolute lg:top-0 top-[unset] bottom-0 right-0 h-1/2 "
        >
          <img src={hero} alt="hero" className="w-full h-full object-cover" />
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Hero2Section;
