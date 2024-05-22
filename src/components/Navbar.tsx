import { motion } from "framer-motion";
import styles from "@/styles";
import { navVariants } from "@/utils/motion";
import { SearchIcon, MenuIcon } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { buttonVariants } from "@/components/ui/button";

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

        <Sheet key={"right"}>
          <SheetTrigger>
            <Button variant={"ghost"}>
              <MenuIcon className="w-6 h-6 object-contain" />
            </Button>
          </SheetTrigger>
          <SheetContent side={"right"}>
            <SheetHeader>
              <SheetTitle>Mumu</SheetTitle>
              <SheetDescription>
                Empower your dreams, Build our future
              </SheetDescription>
            </SheetHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Link
                  to="/explore"
                  className={`${buttonVariants({
                    variant: "link",
                  })} col-span-4`}
                >
                  <p className="text-3xl">探索</p>
                </Link>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Link
                  to="/"
                  className={`${buttonVariants({
                    variant: "link",
                  })} col-span-4`}
                >
                  <p className="text-3xl">社群</p>
                </Link>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Link
                  to="/about"
                  className={`${buttonVariants({
                    variant: "link",
                  })} col-span-4`}
                >
                  <p className="text-3xl">關於</p>
                </Link>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Link
                  to="/sign-up"
                  className={`${buttonVariants({
                    variant: "link",
                  })} col-span-4`}
                >
                  <p className="text-3xl">註冊</p>
                </Link>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Link
                  to="/sign-in"
                  className={`${buttonVariants({
                    variant: "link",
                  })} col-span-4`}
                >
                  <p className="text-3xl">登入</p>
                </Link>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </motion.nav>
  );
};

export default Navbar;
