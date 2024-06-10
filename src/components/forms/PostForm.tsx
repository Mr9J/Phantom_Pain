import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
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
import { Textarea } from "../ui/textarea";
import FileUploader from "../shared/FileUploader";
import { PostValidation } from "@/lib/validation";
import {
  useCreatePost,
  useUpdatePost,
} from "@/lib/react-query/queriesAndMutation";
import { useUserContext } from "@/context/AuthContext";
import { useToast } from "../ui/use-toast";
import { Link } from "react-router-dom";
import { ToastAction } from "../ui/toast";
import { useEffect } from "react";

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

const PostForm = ({ post, action }: PostFormProps) => {
  const { mutateAsync: createPost, isPending } = useCreatePost();
  const { mutateAsync: updatePost, isPending: isLoadingUpdate } =
    useUpdatePost();
  const { user } = useUserContext();
  const { toast } = useToast();

  // 1. Define your form.
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

      console.log(values);

      if (!session) {
        toast({
          variant: "destructive",
          title: "更新失敗, 請再試一次",
        });
      }

      console.log(session);

      return;
    }

    toast({
      title: "發布中...",
    });

    const newPost = await createPost({
      ...values,
      userId: user.id,
      id: Date.now().toString() + user.id,
    });

    if (!newPost) {
      toast({
        variant: "destructive",
        title: "發布失敗, 請再試一次",
      });

      return;
    }

    toast({
      title: "發布成功",
      description: "您的貼文已經成功發布！",
      action: (
        <ToastAction altText="success">
          <Link to="/social">查看</Link>
        </ToastAction>
      ),
    });
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-9 w-full max-w-5xl"
      >
        <FormField
          control={form.control}
          name="caption"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-3xl font-bold">內文</FormLabel>
              <FormControl>
                <Textarea
                  className="text-lg custom-scrollbar dark:shad-textarea bg-gray-100"
                  {...field}
                />
              </FormControl>
              <FormMessage className="shad-form_message" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="file"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-3xl font-bold">新增圖片</FormLabel>
              <FormControl>
                <FileUploader
                  fieldChange={field.onChange}
                  mediaUrl={post?.imgUrl}
                />
              </FormControl>
              <FormMessage className="shad-form_message" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-3xl font-bold">新增欄位</FormLabel>
              <FormControl>
                <Input
                  type="text"
                  className="dark:shad-input bg-gray-100"
                  {...field}
                />
              </FormControl>
              <FormMessage className="shad-form_message" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="tags"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-3xl font-bold">
                新增標籤 (請用逗號區隔 ex: tag1, tag2, tag3)
              </FormLabel>
              <FormControl>
                <Input
                  type="text"
                  className="dark:shad-input bg-gray-100"
                  placeholder="藝術, 娛樂, 其他"
                  {...field}
                />
              </FormControl>
              <FormMessage className="shad-form_message" />
            </FormItem>
          )}
        />
        <div className="flex gap-4 items-center justify-end">
          <Button type="button" className="shad-button_dark_4">
            取消
          </Button>
          <Button
            type="submit"
            className="shad-button_dark_4"
            disabled={isPending || isLoadingUpdate}
          >
            發布
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default PostForm;
