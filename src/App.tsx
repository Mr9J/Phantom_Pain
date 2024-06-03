import { ThemeProvider } from "@/components/dark-theme/theme-provider";
import { Route, Routes } from "react-router-dom";
import RootLayout from "./views/root/RootLayout";
import AuthLayout from "./views/auth/AuthLayout";
import {
  About,
  Homepage,
  SignInForm,
  SignUpForm,
  Social,
  Dashboard,
  Projects,
  Staffs,
  Orders,
  OrderList,
} from "./views/root/pages";
import FormsLayout from "./views/root/FormsLayout";
import Explore from "./views/root/pages/Explore";
import ManuLayout from "./views/root/pages/ManuLayout";
import { Toaster } from "./components/ui/toaster";
import NotFound from "./views/root/pages/NotFound";

const App = () => {
  return (
    <>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <Routes>
          {/* public routes */}
          <Route element={<RootLayout />}>
            <Route index element={<Homepage />} />
            <Route path="/social" element={<Social />} />
            <Route path="/about" element={<About />} />
            <Route path="/explore" element={<Explore />} />
            <Route path="*" element={<NotFound />} />
          </Route>

          <Route element={<FormsLayout />}>
            <Route path="/sign-in" element={<SignInForm />} />
            <Route path="/sign-up" element={<SignUpForm />} />
          </Route>

          {/* public routes */}

          {/* private routes */}
          <Route element={<AuthLayout />}></Route>
          
         <Route element={<ManuLayout />}>
          <Route path="/manu/dashboard" element={<Dashboard />} />
          <Route path="/manu/projects" element={<Projects />} />
          <Route path="/manu/staffs" element={<Staffs />} />
          <Route path="/manu/orders" element={<Orders />} />
          <Route path="/manu/orderList" element={<OrderList />} />
          <Route path="/manu" element={<Dashboard />} />
          </Route>

          <Route path="/manu/dashboard" element={<Dashboard />} />
        </Routes>

        <Toaster />
      </ThemeProvider>
    </>
  );
};

export default App;
