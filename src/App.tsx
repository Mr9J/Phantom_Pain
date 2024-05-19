import { ThemeProvider } from "@/components/theme-provider";
import { Route, Routes } from "react-router-dom";
import RootLayout from "./views/root/RootLayout";
import AuthLayout from "./views/auth/AuthLayout";
import {
  About,
  Homepage,
  SignInForm,
  SignUpForm,
  Social,
} from "./views/root/pages";
import FormsLayout from "./views/root/FormsLayout";

const App = () => {
  return (
    <>
      <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
        <Routes>
          {/* public routes */}
          <Route element={<RootLayout />}>
            <Route index element={<Homepage />} />
            <Route path="/social" element={<Social />} />
            <Route path="/about" element={<About />} />
          </Route>

          <Route element={<FormsLayout />}>
            <Route path="/sign-in" element={<SignInForm />} />
            <Route path="/sign-up" element={<SignUpForm />} />
          </Route>

          {/* public routes */}

          {/* private routes */}
          <Route element={<AuthLayout />}></Route>
        </Routes>
      </ThemeProvider>
    </>
  );
};

export default App;
