import { ImageIcon } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { FileWithPath, useDropzone } from "react-dropzone";
import { useToast } from "../ui/use-toast";
import { useGetPostImg } from "@/lib/react-query/queriesAndMutation";
import GoogleImgAnalize from "@/config/GoogleImgAnalize";
import AzureImgAnalyze from "@/config/AzureImgAnalyze";
import axios from "axios";

type FileUploaderProps = {
  fieldChange: (FILES: File[]) => void;
  mediaUrl: string;
  isSingle: boolean;
  setImgValid: React.Dispatch<React.SetStateAction<boolean>>;
};

const FileUploader = ({
  fieldChange,
  mediaUrl,
  isSingle,
  setImgValid,
}: FileUploaderProps) => {
  const { toast } = useToast();
  const [file, setFile] = useState<File[]>([]);
  const [fileUrl, setFileUrl] = useState([mediaUrl]);
  const { data: media } = useGetPostImg(mediaUrl || "");
  const [base64Image, setBase64Image] = useState("");
  const getImage = async (imageUrl) => {
    const response = await axios.get(imageUrl, { responseType: "blob" });
    const image = await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result.split(",")[1]);
      reader.onerror = reject;
      reader.readAsDataURL(response.data);
    });

    setBase64Image(image);
  };

  const onDrop = useCallback(
    (acceptedFiles: FileWithPath[]) => {
      let totalSize = 0;
      acceptedFiles.forEach((file) => {
        totalSize += file.size; // 計算所有文件的總大小
      });

      if (totalSize > 100 * 1024 * 1024) {
        toast({
          variant: "destructive",
          title: "錯誤",
          description: "所有文件的總大小超過100MB",
        });
        return;
      }

      if (acceptedFiles.length > 1 && isSingle) {
        toast({
          variant: "destructive",
          title: "錯誤",
          description: "只能上傳一張圖片",
        });

        return;
      }

      const urls = acceptedFiles.map((file) => URL.createObjectURL(file));
      setFile(acceptedFiles);
      fieldChange(acceptedFiles);
      // setFileUrl(URL.createObjectURL(acceptedFiles[0]));
      setFileUrl(urls);
    },
    [file]
  );

  useEffect(() => {
    if (media) {
      const postUrl = media.map(
        (url) => "https://cdn.mumumsit158.com/" + url.Key
      );
      setFileUrl(postUrl);
    }
  }, [media]);

  useEffect(() => {
    if (fileUrl[0] !== "") {
      getImage(fileUrl[0]);
    }
  }, [fileUrl]);

  useEffect(() => {
    if (base64Image !== "") {
      AzureImgAnalyze(base64Image).then((res) => {
        setImgValid(res);
      });
    }
  }, [base64Image]);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".png", ".jpg", ".jpeg", ".svg"],
    },
    maxSize: 1024 * 1024 * 100,
  });

  return (
    <div
      {...getRootProps()}
      className="flex justify-center items-center flex-col rounded-xl cursor-pointer bg-gray-100 dark:bg-dark-3 py-4"
    >
      <input {...getInputProps()} className="cursor-pointer" />
      {fileUrl && fileUrl[0] !== "" ? (
        <>
          {fileUrl.length === 1 && fileUrl[0] !== "" ? (
            <>
              <div className="flex flex-1 justify-center w-full p-5 lg:p-10">
                <img
                  src={fileUrl[0]}
                  alt="image"
                  className="file_uploader-img rounded-lg"
                />
              </div>
              <p className="file_uploader-label">拖曳或點擊更換圖片</p>
            </>
          ) : (
            <>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 py-4">
                {fileUrl.map((url, index) => (
                  <img
                    key={index}
                    className="object-cover object-center w-full h-40 max-w-full rounded-lg"
                    src={url}
                    alt="gallery-photo"
                  />
                ))}
              </div>
              <p className="text-light-4 text-center text-[14px] font-normal leading-[140%] w-full p-4 border-t border-t-dark-4">
                拖曳或點擊更換圖片
              </p>
            </>
          )}
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
          <p className="p-4 bg-black text-white rounded-lg">選擇圖片</p>
        </div>
      )}
    </div>
  );
};

export default FileUploader;
