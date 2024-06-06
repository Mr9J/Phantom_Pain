import React, { useState, useEffect } from "react";
import { Navigate, Outlet } from "react-router-dom";
import AdminSidebar from "@/components/admin/partials/AdminSidebar";
import Header from "@/components/admin/partials/Header";
import Banner from "@/components/admin/partials/Banner";

const adminLayout = () => {
const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
        <>
              <div className="flex h-screen overflow-hidden">
        {/* Sidebar */}
        <AdminSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        {/* Content area */}
        <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
          {/*  Site header */}
          <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
          <Outlet />
          <Banner />
          </div>
          </div>
        </>
  );
};

export default adminLayout;
