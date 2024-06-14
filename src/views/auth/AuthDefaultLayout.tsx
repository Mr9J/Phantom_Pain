import { Outlet, Navigate } from "react-router-dom";
import { useUserContext } from "@/context/AuthContext";
import { useEffect, useState } from "react";
import Header from "@/components/Header";

const AuthDefaultLayout  = ({
  input,
  setInput,
}: {
  input: string;
  setInput: React.Dispatch<React.SetStateAction<string>>;
}) => {
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
      <div >
        <div className={`${isScrolled ? "fixed" : "relative"} w-full z-50`}>
          <Header input={input} setInput={setInput}/>
          
        </div>
        <Outlet />

        
        
      </div>
    )}
  </>
  );
};

export default AuthDefaultLayout ;
