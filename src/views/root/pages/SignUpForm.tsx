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
import { SignUpValidation } from "@/lib/validation";
import logo from "@/assets/_shared_img/logo.png";
import LoaderSvg from "@/components/shared/LoaderSvg";
import { useToast } from "@/components/ui/use-toast";
import {
  useCreateUserAccount,
  useSignInAccount,
} from "@/lib/react-query/queriesAndMutation";
import { useUserContext } from "@/context/AuthContext";
import { ToastAction } from "@/components/ui/toast";
import { Turnstile } from "@marsidev/react-turnstile";
import { useState } from "react";

const SignUpForm = () => {
  const [isVerify, setIsVerify] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { checkAuthUser, isLoading: isUserLoading } = useUserContext();
  const { mutateAsync: signUp, isPending: isCreatingAccount } =
    useCreateUserAccount();
  const { mutateAsync: signIn, isPending: isSigningInUser } =
    useSignInAccount();

  const form = useForm<z.infer<typeof SignUpValidation>>({
    resolver: zodResolver(SignUpValidation),
    defaultValues: {
      nickname: "",
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const handleSignUp = async (user: z.infer<typeof SignUpValidation>) => {
    try {
      if (!isVerify) {
        toast({
          variant: "destructive",
          title: "錯誤",
          description: "請完成驗證",
        });
        return;
      }

      const res = await signUp(user);

      if (res === "註冊資料格式錯誤") {
        toast({
          variant: "destructive",
          title: "錯誤",
          description: "註冊資料格式錯誤",
        });

        return;
      }

      if (res === "使用者已存在") {
        toast({
          variant: "destructive",
          title: "錯誤",
          description: "使用者已存在",
        });

        return;
      }

      if (res === "Email已被使用") {
        toast({
          variant: "destructive",
          title: "錯誤",
          description: "Email已被使用",
        });

        return;
      }

      if (!res) {
        toast({
          variant: "destructive",
          title: "錯誤",
          description: "伺服器錯誤，請稍後再試",
        });

        return;
      }

      const session = await signIn({
        username: user.username,
        password: user.password,
      });

      if (!session) {
        toast({
          variant: "destructive",
          title: "錯誤",
          description: "發生錯誤，請嘗試登入您的帳號",
        });

        return;
      }

      const isLoggedIn = await checkAuthUser();

      if (isLoggedIn) {
        form.reset();
        toast({
          title: "註冊成功",
          description: "歡迎加入Mumu，驗證信已送出，您將被導向首頁",
        });
        navigate("/");
      } else {
        toast({
          variant: "destructive",
          title: "錯誤",
          description: "登入失敗, 請至登入頁面嘗試登入",
          action: (
            <ToastAction altText="Sign In">
              <Link to="/sign-in">登入</Link>
            </ToastAction>
          ),
        });

        return;
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <section className="flex flex-1 items-center flex-col py-10 justify-center overflow-auto custom-scrollbar">
      <Form {...form}>
        <div className="sm:w-[560px] flex justify-center items-center flex-col m-4 sm:m-0">
          <img src={logo} alt="logo" className="h-[64px]" />
          <h2 className="text-2xl font-bold tracking-tighter sm:text-4xl pt-2 sm:pt-4">
            註冊一個新帳號
          </h2>
          <p className="text-blue-500 text-lg md:text-xl font-poetsen">
            Empower your dreams,{" "}
            <span
              onClick={() => {
                form.reset({
                  nickname: "Msit158Team4",
                  username: "Msit158Team4",
                  email: "msit158mumuguest@gmail.com",
                  password: "Msit158Team4!",
                  confirmPassword: "Msit158Team4!",
                });
              }}
            >
              build our future
            </span>
          </p>
          <form
            onSubmit={form.handleSubmit(handleSignUp)}
            className="flex flex-col gap-5 w-full mt-4"
          >
            <FormField
              control={form.control}
              name="nickname"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xl font-bold">暱稱</FormLabel>
                  <FormControl>
                    <Input type="text" className="dark:shad-input" {...field} />
                  </FormControl>
                  <FormMessage className="dark:text-rose-500" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xl font-bold">帳號</FormLabel>
                  <FormControl>
                    <Input type="text" className="dark:shad-input" {...field} />
                  </FormControl>
                  <FormMessage className="dark:text-rose-500" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xl font-bold">Email</FormLabel>
                  <FormControl>
                    <Input type="text" className="dark:shad-input" {...field} />
                  </FormControl>
                  <FormMessage className="dark:text-rose-500" />
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
                  <FormMessage className="dark:text-rose-500" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xl font-bold">確認密碼</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      className="dark:shad-input"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="dark:text-rose-500" />
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
              disabled={isCreatingAccount || isSigningInUser || isUserLoading}
            >
              {isCreatingAccount || isSigningInUser || isUserLoading ? (
                <div className="flex justify-center items-center gap-2">
                  <LoaderSvg /> Loading...
                </div>
              ) : (
                <p className="text-lg font-bold">註冊</p>
              )}
            </Button>
            <p className="text-center mt-2 text-xl">
              已經有帳號了嗎？
              <Link to="/sign-in" className="text-blue-500 ml-1 font-bold">
                登入
              </Link>
            </p>
          </form>
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

export default SignUpForm;
