import React, { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { useUserContext } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import FileUploader from "@/components/shared/FileUploader";
import { usePostImage } from "@/lib/react-query/queriesAndMutation";

export type PostFormProps = {
  post?: {
    file: File[];
    projectId: string;
    productId: string;
    imgUrl: string;
  };
  action: "create" | "update";
};

const Test = ({ post, action }: PostFormProps) => {
  const { toast } = useToast();
  //const { user } = useUserContext();
  const [file, setFile] = useState<File | null>(null);
  const [projectFile, setProjectFile] = useState<File | null>(null);
  const [productFile, setProductFile] = useState<File | null>(null);
  const { mutateAsync: postImage, isPending } = usePostImage();

  const uploadFileHandler = async (mode: "project" | "product") => {
    if (!projectFile && !productFile) {
      toast({
        variant: "destructive",
        title: "錯誤",
        description: "請選擇一張圖片。",
      });
      return;
    }
    try {
      let session;
      if (mode === "project") {
        session = await postImage({
          //userId: user.id,
          file: [file],
          projectId: "X",
          productId: "",
        });
      } else if (mode === "product") {
        session = await postImage({
          //userId: user.id,
          file: [file],
          projectId: "X1",
          productId: "Y",
        });
      }

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
    <>
      <p>Project</p>
      <div className="flex flex-col items-center gap-4">
        <FileUploader
          fieldChange={(files) => {
            if (files && files.length > 0) {
              setProjectFile(files[0]);
            }
          }}
          mediaUrl={post ? post.imgUrl : ""}
        />
      </div>
      <hr />
      <p>Product</p>
      <div className="flex flex-col items-center gap-4">
        <FileUploader
          fieldChange={(files) => {
            if (files && files.length > 0) {
              setProductFile(files[0]);
            }
          }}
          mediaUrl={post ? post.imgUrl : ""}
        />
        <Button
          onClick={() => {
            if (projectFile) {
              uploadFileHandler("project");
            }
            if (productFile) {
              uploadFileHandler("product");
            }
          }}
          disabled={(!projectFile && !productFile) || isPending}
        >
          {isPending ? "上傳中..." : "上傳圖片"}
        </Button>
      </div>
    </>
  );
};

export default Test;
