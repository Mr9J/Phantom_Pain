import "@/styles/profileSide.css";
import { Link } from "react-router-dom";
import logo from "@/assets/_shared_img/logo.png";
import { Dna } from "lucide-react";
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
import { useToast } from "@/components/ui/use-toast";
import {
  ProfileEditPValidation,
  ProfileEditValidation,
} from "@/lib/validation";
import { useUserContext } from "@/context/AuthContext";
import {
  useGetMemberProfile,
  useUpdataUserProfile,
} from "@/lib/react-query/queriesAndMutation";
import { useEffect, useState } from "react";
import FileUploader from "../shared/FileUploader";
import { Textarea } from "../ui/textarea";
import street from "@/assets/_shared_img/street.jpg";

const PostProfileEditP = ({ id }: { id: string }) => {
  const { toast } = useToast();
  const [isCheck, setIsCheck] = useState(false);
  const { user } = useUserContext();
  const { mutateAsync: updateMemberProfile, isPending: isUpdateLoading } =
    useUpdataUserProfile();
  const { data: member, isPending: isMemberLoading } = useGetMemberProfile(
    id || ""
  );

  const form = useForm<z.infer<typeof ProfileEditPValidation>>({
    resolver: zodResolver(ProfileEditPValidation),
    defaultValues: {
      nickname: "",
      username: "",
      thumbnail: [],
      email: "",
      password: "",
      confirmPassword: "",
      address: "",
      memberIntroduction: "",
      phone: "",
    },
  });

  const handleProfileEdit = async (
    data: z.infer<typeof ProfileEditPValidation>
  ) => {
    if (!isCheck) {
      toast({
        title: "請同意服務條款與隱私政策",
      });
      return;
    }

    const session = await updateMemberProfile({
      id: Number(user?.id),
      nickname: data.nickname,
      username: data.username,
      thumbnail: data.thumbnail,
      email: data.email,
      password: data.password,
      confirmPassword: data.confirmPassword,
      address: data.address,
      memberIntroduction: data.memberIntroduction,
      phone: data.phone,
    });

    if (!session) {
      toast({
        variant: "destructive",
        title: "更新失敗",
        description: "請再試一次",
      });
      return;
    }

    toast({
      title: "更新成功",
      description: "您的個人資料已經成功更新！",
    });
  };

  useEffect(() => {
    if (member) {
      console.log(member);
      form.reset({
        nickname: member ? member?.nickname : "",
        username: member ? member?.username : "",
        email: member ? member?.email : "",
        address: member ? member?.address : "",
        memberIntroduction: member ? member?.memberIntroduction : "",
        phone: member ? member?.phone : "",
      });
    }
  }, [member]);

  return (
    <section className="">
      <div className="lg:grid lg:min-h-screen lg:grid-cols-12">
        <section className="relative flex h-32 items-end bg-gray-900 lg:col-span-5 lg:h-full xl:col-span-6">
          <img
            src={street}
            alt="street"
            className="absolute inset-0 h-full w-full object-cover opacity-80"
          />
          {/* <div className="container_profile_side absolute inset-0 h-full w-full object-cover opacity-80"></div> */}
          <div className="hidden lg:fixed top-4 lg:block lg:p-12">
            <Link className="block text-white" to="/">
              <span className="sr-only">Home</span>
              <img src={logo} alt="logo" className="h-8 sm:h-10" />
            </Link>

            <h2 className="mt-6 text-2xl font-bold text-white sm:text-3xl md:text-4xl">
              Welcome to Mumu
            </h2>

            <p className="mt-4 leading-relaxed text-white/90 font-bold">
              您可以在這裡分享您的生活點滴，與朋友們一起交流。
            </p>
          </div>
        </section>

        <main className="flex items-center justify-center px-8 py-8 sm:px-12 lg:col-span-7 lg:px-16 lg:py-12 xl:col-span-6">
          <div className="max-w-xl lg:max-w-3xl">
            <div className="relative -mt-16 block lg:hidden">
              <Link
                className="inline-flex size-16 items-center justify-center rounded-full bg-white text-blue-600 sm:size-20"
                to="/"
              >
                <span className="sr-only">Home</span>
                <Dna className="h-8 sm:h-10" />
              </Link>

              <h1 className="mt-2 text-2xl font-bold sm:text-3xl md:text-4xl">
                Welcome to Mumu
              </h1>

              <p className="mt-4 leading-relaxed">
                您可以在這裡分享您的生活點滴，與朋友們一起交流。
              </p>
            </div>

            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(handleProfileEdit)}
                className="mt-8 grid grid-cols-6 gap-6"
              >
                <div className="col-span-6">
                  <FormField
                    control={form.control}
                    name="nickname"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="block text-sm font-medium">
                          暱稱
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="text"
                            className="mt-1 w-full rounded-md border-gray-200 bg-white text-sm text-gray-700 shadow-sm"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="col-span-6">
                  <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="block text-sm font-medium">
                          帳號
                        </FormLabel>
                        <FormControl>
                          <Input
                            disabled
                            type="text"
                            className="mt-1 w-full rounded-md border-gray-200 bg-white text-sm text-gray-700 shadow-sm"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="col-span-6">
                  <FormField
                    control={form.control}
                    name="thumbnail"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="block text-sm font-medium">
                          頭像 (留空則不變)
                        </FormLabel>
                        <FormControl>
                          <FileUploader
                            fieldChange={field.onChange}
                            mediaUrl={member ? member?.thumbnail : ""}
                            isSingle={true}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="col-span-6">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="block text-sm font-medium">
                          Email{" "}
                          {member?.isVerified === "N"
                            ? "(驗證完成)"
                            : "(尚未驗證)"}
                        </FormLabel>
                        <FormControl>
                          <Input
                            disabled
                            type="email"
                            className="mt-1 w-full rounded-md border-gray-200 bg-white text-sm text-gray-700 shadow-sm"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="col-span-6 sm:col-span-3">
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="block text-sm font-medium">
                          密碼 (留空則不變)
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="password"
                            className="mt-1 w-full rounded-md border-gray-200 bg-white text-sm text-gray-700 shadow-sm"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="col-span-6 sm:col-span-3">
                  <FormField
                    control={form.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="block text-sm font-medium">
                          確認密碼
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="password"
                            className="mt-1 w-full rounded-md border-gray-200 bg-white text-sm text-gray-700 shadow-sm"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="col-span-6">
                  <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="block text-sm font-medium">
                          地址
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="text"
                            className="mt-1 w-full rounded-md border-gray-200 bg-white text-sm text-gray-700 shadow-sm"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="col-span-6">
                  <FormField
                    control={form.control}
                    name="memberIntroduction"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="block text-sm font-medium">
                          會員介紹
                        </FormLabel>
                        <FormControl>
                          <Textarea
                            className="custom-scrollbar mt-1 w-full rounded-md border-gray-200 bg-white text-sm text-gray-700 shadow-sm"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="col-span-6">
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="block text-sm font-medium">
                          連絡電話
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="tel"
                            className="mt-1 w-full rounded-md border-gray-200 bg-white text-sm text-gray-700 shadow-sm"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="col-span-6">
                  <label htmlFor="MarketingAccept" className="flex gap-4">
                    <input
                      type="checkbox"
                      id="MarketingAccept"
                      name="marketing_accept"
                      className="size-5 rounded-md border-gray-200 bg-white shadow-sm"
                      onChange={(e) => setIsCheck(e.target.checked)}
                    />

                    <span className="text-sm text-gray-700">
                      我同意 Mumu 的服務條款與隱私政策
                    </span>
                  </label>
                </div>
                <div className="col-span-6">
                  <p className="text-sm text-gray-500">
                    By continuing, you agree to our
                    <a href="#" className="text-gray-700 underline">
                      {" "}
                      Terms and Conditions{" "}
                    </a>
                    and
                    <a href="#" className="text-gray-700 underline">
                      {" "}
                      Privacy Policy
                    </a>
                    .
                  </p>
                </div>
                <div className="col-span-6 sm:flex sm:items-center sm:gap-4">
                  <button className="inline-block shrink-0 rounded-md border border-blue-600 bg-blue-600 px-12 py-3 text-sm font-medium text-white transition hover:bg-transparent hover:text-blue-600 focus:outline-none focus:ring active:text-blue-500">
                    送出
                  </button>
                </div>
              </form>
            </Form>
          </div>
        </main>
      </div>
    </section>
  );
};

export default PostProfileEditP;
