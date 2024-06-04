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

const SignUpForm = () => {
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
      const res = await signUp(user);

      if (res !== "註冊成功") {
        toast({
          title: "註冊失敗, 請再試一次",
        });

        return;
      }

      const session = await signIn({
        username: user.username,
        password: user.password,
      });

      if (!session) {
        toast({ title: "發生錯誤，請嘗試登入您的帳號" });
        return;
      }

      const isLoggedIn = await checkAuthUser();

      if (isLoggedIn) {
        form.reset();
        window.alert("註冊成功，您將被導向至首頁");
        navigate("/");
      } else {
        toast({ title: "登入失敗, 請至登入頁面嘗試登入" });
        return;
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <section className="flex flex-1 items-center flex-col py-10 overflow-auto">
      <Form {...form}>
        <div className="sm:w-[560px] flex justify-center items-center flex-col m-4 sm:m-0">
          <img src={logo} alt="logo" className="h-[64px]" />
          <h2 className="text-2xl font-bold tracking-tighter sm:text-4xl pt-2 sm:pt-4">
            註冊一個新帳號
          </h2>
          <p className="text-blue-500 text-lg md:text-xl font-poetsen">
            Empower your dreams, build our future
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
                    <Input
                      type="text"
                      className="dark:shad-input"
                      {...field}
                      // onChangeCapture={(e) => {
                      //   userExistHandler(e.currentTarget.value);
                      // }}
                    />
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
            <Button type="submit" className="shad-button_primary">
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
          <div className="flex justify-center items-center w-full mt-4">
            <Button className="flex-1 mr-2 shad-button_primary">Google</Button>
            <Button className="flex-1 mx-2 shad-button_primary">
              Facebook
            </Button>
            <Button className="flex-1 ml-2 shad-button_primary">X</Button>
          </div>
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
