import { useEffect, useState } from "react";
import { useUserContext } from "@/context/AuthContext";
import { Navigate, Outlet } from "react-router-dom";

const LoggedInLayout = () => {
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
      {isAuth && <Outlet />}
    </>
  );
};

export default LoggedInLayout;
