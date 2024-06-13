import { Outlet, Navigate } from "react-router-dom";
import { useUserContext } from "@/context/AuthContext";
import { useEffect, useState } from "react";
import Header from "@/components/Header";

const AuthLayout = () => {
  const { checkAuthUser } = useUserContext();
  const [isAuth, setIsAuth] = useState(true);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setIsScrolled(scrollTop > 0);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    checkAuthUser().then((res) => {
      setIsAuth(res);
    });
  }, []);

  return (
    <>
    {!isAuth && <Navigate to="/sign-in" />}
    {isAuth && (
      <div className="flex h-screen">
        <div className={`${isScrolled ? "fixed" : "relative"} w-full z-50`}>
          <Header />
          <Outlet />
        </div>

        
        
      </div>
    )}
  </>
  );
};

export default AuthLayout;
