import Footer from "@/components/section/Footer";
import { Button } from "@/components/ui/button";
import { useUserContext } from "@/context/AuthContext";
import noThumbnail from "@/assets/admin_img/mygo/6.jpg";
import { useEffect, useState } from "react";
import { S3 } from "@/config/R2";
import { ListObjectsV2Command } from "@aws-sdk/client-s3";
import axios from "axios";

const Playground = () => {
  //isAuthenticated: 是否已經登入
  //user: 登入的使用者資料
  const { user, isAuthenticated, checkAuthUser } = useUserContext();
  const [isAuth, setIsAuth] = useState(true);

  //頁面載入時檢查使用者是否已經登入，如果只是要取得使用者資料，可以不用檢查
  //isAuth時時判斷是否已經登入
  //依需求使用navigate導向特定頁面，或是history.back()返回上一頁
  useEffect(() => {
    checkAuthUser().then((res) => {
      setIsAuth(res);
    });
  }, []);

  const getBucket = async () => {
    try {
      const res = await S3.send(
        new ListObjectsV2Command({
          Bucket: "mumu",
          Prefix: "Projects/project-00/",
        })
      );

      console.log(res);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <div className="w-full h-screen flex justify-center items-center flex-col">
        {/* 重新整理頁面的Button */}
        <Button
          onClick={() => {
            getBucket();
          }}
        >
          Reload
        </Button>
        <div className="flex justify-center items-center flex-col mt-6">
          <p className="text-3xl font-bold">
            {isAuthenticated ? "Authenticated" : "Not Authenticated"}
          </p>
          <p className="text-3xl font-bold">
            id : {user.id !== "" ? user.id : "None"}
          </p>
          <p className="text-3xl font-bold">
            username : {user.username !== "" ? user.username : "None"}
          </p>
          <p className="text-3xl font-bold">
            email : {user.email !== "" ? user.email : "None"}
          </p>
          <p className="text-3xl font-bold">
            nickname : {user.nickname !== "" ? user.nickname : "None"}
          </p>
          <p className="text-3xl font-bold">thumbnail :</p>
          <img
            src={user.thumbnail !== "" ? user.thumbnail : noThumbnail}
            alt="thumbnail"
            className="rounded-full h-20 w-20"
          />
        </div>
      </div>
      {/* 頁面設定100vh會有問題，可以加入Footer */}
      <Footer />
    </>
  );
};

export default Playground;
