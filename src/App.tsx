import { ThemeProvider } from "@/components/dark-theme/theme-provider";
import {useParams, Route, Routes } from "react-router-dom";
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
} from "./views/root/pages";
import FormsLayout from "./views/root/FormsLayout";
import Explore from "./views/root/pages/Explore";
import ManuLayout from "./views/root/pages/ManuLayout";
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
import PlayGround from "./views/root/pages/PlayGround";

const App = () => {
  return (
    <>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <Routes>
          {/* public routes */}
          <Route element={<RootLayout />}>
            <Route index element={<Homepage />} />
            <Route path="/about" element={<About />} />
            <Route path="/explore" element={<Explore />} />
            <Route path="*" element={<NotFound />} />
            <Route path="/playground" element={<PlayGround />} />
          </Route>

          <Route element={<FormsLayout />}>
            <Route path="/sign-in" element={<SignInForm />} />
            <Route path="/sign-up" element={<SignUpForm />} />
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
            <Route path="/manu/order/:projectId" element={<OrderList projectId={0}/>} />
            <Route path="/manu" element={<Remind />} />
          </Route>

        </Routes>

        <Toaster />
      </ThemeProvider>
    </>
  );
};

export default App;
