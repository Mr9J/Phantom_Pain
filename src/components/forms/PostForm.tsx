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
import { useNavigate } from "react-router-dom";
import { ToastAction } from "../ui/toast";
import { useEffect, useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import GoogleAnalize from "@/config/GoogleAnalize";
import GoogleTranslate from "@/config/GoogleTranslate";
import { set } from "date-fns";

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
  const [validate, setValidate] = useState(false);
  const validation = async (text: string) => {
    const translatedText = await GoogleTranslate(text, "en");
    const result = await GoogleAnalize(translatedText);
  };

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
      form.reset({
        caption: post ? post?.caption : "",
        file: post ? post.file : [],
        location: post ? post?.location : "",
        tags: post ? post?.tags : "",
      });
    }
  }, [post]);

  const onSubmit = async (values: z.infer<typeof PostValidation>) => {
    if (post && action === "update") {
      toast({
        title: "更新中...",
        description: "請稍後... ",
      });

      await validation(values.caption);

      console.log(validate);

      if (!validate) {
        toast({
          variant: "destructive",
          title: "發布失敗",
          description: "內文不符合規定，請檢查內文是否合乎規範",
        });
        return;
      }

      const session = await updatePost({
        ...values,
        userId: user.id,
        id: post.imgUrl,
        postId: post.postId,
      });

      if (!session) {
        toast({
          variant: "destructive",
          title: "更新失敗, 請再試一次",
        });
        return;
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
      title: "更新中...",
      description: "請稍後... ",
    });

    await validation(values.caption);
    console.log(validate);

    if (!validate) {
      toast({
        variant: "destructive",
        title: "發布失敗",
        description: "內文不符合規定，請檢查內文是否合乎規範",
      });
      return;
    }

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
  };

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
                  className="text-lg custom-scrollbar dark:shad-textarea bg-gray-100 whitespace-pre-wrap"
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
                  isSingle={false}
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
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  type="button"
                  variant="destructive"
                  className="h-12 px-5 text-light-1 flex gap-2"
                  disabled={isDeletingPost || isLoadingUpdate || isPending}
                >
                  刪除
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>您確定要刪除該貼文嗎?</AlertDialogTitle>
                  <AlertDialogDescription>
                    這個動作無法還原。該貼文將永久從我們的資料庫中移除。
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>取消</AlertDialogCancel>
                  <AlertDialogAction onClick={deletePostHandler}>
                    確認
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
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
