import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";
import logo from "@/assets/_shared_img/logo.png";
import { useUserContext } from "@/context/AuthContext";
import {
  useChangeEmail,
  useResendEmail,
} from "@/lib/react-query/queriesAndMutation";
import { useToast } from "@/components/ui/use-toast";

const changeEmailValidation = z.object({
  email: z.string().email({ message: "Email格式錯誤" }),
});

const ReSendEmail = () => {
  const { user } = useUserContext();
  const { toast } = useToast();
  const { mutateAsync: changeEmail, isPending: isEmailChanging } =
    useChangeEmail();
  const { mutateAsync: resendEmail, isPending: isEmailResending } =
    useResendEmail();

  // 1. Define your form.
  const form = useForm<z.infer<typeof changeEmailValidation>>({
    resolver: zodResolver(changeEmailValidation),
    defaultValues: {
      email: "",
    },
  });

  // 2. Define a submit handler.
  const handleResendEmail = async (
    values: z.infer<typeof changeEmailValidation>
  ) => {
    const session = await changeEmail(values.email);

    if (!session) {
      toast({
        variant: "destructive",
        title: "錯誤",
        description: "伺服器錯誤，請稍後再試",
      });
      return;
    }

    toast({
      title: "成功",
      description: "驗證信已發送至您的信箱，請查收",
    });
  };

  const resendEmailHandler = async () => {
    const session = await resendEmail();

    if (!session) {
      toast({
        variant: "destructive",
        title: "錯誤",
        description: "伺服器錯誤，請稍後再試",
      });
      return;
    }

    toast({
      title: "成功",
      description: "驗證信已發送至您的信箱，請查收",
    });
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
            onSubmit={form.handleSubmit(handleResendEmail)}
            className="flex flex-col gap-5 w-full mt-4"
          >
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xl font-bold">
                    重寄驗證信
                  </FormLabel>
                  <FormControl>
                    <Input type="text" className="dark:shad-input" {...field} />
                  </FormControl>
                  <FormDescription>
                    您註冊時使用的電子郵件地址是 : {user.email}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              variant="destructive"
              disabled={isEmailResending || isEmailChanging}
            >
              變更Email
            </Button>
          </form>
          <Button
            className="mt-2 w-full shad-button_primary"
            disabled={isEmailResending || isEmailChanging}
            onClick={resendEmailHandler}
          >
            重寄驗證信
          </Button>
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

export default ReSendEmail;
