import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import logo from "@/assets/_shared_img/logo.png";
import { useUserContext } from "@/context/AuthContext";
import { sidebarLinks } from "@/constants";
import { INavLink } from "@/types";
import { Button } from "./ui/button";
import { LogOutIcon } from "lucide-react";
import { signOutNative } from "@/services/auth.service";
import { ModeSwitch } from "./dark-theme/mode-switch";
import { signOut } from "firebase/auth";
import { auth } from "@/config/firebase";
import TruncateText from "./shared/TruncateText";

const LeftSidebar = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { user } = useUserContext();

  const signOutHandler = () => {
    signOutNative();
    signOut(auth);
    window.location.reload();
    navigate("/");
  };

  return (
    <nav className="hidden md:flex px-6 py-10 flex-col justify-between min-w-[270px] dark:bg-dark-2 bg-slate-50">
      <div className="flex flex-col gap-11">
        <Link to="/" className="flex gap-3 items-center">
          <img src={logo} alt="logo" width={170} height={36} />
        </Link>
        <Link to={`/profile/${user.id}`} className="flex gap-3 items-center">
          <img
            src={user.thumbnail}
            alt="thumbnail"
            className="h-16 w-16 rounded-full"
          />
          <div className="flex flex-col">
            <div className="flex w-full">
              <TruncateText
                content={user.nickname}
                maxLength={18}
                textStyles="text-[18px] font-bold leading-[140%]"
              />
            </div>
            <p className="text-[14px] font-normal leading-[140%]">
              @{user.username.split(",")[0]}
            </p>
          </div>
        </Link>
        <ul className="flex flex-col gap-6">
          {sidebarLinks.map((link: INavLink) => {
            const isActive = pathname === link.to;

            return (
              <li
                key={link.label}
                className={`rounded-lg text-[16px] font-medium leading-[140%] hover:text-white hover:bg-blue-500 transition group ${
                  isActive && "bg-blue-500 text-white"
                }`}
              >
                <NavLink to={link.to} className="flex gap-4 items-center p-4">
                  <link.icon
                    className={`group-hover:invert group-hover:brightness-0 group-hover:transition text-blue-500 ${
                      isActive && "invert brightness-0 transition"
                    }`}
                  />
                  {link.label}
                </NavLink>
              </li>
            );
          })}
        </ul>
      </div>
      <ModeSwitch />
      <Button
        variant="ghost"
        className="flex gap-4 items-center justify-start hover:bg-transparent hover:text-gray-400 !important"
        onClick={signOutHandler}
      >
        <LogOutIcon />
        <p className="text-[14px] font-medium leading-[140%] lg:text-[16px]">
          Log out
        </p>
      </Button>
    </nav>
  );
};

export default LeftSidebar;
