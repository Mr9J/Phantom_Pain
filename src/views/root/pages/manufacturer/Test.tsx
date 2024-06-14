import React, { useState, useEffect } from "react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import FileUploader from "@/components/shared/FileUploader";
import { PostValidation } from "@/lib/validation";
import { useToast } from "@/components/ui/use-toast";
import { useUserContext } from "@/context/AuthContext";
import { ToastAction } from "@/components/ui/toast";
import { Button } from "@/components/ui/button";
import {
  useCreatePost,
  useDeletePost,
  useUpdatePost,
} from "@/lib/react-query/queriesAndMutation";

export type PostFormProps = {
  post?: {
    caption: string;
    file: File[];
    location: string;
    tags: string;
    imgUrl: string;
    postId: string;
  };
  action: "create" | "update";
};
const Test = ({ post, action }: PostFormProps) => {
  const { mutateAsync: createPost, isPending } = useCreatePost();
  const { mutateAsync: updatePost, isPending: isLoadingUpdate } =
    useUpdatePost();
  const { toast } = useToast();
  const { user } = useUserContext();

  const form = useForm<z.infer<typeof PostValidation>>({
    resolver: zodResolver(PostValidation),
    defaultValues: {
      caption: post ? post?.caption : "",
      file: [],
      location: post ? post?.location : "",
      tags: post ? post?.tags : "",
    },
  });

  useEffect(() => {
    if (post && action === "update") {
      console.log(post);
      form.reset({
        caption: post ? post?.caption : "",
        file: post ? post.file : [],
        location: post ? post?.location : "",
        tags: post ? post?.tags : "",
      });
    }
  }, [post]);

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof PostValidation>) {
    if (post && action === "update") {
      const session = await updatePost({
        ...values,
        userId: user.id,
        id: Date.now().toString() + user.id,
        postId: post.postId,
      });

      toast({
        title: "更新中...",
        description: "請稍後... ",
      });

      if (!session) {
        toast({
          variant: "destructive",
          title: "更新失敗, 請再試一次",
        });
      }

      toast({
        title: "發布成功",
        description: "您的貼文已經成功更新！",
        action: (
          <ToastAction
            altText="success"
            onClick={() => {
              navigate("/social");
            }}
          >
            查看
          </ToastAction>
        ),
      });

      return;
    }
  }
  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-9 w-full max-w-5xl"
        >
          <FormField
            control={form.control}
            name="file"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-3xl font-bold">新增圖片</FormLabel>
                <FormControl>
                  <FileUploader
                    fieldChange={field.onChange}
                    mediaUrl={post ? post.imgUrl : ""}
                  />
                </FormControl>
                <FormMessage className="shad-form_message" />
              </FormItem>
            )}
          />
        </form>
      </Form>
      <Button
        type="submit"
        className="shad-button_dark_4"
        disabled={isPending || isLoadingUpdate}
      >
        發布
      </Button>
      <Button
        type="button"
        className="shad-button_dark_4"
        onClick={() => {
          history.back();
        }}
        disabled={isPending || isLoadingUpdate}
      >
        取消
      </Button>
    </>
  );
};
export default Test;
