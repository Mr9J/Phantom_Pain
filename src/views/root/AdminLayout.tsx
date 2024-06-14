import { useState, useEffect } from "react";
import { Navigate, Outlet } from "react-router-dom";
import AdminSidebar from "@/components/admin/partials/AdminSidebar";
import Header from "@/components/admin/partials/Header";
import { useUserContext } from "@/context/AuthContext";
import { useCheckAdmin } from "@/lib/react-query/queriesAndMutation";

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { checkAuthUser } = useUserContext();
  const [isAuth, setIsAuth] = useState(true);
  const { mutateAsync: checkAdmin, isPending: isAdminLoading } =
    useCheckAdmin();

  useEffect(() => {
    // checkAuthUser().then((res) => {
    //   setIsAuth(res);
    // });

    checkAdmin().then((res) => {
      setIsAuth(res);
    });
  }, []);

  return (
    <>
      {!isAuth && <Navigate to="/sign-in" />}
      {isAuth && (
        <div className="flex h-screen overflow-hidden">
          {/* Sidebar */}
          <AdminSidebar
            sidebarOpen={sidebarOpen}
            setSidebarOpen={setSidebarOpen}
          />

          {/* Content area */}
          <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
            {/*  Site header */}
            <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
            <Outlet />
            {/* <Banner /> */}
          </div>
        </div>
      )}
    </>
  );
};

export default AdminLayout;
