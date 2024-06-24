import { ImageIcon } from "lucide-react";
import { useCallback, useState } from "react";
import { FileWithPath, useDropzone } from "react-dropzone";
import { Button } from "../ui/button";
import { useToast } from "../ui/use-toast";

type FileUploaderProps = {
  fieldChange: (FILES: File[]) => void;
  mediaUrl: string;
  isSingle: boolean;
};

const FileUploader = ({
  fieldChange,
  mediaUrl,
  isSingle,
}: FileUploaderProps) => {
  const { toast } = useToast();
  const [file, setFile] = useState<File[]>([]);
  const [fileUrl, setFileUrl] = useState(mediaUrl);

  const onDrop = useCallback(
    (acceptedFiles: FileWithPath[]) => {
      if (acceptedFiles.length > 1 && isSingle) {
        toast({
          variant: "destructive",
          title: "錯誤",
          description: "只能上傳一張圖片",
        });

        return;
      }

      setFile(acceptedFiles);
      fieldChange(acceptedFiles);
      setFileUrl(URL.createObjectURL(acceptedFiles[0]));
    },
    [file]
  );

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".png", ".jpg", ".jpeg", ".svg"],
    },
  });

  return (
    <div
      {...getRootProps()}
      className="flex justify-center items-center flex-col rounded-xl cursor-pointer bg-gray-100 dark:bg-dark-3"
    >
      <input {...getInputProps()} className="cursor-pointer" />
      {fileUrl ? (
        <>
          <div className="flex flex-1 justify-center w-full p-5 lg:p-10">
            <img
              src={fileUrl}
              alt="image"
              className="h-80 lg:h-[480px] w-full rounded-[24px] object-cover object-top"
            />
          </div>
          <p className="text-light-4 text-center text-[14px] font-normal leading-[140%] w-full p-4 border-t border-t-dark-4">
            拖曳或點擊更換圖片
          </p>
        </>
      ) : (
        <div className="flex justify-center items-center flex-col p-7 h-80 lg:h-[612px]">
          <ImageIcon width={96} height={77} />
          <h3 className="text-[16px] font-medium leading-[140%] mb-2 mt-6">
            拖曳圖片至此
          </h3>
          <p className="text-[14px] font-normal leading-[140%] mb-6">
            SVG, PNG, JPG
          </p>
          <Button className="shad-button_dark_4">選擇圖片</Button>
        </div>
      )}
    </div>
  );
};

export default FileUploader;
