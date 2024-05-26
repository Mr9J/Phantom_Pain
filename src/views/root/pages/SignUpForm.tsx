import { useState } from "react";
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
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { SignUpValidation } from "@/lib/validation";
import logo from "@/assets/_shared_img/logo.jpg";
import LoaderSvg from "@/components/shared/LoaderSvg";
import { signUp, checkUserExist } from "@/services/auth.service";
import { INewUser } from "@/types";
import { useToast } from "@/components/ui/use-toast";

const SignUpForm = () => {
  const isLoading = false;
  const [errorMsg, setErrorMsg] = useState<string>("");
  const navigate = useNavigate();
  const { toast } = useToast();

  const userExistHandler = async (username: string) => {
    await checkUserExist(username)
      .then((res) => {
        if (res.status !== 200) {
          setErrorMsg(res.data);
        }
      })
      .catch((e) => {
        setErrorMsg(e.response.data);
      });
  };

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

  async function onSubmit(values: z.infer<typeof SignUpValidation>) {
    const { nickname, username, email, password } = values;
    const x: INewUser = { nickname, username, email, password };

    await signUp(x)
      .then(() => {
        window.alert("註冊成功，您將被導向登入頁面");
        navigate("/sign-in");
      })
      .catch((err) => {
        console.error(err);
        toast({
          title: "錯誤，請再試一次",
        });
      });
  }

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
          {errorMsg && (
            <Alert variant="destructive" className="my-2">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle className="dark:text-rose-500">錯誤</AlertTitle>
              <AlertDescription className="dark:text-rose-500">
                {errorMsg}
              </AlertDescription>
            </Alert>
          )}
          <form
            onSubmit={form.handleSubmit(onSubmit)}
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
                      onChangeCapture={(e) => {
                        userExistHandler(e.currentTarget.value);
                      }}
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
                      type="confirmPassword"
                      className="dark:shad-input"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="dark:text-rose-500" />
                </FormItem>
              )}
            />
            <Button type="submit" className="shad-button_primary">
              {isLoading ? (
                <div className="flex justify-center items-center">
                  <LoaderSvg />
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
