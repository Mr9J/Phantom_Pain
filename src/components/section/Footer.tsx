import { motion } from "framer-motion";
import styles from "@/styles";
import { footerVariants } from "../../utils/motion";
import { socials } from "@/assets/footer_img";
import { RocketIcon } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <motion.footer
      variants={footerVariants}
      initial="hidden"
      whileInView="show"
      className={`${styles.xPaddings} py-8 relative`}
    >
      <div className="footer-gradient" />
      <div className={`${styles.innerWidth} mx-auto flex flex-col gap-8`}>
        <div className="flex items-center justify-between flex-wrap gap-5">
          <h4 className="font-bold md:text-[64px] text-[44px] text-black dark:text-white">
            Enter the Mumu
          </h4>
          <button
            type="button"
            className="flex items-center h-fit py-4 px-6 bg-[#25618B] rounded-[32px] gap-[12px]"
          >
            <Link to="/home">
              <RocketIcon className="w-[24px] h-[24px] object-contain text-white" />

              <span className="font-normal text-[16px] text-white">
                Enter MUMU
              </span>
            </Link>
          </button>
        </div>

        <div className="flex flex-col">
          <div className="mb-[50px] h-[2px] dark:bg-white bg-slate-100 opacity-10" />

          <div className="flex items-center justify-between flex-wrap gap-4">
            <h4 className="font-extrabold text-[24px] text-black dark:text-white">
              MUMU
            </h4>
            <p className="font-normal text-[14px] text-black dark:text-white opacity-50">
              Copyright © 2024 MSIT158 Team4. All rights reserved.
            </p>

            <div className="flex gap-4">
              {socials.map((social) => (
                <img
                  key={social.name}
                  src={social.url}
                  alt={social.name}
                  className="w-[24px] h-[24px] object-contain cursor-pointer"
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.footer>
  );
};

export default Footer;
