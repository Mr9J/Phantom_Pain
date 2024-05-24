import { motion } from "framer-motion";
import styles from "@/styles";
import { navVariants } from "@/utils/motion";
import { SearchIcon, MenuIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

const Navbar = () => {
  return (
    <motion.nav
      variants={navVariants}
      initial="hidden"
      whileInView="show"
      className={`${styles.xPaddings} py-8 relative`}
    >
      <div className="absolute w-1/2 inset-0 gradient-01" />
      <div
        className={`${styles.innerWidth} mx-auto flex justify-between gap-8`}
      >
        <SearchIcon className="w-6 h-6 object-contain" />
        <h2 className="font-extrabold text-2xl">MUMU</h2>

        <Button variant={"ghost"}>
          <MenuIcon className="w-6 h-6 object-contain" />
        </Button>
      </div>
    </motion.nav>
  );
};

export default Navbar;
