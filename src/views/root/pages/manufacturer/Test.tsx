import React, { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { useUserContext } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import FileUploader from "@/components/shared/FileUploader";
import { useCreatePostPY } from "@/lib/react-query/queriesAndMutation";

export type PostFormProps = {
  post?: {
    caption: string;
    file: File[];
    location: string;
    tags: string;
    userId: number;
  };
  action: "create" | "update";
};

const Test = ({ post, action }: PostFormProps) => {
  const { toast } = useToast();
  const { user } = useUserContext();
  const [file, setFile] = useState<File | null>(null);
  const { mutateAsync: createPostPY, isPending } = useCreatePostPY();

  const uploadFileHandler = async () => {
    if (!file) {
      toast({
        variant: "destructive",
        title: "錯誤",
        description: "請選擇一張圖片。",
      });
      return;
    }

    try {
      const session = await createPostPY({
        caption: post?.caption || "123",
        location: post?.location || "123",
        userId: user.id,
        file: [file],
        tags: post?.tags || "123",
        id: "",
      });

      if (!session) {
        toast({
          variant: "destructive",
          title: "錯誤",
          description: "伺服器錯誤，請稍後再試。",
        });
        return;
      }

      toast({
        title: "上傳成功",
        description: "您的圖片已經成功上傳！",
      });
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "錯誤",
        description: "伺服器錯誤，請稍後再試。",
      });
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <FileUploader
        fieldChange={(files) => {
          if (files && files.length > 0) {
            setFile(files[0]);
          }
        }}
        mediaUrl={post ? post.imgUrl : ""}
      />
      <Button onClick={uploadFileHandler} disabled={!file || isPending}>
        {isPending ? "上傳中..." : "上傳圖片"}
      </Button>
    </div>
  );
};

export default Test;
