import React, { useState, useEffect } from "react";
import { Navigate, Outlet } from "react-router-dom";
import Sidebar from "@/components/admin/partials/Sidebar";
import Header from "@/components/admin/partials/Header";
import Banner from "@/components/admin/partials/Banner";

const ManuLayout = () => {
const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
        <>
              <div className="flex h-screen overflow-hidden">
        {/* Sidebar */}
        <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

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

export default ManuLayout;
