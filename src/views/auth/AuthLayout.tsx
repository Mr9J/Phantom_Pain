import { Outlet, Navigate } from "react-router-dom";
import LeftSidebar from "@/components/LeftSidebar";
import Topbar from "@/components/Topbar";
import Bottombar from "@/components/Bottombar";
import { useUserContext } from "@/context/AuthContext";
import { useEffect, useState } from "react";

const AuthLayout = () => {
  const { checkAuthUser } = useUserContext();
  const [isAuth, setIsAuth] = useState(true);

  useEffect(() => {
    checkAuthUser().then((res) => {
      setIsAuth(res);
    });
  }, [checkAuthUser]);

  return (
    <>
      {!isAuth && <Navigate to="/sign-in" />}
      {isAuth && (
        <div className="flex h-screen">
          <section className="w-full md:flex">
            <Topbar />
            <LeftSidebar />
            <section className="flex flex-1 h-full">
              <Outlet />
            </section>
            <Bottombar />
          </section>
        </div>
      )}
    </>
  );
};

export default AuthLayout;
