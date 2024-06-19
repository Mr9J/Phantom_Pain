import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import NotFound from "./NotFound";
import Progress from "@/components/explore/Progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TabDetail from "@/components/explore/TabDetail";
import TabComments from "@/components/explore/TabComments";
import Footer from "@/components/section/Footer";
import { useUserContext } from "@/context/AuthContext";
import { Heart } from "lucide-react";
import ProductCards from "@/components/explore/ProductCards";
import { typeProductCards } from "@/components/explore/types";
import TabQA from "@/components/explore/TabQA";

type ProjectInfoDto = {
  projectId: number;
  projectThumbnail: string;
  projectName: string;
  projectGoal: number;
  projectDescription: string;
  memberName: string;
  projectTotal: number;
  startDate: string;
  endDate: string;
  isLiked: boolean;
  products: typeProductCards;
  clicked: number;
};

function ProjectInfo() {
  const { isAuthenticated } = useUserContext();
  const { pid } = useParams();
  const URL = import.meta.env.VITE_API_URL;
  const [project, setProject] = useState<ProjectInfoDto>();
  const [isLiked, setIsLiked] = useState<boolean>();

  const getProjectInfo = async () => {
    try {
      const res = await axios.get(`${URL}/ProjectInfo/${pid}`, {
        headers: { Authorization: localStorage.getItem("token") },
      });
      if (res.status === 404) return <NotFound />;
      setProject(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getProjectInfo();

    // 使用者停留專案頁面5秒後，觸發事件
    setTimeout(async () => {
      try {
        await axios.patch(`${URL}/ProjectInfo/Click/${pid}`);
      } catch (error) {
        console.error(error);
      }
    }, 5000);
  }, []);

  useEffect(() => {
    if (project) setIsLiked(project.isLiked);
  }, [project]);

  if (!project) return <NotFound></NotFound>;
  const handleLikeClick = async () => {
    if (!isAuthenticated) return GotoLogIn();

    if (isLiked) {
      // 取消按讚
      // 資料庫刪除
      const res = await axios.delete(
        `${URL}/ProjectInfo/Like?projectId=${pid}`,
        {
          headers: { Authorization: localStorage.getItem("token") },
        }
      );
      console.log(res.data);
    } else {
      // 按讚
      const res = await axios.post(
        `${URL}/ProjectInfo/Like?projectId=${pid}`,
        {},
        {
          headers: { Authorization: localStorage.getItem("token") },
        }
      );
      console.log(res.data);
    }
    setIsLiked(!isLiked);
  };

  // 請先登入
  const GotoLogIn = () => alert("阿你要按讚要先登入阿");

  return (
    <>
      <div className="w-full pb-32">
        {/* 上半部 */}
        <div className="flex flex-wrap  justify-center py-4">
          {/* 圖片 */}
          <div className=" lg:w-7/12 lg:px-4">
            <img
              className="aspect-video w-full min-w-2xl"
              src={project.projectThumbnail}
              alt="Project Thumbnail"
            />
          </div>

          {/* 上右半 */}
          <div className="flex w-full flex-col justify-center px-4  lg:w-3/12">
            <div className="mt-4 text-xs lg:mt-0">
              {/* 提案人 */}
              <div className="text-sm text-gray-500">
                <span className="text-gray-500">提案人 </span>
                <a className="text-zec-green font-bold" href="#">
                  {project.memberName}
                </a>
              </div>
              {/* 專案名稱 */}
              <h1 className="my-4 text-lg font-bold leading-relaxed tracking-wide">
                {project.projectName}
              </h1>
              <p>點擊次數: {project.clicked}</p>
            </div>

            {/* 進度條 */}
            <Progress
              goal={project.projectGoal}
              value={project.projectTotal}
            ></Progress>
            <p className="my-4 text-sm leading-relaxed tracking-wider text-gray-500">
              {project.projectDescription}
            </p>

            {/* 分隔線以下(募資期間...) */}
            <div className="border-t pt-4 text-xs leading-relaxed text-gray-500">
              <h2 className="mr-1 inline-block text-xs text-gray-500">
                募資期間
              </h2>
              <h3 className="inline-block text-xs text-gray-500">
                {`${project.startDate} ~ ${project.endDate}`.replace(/-/g, "/")}
              </h3>
            </div>

            {/* 分享按鈕 */}
            <div className="mt-4 flex items-center">
              <a
                className="mr-4 inline-block rounded border border-gray-300 p-2 text-xs font-bold text-gray-500"
                target="_blank"
                data-click-event="contact_creator"
                href="/users/sign_in?return_to=%2Fmessages%2Fnew%3Fuser_id%3D2721388"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="48"
                  viewBox="0 96 960 960"
                  width="48"
                  className="inline-block h-4 w-4 fill-current text-gray-500"
                >
                  <path d="M240 657h313v-60H240v60Zm0-130h480v-60H240v60Zm0-130h480v-60H240v60ZM80 976V236q0-23 18-41.5t42-18.5h680q23 0 41.5 18.5T880 236v520q0 23-18.5 41.5T820 816H240L80 976Zm60-145 75-75h605V236H140v595Zm0-595v595-595Z"></path>
                </svg>
                傳送訊息
              </a>
              <a
                className="mr-4 inline-block font-bold"
                target="_blank"
                data-share-method="Facebook"
                href="https://www.facebook.com/sharer/sharer.php?u=https://www.zeczec.com/projects/pull-n-push-mv"
              >
                <img
                  width="32"
                  height="32"
                  className="inline-block"
                  src="/assets/icons/facebook_rounded-30829fbdff4d0685a91c0757858b173a5fc17d19.png"
                />
              </a>
              <a
                className="mr-4 inline-block font-bold"
                target="_blank"
                data-share-method="Twitter"
                href="https://www.twitter.com/share?text=嘖嘖 x 瑋瑋黃挺瑋首張創作專輯《Pull n’ Push》第二主打《男孩說》MV募資計畫&amp;url=https://www.zeczec.com/projects/pull-n-push-mv"
              >
                <img
                  width="32"
                  height="32"
                  className="inline-block"
                  src="/assets/icons/twitter_rounded-a768b8b1b56d675a53b14ba74225ddfe8e27db61.png"
                />
              </a>
              <a
                className="mr-4 inline-block font-bold"
                target="_blank"
                data-share-method="Line"
                href="https://social-plugins.line.me/lineit/share?url=https://www.zeczec.com/projects/pull-n-push-mv&amp;text=嘖嘖 x 瑋瑋黃挺瑋首張創作專輯《Pull n’ Push》第二主打《男孩說》MV募資計畫"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="24"
                  width="24"
                  viewBox="0 0 512 512"
                >
                  <path
                    fill="#63E6BE"
                    d="M311 196.8v81.3c0 2.1-1.6 3.7-3.7 3.7h-13c-1.3 0-2.4-.7-3-1.5l-37.3-50.3v48.2c0 2.1-1.6 3.7-3.7 3.7h-13c-2.1 0-3.7-1.6-3.7-3.7V196.9c0-2.1 1.6-3.7 3.7-3.7h12.9c1.1 0 2.4 .6 3 1.6l37.3 50.3V196.9c0-2.1 1.6-3.7 3.7-3.7h13c2.1-.1 3.8 1.6 3.8 3.5zm-93.7-3.7h-13c-2.1 0-3.7 1.6-3.7 3.7v81.3c0 2.1 1.6 3.7 3.7 3.7h13c2.1 0 3.7-1.6 3.7-3.7V196.8c0-1.9-1.6-3.7-3.7-3.7zm-31.4 68.1H150.3V196.8c0-2.1-1.6-3.7-3.7-3.7h-13c-2.1 0-3.7 1.6-3.7 3.7v81.3c0 1 .3 1.8 1 2.5c.7 .6 1.5 1 2.5 1h52.2c2.1 0 3.7-1.6 3.7-3.7v-13c0-1.9-1.6-3.7-3.5-3.7zm193.7-68.1H327.3c-1.9 0-3.7 1.6-3.7 3.7v81.3c0 1.9 1.6 3.7 3.7 3.7h52.2c2.1 0 3.7-1.6 3.7-3.7V265c0-2.1-1.6-3.7-3.7-3.7H344V247.7h35.5c2.1 0 3.7-1.6 3.7-3.7V230.9c0-2.1-1.6-3.7-3.7-3.7H344V213.5h35.5c2.1 0 3.7-1.6 3.7-3.7v-13c-.1-1.9-1.7-3.7-3.7-3.7zM512 93.4V419.4c-.1 51.2-42.1 92.7-93.4 92.6H92.6C41.4 511.9-.1 469.8 0 418.6V92.6C.1 41.4 42.2-.1 93.4 0H419.4c51.2 .1 92.7 42.1 92.6 93.4zM441.6 233.5c0-83.4-83.7-151.3-186.4-151.3s-186.4 67.9-186.4 151.3c0 74.7 66.3 137.4 155.9 149.3c21.8 4.7 19.3 12.7 14.4 42.1c-.8 4.7-3.8 18.4 16.1 10.1s107.3-63.2 146.5-108.2c27-29.7 39.9-59.8 39.9-93.1z"
                  />
                </svg>
              </a>

              <input
                className="hidden"
                contentEditable="true"
                id="share"
                readOnly
                type="text"
                value="https://www.zeczec.com/projects/pull-n-push-mv"
              />
              <button
                aria-label="複製網址"
                className="pointer tooltip tooltip-b"
                data-copy="#share"
                data-share-method="Copy"
                type="button"
              >
                <img
                  width="32"
                  height="32"
                  className="inline-block"
                  src="/assets/icons/copy_rounded-65e2454a99f71c1d40dcd1e488b05efdf9be33de.png"
                />
              </button>
            </div>

            {/* 收藏/贊助按鈕 */}
            <div className="px-4 py-3 text-center w-full flex  lg:static bottom-0 z-50 lg:z-0 fixed lg:px-0">
              <div
                className="p-2 inline-block cursor-pointer flex-initial mr-2 transition-transform hover:scale-105 focus:scale-105 active:scale-90 text-blue-900 border-2 border-current rounded tooltip tooltip-l"
                data-method="post"
                data-click-event="follow_project"
                aria-label="追蹤後會收到公開的專案更新和計畫結束提醒。"
                onClick={() => handleLikeClick()}
              >
                {isLiked ? <Heart fill="rgb(30 58 138)" /> : <Heart />}
              </div>
              <a
                className="js-back-project-now tracking-widest cursor-pointer flex-1 border-blue-100 align-middle bg-blue-300 inline-block w-full text-base transition-transform hover:scale-105 focus:scale-105 active:scale-90 rounded font-bold py-2 "
                data-click-event="list_options"
                href={`/productpage/${pid}`}
              >
                贊助專案
              </a>
            </div>
          </div>
        </div>

        {/* 下半部 */}
        <div className="w-full flex flex-wrap justify-center">
          <div className="w-full lg:w-7/12">
            <Tabs defaultValue="details" className="w-full">
              <TabsList className="w-full justify-around">
                <TabsTrigger value="details" className="w-full">
                  專案內容
                </TabsTrigger>
                <TabsTrigger value="qa" className="w-full">
                  常見問答
                </TabsTrigger>
                <TabsTrigger value="comments" className="w-full">
                  留言
                </TabsTrigger>
              </TabsList>
              <TabsContent value="details">
                <div className="p-4">
                  <h2 className="text-xl font-bold mb-2">專案內容</h2>
                  <TabDetail></TabDetail>
                </div>
              </TabsContent>
              <TabsContent value="qa">
                <div className="p-4">
                  <h2 className="text-xl font-bold mb-2">常見問答</h2>
                  <TabQA />
                </div>
              </TabsContent>
              <TabsContent value="comments" className="mx-4">
                <TabComments pid={Number.parseInt(pid ?? "100")}></TabComments>
              </TabsContent>
            </Tabs>
          </div>
          {/* 下右半 */}
          <div className="lg:w-3/12 lg:px-4">
            <ProductCards
              productsData={project.products}
              projectId={project.projectId}
            />
          </div>
        </div>
      </div>
      <Footer></Footer>
    </>
  );
}

export default ProjectInfo;
