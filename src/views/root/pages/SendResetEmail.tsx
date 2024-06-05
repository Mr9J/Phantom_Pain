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
import { SendResetEmailValidation } from "@/lib/validation";
import logo from "@/assets/_shared_img/logo.png";
import LoaderSvg from "@/components/shared/LoaderSvg";
import { useToast } from "@/components/ui/use-toast";
import { useSendResetEmail } from "@/lib/react-query/queriesAndMutation";

const SendResetEmail = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { mutateAsync: sendResetEmail, isPending } = useSendResetEmail();

  const form = useForm<z.infer<typeof SendResetEmailValidation>>({
    resolver: zodResolver(SendResetEmailValidation),
    defaultValues: {
      email: "",
    },
  });

  const handleSendEmail = async (
    values: z.infer<typeof SendResetEmailValidation>
  ) => {
    const session = await sendResetEmail(values.email);

    if (!session) {
      toast({ title: "Email不存在，請確認後再試一次" });
      return;
    }

    form.reset();
    window.alert("信件寄出，請至您的Email信箱確認重設密碼信件");
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
            onSubmit={form.handleSubmit(handleSendEmail)}
            className="flex flex-col gap-5 w-full mt-4"
          >
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xl font-bold">
                    註冊使用的Email
                  </FormLabel>
                  <FormControl>
                    <Input type="text" className="dark:shad-input" {...field} />
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
                <p className="text-lg font-bold">送出</p>
              )}
            </Button>
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

export default SendResetEmail;
