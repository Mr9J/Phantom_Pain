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
import { Turnstile } from "@marsidev/react-turnstile";

const SignInForm = () => {
  const [isVerify, setIsVerify] = useState(false);
  const [isRemember, setIsRemember] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { checkAuthUser, isLoading } = useUserContext();
  const { mutateAsync: signIn, isPending } = useSignInAccount();

  const googleHandler = async () => {
    try {
      if (!isVerify) {
        toast({
          variant: "destructive",
          title: "請完成驗證",
          description: "請完成驗證後再登入",
        });

        return;
      }

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
      if (!isVerify) {
        toast({
          variant: "destructive",
          title: "請完成驗證",
          description: "請完成驗證後再登入",
        });

        return;
      }

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
      if (!isVerify) {
        toast({
          variant: "destructive",
          title: "請完成驗證",
          description: "請完成驗證後再登入",
        });

        return;
      }

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
    if (!isVerify) {
      toast({
        variant: "destructive",
        title: "請完成驗證",
        description: "請完成驗證後再登入",
      });
      return;
    }

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

      if (session.isAdmin) {
        navigate("/admin");
        return;
      }

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
            Empower your dreams,{" "}
            <span
              onClick={() => {
                form.reset({
                  username: "Msit158Team4",
                  password: "Msit158Team4!",
                });
              }}
            >
              build our future
            </span>
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
            {/* 正式版 */}
            {/* <Turnstile
              siteKey="0x4AAAAAAAc5s8I5PK0pJEjH"
              onSuccess={(e) => {
                if (e) setIsVerify(true);
              }}
            /> */}
            {/* 測試版 */}
            <Turnstile
              siteKey="3x00000000000000000000FF"
              onSuccess={(e) => {
                if (e) setIsVerify(true);
              }}
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

          <div className="flex justify-center items-center flex-col w-full mt-4 gap-4">
            <Button
              onClick={() =>
                form.reset({
                  username: "Test123456!",
                  password: "Test1234!",
                })
              }
            >
              Admin DEMO
            </Button>
            <button
              onClick={googleHandler}
              type="button"
              className="py-2 px-4 flex flex-1 justify-center items-center  bg-red-600 hover:bg-red-700 focus:ring-red-500 focus:ring-offset-red-200 text-white w-full transition ease-in duration-200 text-center text-base font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2  rounded-lg "
            >
              <svg
                width="20"
                height="20"
                fill="currentColor"
                className="mr-2"
                viewBox="0 0 1792 1792"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M896 786h725q12 67 12 128 0 217-91 387.5t-259.5 266.5-386.5 96q-157 0-299-60.5t-245-163.5-163.5-245-60.5-299 60.5-299 163.5-245 245-163.5 299-60.5q300 0 515 201l-209 201q-123-119-306-119-129 0-238.5 65t-173.5 176.5-64 243.5 64 243.5 173.5 176.5 238.5 65q87 0 160-24t120-60 82-82 51.5-87 22.5-78h-436v-264z"></path>
              </svg>
              Sign in with Google
            </button>

            <button
              onClick={facebookHandler}
              type="button"
              className="py-2 px-4 flex justify-center items-center  bg-blue-600 hover:bg-blue-700 focus:ring-blue-500 focus:ring-offset-blue-200 text-white w-full transition ease-in duration-200 text-center text-base font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2  rounded-lg "
            >
              <svg
                width="20"
                height="20"
                fill="currentColor"
                className="mr-2"
                viewBox="0 0 1792 1792"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M1343 12v264h-157q-86 0-116 36t-30 108v189h293l-39 296h-254v759h-306v-759h-255v-296h255v-218q0-186 104-288.5t277-102.5q147 0 228 12z"></path>
              </svg>
              Sign in with Facebook
            </button>

            <button
              onClick={githubHandler}
              type="button"
              className="py-2 px-4 flex justify-center items-center  bg-gray-600 hover:bg-gray-700 focus:ring-gray-500 focus:ring-offset-gray-200 text-white w-full transition ease-in duration-200 text-center text-base font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2  rounded-lg "
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                fill="currentColor"
                className="mr-2"
                viewBox="0 0 1792 1792"
              >
                <path d="M896 128q209 0 385.5 103t279.5 279.5 103 385.5q0 251-146.5 451.5t-378.5 277.5q-27 5-40-7t-13-30q0-3 .5-76.5t.5-134.5q0-97-52-142 57-6 102.5-18t94-39 81-66.5 53-105 20.5-150.5q0-119-79-206 37-91-8-204-28-9-81 11t-92 44l-38 24q-93-26-192-26t-192 26q-16-11-42.5-27t-83.5-38.5-85-13.5q-45 113-8 204-79 87-79 206 0 85 20.5 150t52.5 105 80.5 67 94 39 102.5 18q-39 36-49 103-21 10-45 15t-57 5-65.5-21.5-55.5-62.5q-19-32-48.5-52t-49.5-24l-20-3q-21 0-29 4.5t-5 11.5 9 14 13 12l7 5q22 10 43.5 38t31.5 51l10 23q13 38 44 61.5t67 30 69.5 7 55.5-3.5l23-4q0 38 .5 88.5t.5 54.5q0 18-13 30t-40 7q-232-77-378.5-277.5t-146.5-451.5q0-209 103-385.5t279.5-279.5 385.5-103zm-477 1103q3-7-7-12-10-3-13 2-3 7 7 12 9 6 13-2zm31 34q7-5-2-16-10-9-16-3-7 5 2 16 10 10 16 3zm30 45q9-7 0-19-8-13-17-6-9 5 0 18t17 7zm42 42q8-8-4-19-12-12-20-3-9 8 4 19 12 12 20 3zm57 25q3-11-13-16-15-4-19 7t13 15q15 6 19-6zm63 5q0-13-17-11-16 0-16 11 0 13 17 11 16 0 16-11zm58-10q-2-11-18-9-16 3-14 15t18 8 14-14z"></path>
              </svg>
              Sign in with GitHub
            </button>
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
