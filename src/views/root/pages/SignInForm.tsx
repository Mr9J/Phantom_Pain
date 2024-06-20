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
import { ToastAction } from "@/components/ui/toast";
import { useEffect, useState } from "react";
import CloudflareScript from "@/config/Cloudflare";

const SignInForm = () => {
  const [isRemember, setIsRemember] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { checkAuthUser, isLoading } = useUserContext();
  const { mutateAsync: signIn, isPending } = useSignInAccount();

  const googleHandler = async () => {
    try {
      const result = await signInWithPopup(auth, GoogleProvide);

      if (!result) {
        toast({
          variant: "destructive",
          title: "錯誤",
          description: "登入失敗，請再試一次",
        });

        return;
      }

      const user: OuterSignIn = {
        nickname: result.user.displayName!,
        username: result.user.providerData[0].uid! + "," + result.providerId!,
        thumbnail: result.user.photoURL!,
        uid: result.user.uid!,
      };

      const session = await signInWithOthers(user);

      if (session === "錯誤，請聯絡客服") {
        toast({
          variant: "destructive",
          title: "錯誤",
          description: "錯誤，請聯絡客服",
        });

        return;
      }

      if (session === "帳號已被停權") {
        toast({
          variant: "destructive",
          title: "錯誤",
          description: "帳號已被停權",
        });

        return;
      }

      if (!session) {
        toast({
          variant: "destructive",
          title: "錯誤",
          description: "伺服器錯誤，請稍後再試",
        });

        return;
      }

      const isLoggedIn = await checkAuthUser();

      if (isLoggedIn) {
        toast({
          title: "登入成功",
          description: "您將被導向至首頁",
        });

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
        username: result.user.providerData[0].uid + "," + result.providerId!,
        thumbnail: result.user.providerData[0].photoURL!,
        uid: result.user.uid!,
      };

      const session = await signInWithOthers(user);

      if (session === "錯誤，請聯絡客服") {
        toast({
          variant: "destructive",
          title: "錯誤",
          description: "錯誤，請聯絡客服",
        });

        return;
      }

      if (session === "帳號已被停權") {
        toast({
          variant: "destructive",
          title: "錯誤",
          description: "帳號已被停權",
        });

        return;
      }

      if (!session) {
        toast({
          variant: "destructive",
          title: "錯誤",
          description: "伺服器錯誤，請稍後再試",
        });

        return;
      }

      const isLoggedIn = await checkAuthUser();

      if (isLoggedIn) {
        toast({
          title: "登入成功",
          description: "您將被導向至首頁",
        });
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
        username: result.user.providerData[0].uid + "," + result.providerId!,
        thumbnail: result.user.providerData[0].photoURL!,
        uid: result.user.uid!,
      };

      const session = await signInWithOthers(user);

      if (session === "錯誤，請聯絡客服") {
        toast({
          variant: "destructive",
          title: "錯誤",
          description: "錯誤，請聯絡客服",
        });

        return;
      }

      if (session === "帳號已被停權") {
        toast({
          variant: "destructive",
          title: "錯誤",
          description: "帳號已被停權",
        });

        return;
      }

      if (!session) {
        toast({
          variant: "destructive",
          title: "錯誤",
          description: "伺服器錯誤，請稍後再試",
        });

        return;
      }

      const isLoggedIn = await checkAuthUser();

      if (isLoggedIn) {
        toast({
          title: "登入成功",
          description: "您將被導向至首頁",
        });
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

    if (session === "帳號已被停權") {
      toast({
        variant: "destructive",
        title: "帳號已被停權",
        description: "如有疑問請聯絡客服",
        action: (
          <ToastAction altText="Contact Us">
            {/* <Link to="/">聯絡</Link> */}
            聯絡
          </ToastAction>
        ),
      });

      return;
    }

    if (session === "帳號或密碼錯誤") {
      toast({
        variant: "destructive",
        title: "錯誤",
        description: "帳號或密碼錯誤",
        action: <ToastAction altText="Confirm">確認</ToastAction>,
      });

      return;
    }

    if (!session) {
      toast({
        variant: "destructive",
        title: "錯誤",
        description: "伺服器錯誤，請稍後再試",
      });

      return;
    }

    const isLoggedIn = await checkAuthUser();

    if (isLoggedIn) {
      form.reset();
      toast({
        title: "登入成功",
        description: "您將被導向至首頁",
      });

      if (isRemember) {
        localStorage.setItem(
          "mumuidentity",
          JSON.stringify({
            username: values.username,
            password: values.password,
          })
        );
      }

      if (!isRemember) localStorage.removeItem("mumuidentity");

      navigate("/");
    } else {
      toast({ title: "登入失敗，請再試一次" });
      return;
    }
  };

  useEffect(() => {
    const identity = localStorage.getItem("mumuidentity");

    if (identity) {
      const { username, password } = JSON.parse(identity);

      form.setValue("username", username);
      form.setValue("password", password);
    }
  }, []);

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
            <Button
              type="submit"
              className="shad-button_primary"
              disabled={isPending || isLoading}
            >
              {isPending ? (
                <div className="flex justify-center items-center gap-2">
                  <LoaderSvg />
                  Loading...
                </div>
              ) : (
                <p className="text-lg font-bold">登入</p>
              )}
            </Button>
            <CloudflareScript />
            <div
              className="cf-turnstile"
              data-sitekey="0x4AAAAAAAc5s8I5PK0pJEjH"
              data-callback="javascriptCallback"
            ></div>
            <div className="flex items-center space-x-2">
              <label htmlFor="MarketingAccept" className="flex gap-4">
                <input
                  type="checkbox"
                  id="MarketingAccept"
                  name="marketing_accept"
                  className="size-5 rounded-md border-gray-200 bg-white shadow-sm"
                  onChange={(e) => setIsRemember(e.target.checked)}
                />

                <span className="text-sm">記住我的帳號與密碼</span>
              </label>
            </div>
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
