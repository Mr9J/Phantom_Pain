import { Link, useNavigate } from "react-router-dom";
import logo from "@/assets/_shared_img/logo.png";
import { Button } from "./ui/button";
import { LogOutIcon } from "lucide-react";
import { signOutNative } from "@/services/auth.service";
import { useUserContext } from "@/context/AuthContext";
import { auth } from "@/config/firebase";
import { signOut } from "firebase/auth";

const Topbar = () => {
  const navigate = useNavigate();
  const { user } = useUserContext();

  const signOutHandler = () => {
    signOutNative();
    signOut(auth);
    window.location.reload();
    navigate("/");
  };

  return (
    <section className="sticky top-0 z-50 md:hidden w-full dark:bg-dark-2 bg-slate-50">
      <div className="flex justify-between items-center py-4 px-5">
        <Link to="/" className="flex gap-3 items-center">
          <img src={logo} alt="logo" width={130} height={325} />
        </Link>
        <div className="flex gap-4">
          <Button
            variant="ghost"
            className="flex gap-4 items-center justify-start hover:bg-transparent hover:text-gray-400 !important"
            onClick={signOutHandler}
          >
            <LogOutIcon />
          </Button>
          <Link
            to={`/profile/${user.id}`}
            className="flex justify-center items-center gap-3"
          >
            <img
              src={user.thumbnail}
              alt="thumbnail"
              className="h-8 w-8 rounded-full"
            />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Topbar;
