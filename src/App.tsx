import { useEffect, useState } from "react";
import { ThemeProvider } from "@/components/dark-theme/theme-provider";
import { Route, Routes, Navigate } from "react-router-dom";
import RootLayout from "./views/root/RootLayout";
import AuthLayout from "./views/auth/AuthLayout";
import {
  About,
  Homepage,
  SignInForm,
  SignUpForm,
  Dashboard,
  Projects,
  Staffs,
  Orders,
  OrderList,
  Remind,
  AdminProjects,
  AdminStaffs,
  Users,
  Test,
  Coupons,
} from "./views/root/pages";
import FormsLayout from "./views/root/FormsLayout";
import Explore from "./views/root/pages/Explore";
import ManuLayout from "./views/root/ManuLayout";
import AdminLayout from "./views/root/AdminLayout";
import { Toaster } from "./components/ui/toaster";
import NotFound from "./views/root/pages/NotFound";
import {
  AllUsers,
  Bookmarks,
  Browser,
  CreatePost,
  EditPost,
  EmailVerify,
  PostDetails,
  Profile,
  Social,
} from "./views/auth/pages";
import LoggedInLayout from "./views/auth/LoggedInLayout";
import ServiceRoute from "./views/auth/pages/ServiceRoute";
import ResetPassword from "./views/root/pages/ResetPassword";
import SendResetEmail from "./views/root/pages/SendResetEmail";
import ProjectInfo from "./views/root/pages/ProjectInfo";
import SubHome from "./views/root/pages/SubHome";
import SearchProject from "./views/root/pages/SearchProject";
import ReturnURL from "./components/service/ReturnURL";
import Paypage from "./views/auth/pages/Paypage";
import Productpage from "./views/auth/pages/Prodouctpage";
import CartPage from "./views/auth/pages/CartPage";
import PurchasHistory from "./views/auth/pages/PurchasHistory";

// import StartProject from "./views/root/pages/StartProject";

import Like from "./components/Like";
import AuthDefaultLayout from "./views/auth/AuthDefaultLayout";
import Playground from "./views/root/pages/Playground";
import ReSendEmail from "./views/root/pages/ReSendEmail";
import { useToast } from "./components/ui/use-toast";
import axios from "axios";
import Create from "./views/root/pages/Create";
import { CartProvider } from "./context/CartContext";
import EditProject from "./views/root/pages/EditProject";


const App = () => {
  const [input, setInput] = useState("");
  const { toast } = useToast();
  const URL = import.meta.env.VITE_BACK_URL;
  const test = async () => {
    //console.log("test");
    await axios.get(`${URL}/WeatherForecast`);
  };

  useEffect(() => {
    const res = test();

    res.catch((err) => {
      toast({
        variant: "destructive",
        title: "大哥",
        description: "你的後端掛了",
      });
    });
  }, []);

  return (
    <>
    <CartProvider>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <Routes>
          {/* public routes */}
          <Route element={<RootLayout input={input} setInput={setInput} />}>
            <Route index element={<Homepage />} />
            <Route path="/home" element={<SubHome />} />
            <Route path="/about" element={<About />} />
            <Route path="/explore" element={<Explore />} />
            <Route path="*" element={<NotFound />} />
            <Route path="/users/:id/*" element={<Users />} />
            <Route path="/project/:pid" element={<ProjectInfo />} />
            <Route
              path="/SearchProject"
              element={<SearchProject input={input} setInput={setInput} />}
            />

            {/* <Route path="/StartProject" element={<StartProject />} /> */}
            <Route path="/CreateProject" element={<Create />} />
            <Route path="/EditProject/:pid" element={<EditProject />} />

            {/* <Route path="/Like" element={<Like/>}/> */}
          </Route>
          <Route path="/playground" element={<Playground />}></Route>

          {/* 修改的部分 */}
          <Route element={<FormsLayout />}>
            <Route path="/resend-email" element={<ReSendEmail />} />
            <Route path="/sign-in" element={<SignInForm />} />
            <Route path="/sign-up" element={<SignUpForm />} />
            <Route path="/reset-password/:jwt" element={<ResetPassword />} />
            <Route path="/send-reset-email" element={<SendResetEmail />} />
          </Route>
          {/* public routes */}
          {/* private routes */}
          <Route element={<LoggedInLayout />}>
            <Route
              path="/email-verify/:username/:Eid/*"
              element={<EmailVerify />}
            />
          </Route>
          <Route element={<AuthLayout />}>
            <Route path="/social" element={<Social />} />
            <Route path="/browser" element={<Browser />} />
            <Route path="/all-users" element={<AllUsers />} />
            <Route path="/bookmarks" element={<Bookmarks />} />
            <Route path="/create-post" element={<CreatePost />} />
            <Route path="/update-post/:id" element={<EditPost />} />
            <Route path="/posts/:id" element={<PostDetails />} />
            <Route path="/profile/:id/*" element={<Profile />} />
          </Route>

          <Route
            element={<AuthDefaultLayout input={input} setInput={setInput} />}
          >
            <Route path="/Like" element={<Like />} />
            <Route path="/Productpage/:pid" element={<Productpage />} />
            <Route path="/Paypage" element={<Paypage />} />
            <Route path="/CartPage" element={<CartPage />} />
            <Route path="/PurchasHistory" element={<PurchasHistory />} />
          </Route>

          <Route element={<ManuLayout />}>
            <Route path="/manu/coupons" element={<Coupons />} />
            <Route path="/manu/test" element={<Test />} />
            <Route path="/manu/dashboard" element={<Dashboard />} />
            <Route path="/manu/projects" element={<Projects />} />
            <Route path="/manu/staffs" element={<Staffs />} />
            <Route path="/manu/orders" element={<Orders />} />
            <Route path="/manu/service" element={<ServiceRoute />} />
            <Route
              path="/manu/order/:projectId"
              element={<OrderList projectId={0} />}
            />
            <Route path="/manu" element={<Remind />} />
          </Route>
          <Route element={<AdminLayout />}>
            <Route path="/admin/service" element={<ServiceRoute />} />
            <Route path="/admin/projects" element={<AdminProjects />} />
            <Route path="/admin/staffs" element={<AdminStaffs />} />
            <Route path="/admin" element={<Navigate to="/admin/projects" />} />
          </Route>
          <Route path="/ReturnURL" element={<ReturnURL />} />
        </Routes>

        <Toaster />
      </ThemeProvider>
      </CartProvider>
    </>
  );
};

export default App;
