import { bottombarLinks } from "@/constants";
import { INavLink } from "@/types";
import { Link, useLocation } from "react-router-dom";

const Bottombar = () => {
  const { pathname } = useLocation();

  return (
    <section className="z-50 flex justify-between items-center w-full sticky bottom-0 rounded-t-[20px]  px-5 py-4 md:hidden dark:bg-dark-2 bg-slate-50">
      {bottombarLinks.map((link: INavLink) => {
        const isActive = pathname === link.to;

        return (
          <Link
            to={link.to}
            key={link.label}
            className={`${
              isActive && "rounded-[10px] bg-blue-500"
            } flex justify-center items-center flex-col gap-1 p-2 transition`}
          >
            <link.icon
              width={16}
              height={16}
              className={`${isActive && "invert brightness-0 transition"}`}
            />
            <p
              className={`text-[10px] font-medium leading-[140%] ${
                isActive && "text-white"
              }`}
            >
              {link.label}
            </p>
          </Link>
        );
      })}
    </section>
  );
};

export default Bottombar;
