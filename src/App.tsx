import { ThemeProvider } from "@/components/dark-theme/theme-provider";
import { Route, Routes } from "react-router-dom";
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
  UpdateProfile,
} from "./views/auth/pages";
import LoggedInLayout from "./views/auth/LoggedInLayout";

import ResetPassword from "./views/root/pages/ResetPassword";
import SendResetEmail from "./views/root/pages/SendResetEmail";
import ProjectInfo from "./views/root/pages/ProjectInfo";
import SubHome from "./views/root/pages/SubHome";
import ServiceRoute from "./views/auth/pages/ServiceRoute";
import SearchProject from "./views/root/pages/SearchProject";
import Paypage from "./views/auth/pages/Paypage";
import Productpage from "./views/auth/pages/Prodouctpage";
import CartPage from "./views/auth/pages/CartPage";

const App = () => {
  return (
    <>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <Routes>
          {/* public routes */}
          <Route element={<RootLayout />}>
            <Route index element={<Homepage />} />
            <Route path="/home" element={<SubHome />} />
            <Route path="/about" element={<About />} />
            <Route path="/explore" element={<Explore />} />
            <Route path="*" element={<NotFound />} />
            <Route path="/users/:userId" element={<Users />} />
            <Route path="/project/:pid" element={<ProjectInfo />} />
            <Route path="/SearchProject" element={<SearchProject />} />
            <Route path="/Productpage" element={<Productpage />} />
            <Route path="/Paypage" element={<Paypage />} />
            <Route path="/CartPage" element={<CartPage />} />
            <Route path="/Productpage" element={<Productpage />} />
            <Route path="/Paypage" element={<Paypage />} />
            <Route path="/CartPage" element={<CartPage />} />
          </Route>
          
          {/* 修改的部分 */}
          <Route element={<FormsLayout />}>
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
            <Route path="/update-profile/:id/*" element={<UpdateProfile />} />
          </Route>
          <Route element={<ManuLayout />}>
            <Route path="/manu/dashboard" element={<Dashboard />} />
            <Route path="/manu/projects" element={<Projects />} />
            <Route path="/manu/staffs" element={<Staffs />} />
            <Route path="/manu/orders" element={<Orders />} />
            {/* <Route path="/service" element={<ServiceRoute />} />{" "} */}
            <Route
              path="/manu/order/:projectId"
              element={<OrderList projectId={0} />}
            />
            <Route path="/manu" element={<Remind />} />
          </Route>
          <Route element={<AdminLayout />}>
            <Route path="/admin/projects" element={<AdminProjects />} />
            <Route path="/admin/staffs" element={<AdminStaffs />} />
          </Route>
        </Routes>

        <Toaster />
      </ThemeProvider>
    </>
  );
};

export default App;
