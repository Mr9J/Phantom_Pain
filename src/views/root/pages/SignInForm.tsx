import { Link, useNavigate } from "react-router-dom";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { SignInValidation } from "@/lib/validation";
import logo from "@/assets/_shared_img/logo.png";
import LoaderSvg from "@/components/shared/LoaderSvg";
import { useToast } from "@/components/ui/use-toast";
import { useUserContext } from "@/context/AuthContext";
import { useSignInAccount } from "@/lib/react-query/queriesAndMutation";
import {
  auth,
  GoogleProvide,
  FacebookProvide,
  GithubProvide,
} from "@/config/firebase";
import { signInWithPopup } from "firebase/auth";
import { OuterSignIn } from "@/types";
import { signInWithOthers } from "@/services/auth.service";

const SignInForm = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { checkAuthUser } = useUserContext();
  const { mutateAsync: signIn, isPending } = useSignInAccount();

  const googleHandler = async () => {
    try {
      const result = await signInWithPopup(auth, GoogleProvide);

      if (!result) {
        toast({ title: "登入失敗，請再試一次" });
        return;
      }

      const user: OuterSignIn = {
        nickname: result.user.displayName!,
        username: result.user.email! + "," + result.providerId!,
        thumbnail: result.user.photoURL!,
        uid: result.user.uid!,
      };

      const session = await signInWithOthers(user);

      if (!session) {
        toast({ title: "發生錯誤，請稍後再試 session" });
        return;
      }

      const isLoggedIn = await checkAuthUser();

      if (isLoggedIn) {
        window.alert("登入成功，您將被導向至首頁");
        navigate("/");
      } else {
        toast({ title: "登入失敗，請再試一次" });
        return;
      }
    } catch (error) {
      console.error(error);
    }
  };

  const facebookHandler = async () => {
    try {
      const result = await signInWithPopup(auth, FacebookProvide);

      if (!result) {
        toast({ title: "登入失敗，請再試一次" });
        return;
      }

      const user: OuterSignIn = {
        nickname: result.user.providerData[0].displayName!,
        username: result.user.providerData[0].email + "," + result.providerId!,
        thumbnail: result.user.providerData[0].photoURL!,
        uid: result.user.uid!,
      };

      const session = await signInWithOthers(user);

      if (!session) {
        toast({ title: "發生錯誤，請稍後再試 session" });
        return;
      }

      const isLoggedIn = await checkAuthUser();

      if (isLoggedIn) {
        window.alert("登入成功，您將被導向至首頁");
        navigate("/");
      } else {
        toast({ title: "登入失敗，請再試一次" });
        return;
      }
    } catch (error) {
      console.error(error);
    }
  };

  const githubHandler = async () => {
    try {
      const result = await signInWithPopup(auth, GithubProvide);

      if (!result) {
        toast({ title: "登入失敗，請再試一次" });
        return;
      }

      const user: OuterSignIn = {
        nickname: "Guest",
        username: result.user.providerData[0].email + "," + result.providerId!,
        thumbnail: result.user.providerData[0].photoURL!,
        uid: result.user.uid!,
      };

      const session = await signInWithOthers(user);

      if (!session) {
        toast({ title: "發生錯誤，請稍後再試 session" });
        return;
      }

      const isLoggedIn = await checkAuthUser();

      if (isLoggedIn) {
        window.alert("登入成功，您將被導向至首頁");
        navigate("/");
      } else {
        toast({ title: "登入失敗，請再試一次" });
        return;
      }
    } catch (error) {
      console.error(error);
    }
  };

  const form = useForm<z.infer<typeof SignInValidation>>({
    resolver: zodResolver(SignInValidation),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const handleSignin = async (values: z.infer<typeof SignInValidation>) => {
    const session = await signIn(values);

    if (!session) {
      toast({ title: "登入失敗，請再試一次" });

      return;
    }

    const isLoggedIn = await checkAuthUser();

    if (isLoggedIn) {
      form.reset();
      window.alert("登入成功，您將被導向至首頁");
      navigate("/");
    } else {
      toast({ title: "登入失敗，請再試一次" });
      return;
    }
  };

  return (
    <section className="flex flex-1 justify-center items-center flex-col py-10">
      <Form {...form}>
        <div className="sm:w-[560px] flex justify-center items-center flex-col m-4 sm:m-0">
          <img src={logo} alt="logo" className="h-[64px]" />
          <h2 className="text-2xl font-bold tracking-tighter sm:text-4xl pt-2 sm:pt-4">
            歡迎回到 Mumu
          </h2>
          <p className="text-blue-500 text-lg md:text-xl font-poetsen">
            Empower your dreams, build our future
          </p>
          <form
            onSubmit={form.handleSubmit(handleSignin)}
            className="flex flex-col gap-5 w-full mt-4"
          >
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xl font-bold">帳號</FormLabel>
                  <FormControl>
                    <Input type="text" className="dark:shad-input" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xl font-bold">密碼</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      className="dark:shad-input"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="shad-button_primary">
              {isPending ? (
                <div className="flex justify-center items-center gap-2">
                  <LoaderSvg />
                  Loading...
                </div>
              ) : (
                <p className="text-lg font-bold">登入</p>
              )}
            </Button>
            <p className="text-center mt-2 text-xl">
              還沒有Mumu帳號嗎？
              <Link to="/sign-up" className="text-blue-500 ml-1 font-bold">
                註冊
              </Link>
            </p>
          </form>
          <div className="flex justify-center items-center w-full mt-4">
            <Button
              className="flex-1 mr-2 shad-button_primary"
              onClick={googleHandler}
            >
              Google
            </Button>
            <Button
              className="flex-1 mx-2 shad-button_primary"
              onClick={facebookHandler}
            >
              Facebook
            </Button>
            <Button
              className="flex-1 ml-2 shad-button_primary"
              onClick={githubHandler}
            >
              GitHub
            </Button>
          </div>
          <p className="text-center mt-4 text-xl">
            忘記密碼？
            <Link
              to="/send-reset-email"
              className="text-blue-500 ml-1 font-bold"
            >
              重設密碼
            </Link>
          </p>
          <Link
            to="/"
            className="text-center mt-4 text-xl text-blue-500 font-bold"
          >
            &larr; 回首頁
          </Link>
        </div>
      </Form>
    </section>
  );
};

export default SignInForm;
