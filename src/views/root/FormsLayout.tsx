import { Navigate, Outlet } from "react-router-dom";
import sideImg from "@/assets/form_img/hideo_kojima_sign.jpg";

const FormsLayout = () => {
  const isAuthenticated = false;

  return (
    <div className="flex h-screen">
      {isAuthenticated ? (
        <Navigate to="/" />
      ) : (
        <>
          <Outlet />
          <img
            src={sideImg}
            alt="sideImg"
            className="hidden xl:block h-screen w-1/2 object-cover bg-no-repeat"
          />
        </>
      )}
    </div>
  );
};

export default FormsLayout;
