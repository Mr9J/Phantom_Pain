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
  useDeletePost,
  useUpdatePost,
} from "@/lib/react-query/queriesAndMutation";
import { useUserContext } from "@/context/AuthContext";
import { useToast } from "../ui/use-toast";
import { Link, useNavigate } from "react-router-dom";
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
  const { mutateAsync: deletePost, isPending: isDeletingPost } =
    useDeletePost();
  const { user } = useUserContext();
  const { toast } = useToast();
  const navigate = useNavigate();

  const deletePostHandler = async () => {
    if (post && action === "update") {
      const session = await deletePost(post?.postId);

      if (session === "找不到該貼文或權限不足") {
        toast({
          variant: "destructive",
          title: "錯誤",
          description: "找不到該貼文或權限不足",
        });

        return;
      }

      if (!session) {
        toast({
          variant: "destructive",
          title: "錯誤",
          description: "刪除失敗，請再試一次。",
        });

        return;
      }

      toast({
        title: "刪除成功",
        description: "您的貼文已經成功刪除！",
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
    }
  };

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
                  mediaUrl={post ? post.imgUrl : ""}
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
          {action === "update" && (
            <Button
              type="button"
              variant="destructive"
              className="h-12 px-5 text-light-1 flex gap-2"
              onClick={deletePostHandler}
              disabled={isDeletingPost || isLoadingUpdate || isPending}
            >
              刪除
            </Button>
          )}

          <Button
            type="button"
            className="shad-button_dark_4"
            onClick={() => {
              history.back();
            }}
            disabled={isPending || isLoadingUpdate || isDeletingPost}
          >
            取消
          </Button>
          <Button
            type="submit"
            className="shad-button_dark_4"
            disabled={isPending || isLoadingUpdate || isDeletingPost}
          >
            發布
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default PostForm;
