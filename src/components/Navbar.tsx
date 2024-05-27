import { motion } from "framer-motion";
import styles from "@/styles";
import { navVariants } from "@/utils/motion";
import { SearchIcon, MenuIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Link } from "react-router-dom";
import { HomeIcon, BookIcon, SmartphoneIcon } from "lucide-react";

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
          <SheetTrigger asChild>
            <Button variant="outline">
              <MenuIcon className="w-6 h-6 object-contain" />
            </Button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Mumu</SheetTitle>
              <SheetDescription>
                Empower your dreams, build our future.
              </SheetDescription>
            </SheetHeader>
            <div className="grid gap-4 py-4">
              <Link to="/" className="grid col-span-3">
                <Button>
                  <HomeIcon className="mr-2 h-4 w-4" /> 首頁
                </Button>
              </Link>
              <Link to="/about" className="grid col-span-3">
                <Button>
                  <BookIcon className="mr-2 h-4 w-4" /> 關於
                </Button>
              </Link>
              <Link to="/social" className="grid col-span-3">
                <Button>
                  <SmartphoneIcon className="mr-2 h-4 w-4" /> 社群
                </Button>
              </Link>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </motion.nav>
  );
};

export default Navbar;
