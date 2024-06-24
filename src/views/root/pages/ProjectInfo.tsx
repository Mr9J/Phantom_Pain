import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import NotFound from "./NotFound";
import Progress from "@/components/explore/Progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TabDetail from "@/components/explore/TabDetail";
import TabComments from "@/components/explore/TabComments";
import { useUserContext } from "@/context/AuthContext";
import { Heart, Share2 } from "lucide-react";
import ProductCards from "@/components/explore/ProductCards";
import { ProjectInfoDto } from "@/components/explore/types";
import TabQA from "@/components/explore/TabQA";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import ViewHistory from "@/components/ViewHistory";
import { Helmet } from "react-helmet-async";

function ProjectInfo() {
  const { isAuthenticated } = useUserContext();
  const { pid } = useParams();
  const URL = import.meta.env.VITE_API_URL;
  const [project, setProject] = useState<ProjectInfoDto>();
  const [isLiked, setIsLiked] = useState<boolean>();
  const { toast } = useToast();

  const getProjectInfo = async () => {
    try {
      const res = await axios.get(`${URL}/ProjectInfo/${pid}`, {
        headers: { Authorization: localStorage.getItem("token") },
      });
      if (res.status === 404) return <NotFound />;
      console.log(res.data);
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
      <Helmet>
        <title>{project.projectName}</title>
      </Helmet>
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
                <a
                  className="text-zec-green font-bold"
                  href={`/users/${project.member.memberId}`}
                >
                  {project.member.username}
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
              sponsorCount={project.sponsorCount}
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
              <Button
                variant="secondary"
                className="mr-4 rounded border border-gray-300 p-2 text-xs font-bold "
                onClick={() =>
                  window.open(
                    `https://twitter.com/share?text=${project.projectName}&url=${location.href}`,
                    "_blank"
                  )
                }
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  version="1.1"
                  id="Layer_1"
                  width="24px"
                  height="24px"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  enableBackground={"new 0 0 24 24"}
                  className="mr-1"
                >
                  <g>
                    <path d="M21.159809,2C21.623091,2,22,2.376909,22,2.840191v18.319618C22,21.623091,21.623091,22,21.159809,22H2.84019   C2.37691,22,2,21.623091,2,21.159809V2.840191C2,2.376909,2.37691,2,2.84019,2H21.159809 M21.159809,1H2.84019   C1.82388,1,1,1.823879,1,2.840191v18.319618C1,22.176121,1.82388,23,2.84019,23h18.319618C22.176121,23,23,22.176121,23,21.159809   V2.840191C23,1.823879,22.176121,1,21.159809,1L21.159809,1z" />
                  </g>
                  <path d="M13.523985,10.775623L19.480984,4h-1.41143l-5.174801,5.88195L8.764665,4H4l6.246901,8.895341L4,20h1.411431  l5.461361-6.21299L15.235336,20H20L13.523985,10.775623z M11.590199,12.973429l-0.633908-0.886331L5.920428,5.041171h2.168246  l4.065295,5.6884l0.631236,0.886331l5.283681,7.39365H15.90064L11.590199,12.973429z" />
                </svg>
                分享到 X
              </Button>
              <Button
                variant="secondary"
                className="mr-4 rounded border border-gray-300 p-2 text-xs font-bold "
                onClick={() =>
                  window.open(
                    `https://social-plugins.line.me/lineit/share?url=${location.href}&text=${project.projectName}`,
                    "_blank"
                  )
                }
              >
                <svg
                  enableBackground="new 0 0 24 24"
                  height="24px"
                  id="Layer_1"
                  version="1.1"
                  viewBox="0 0 24 24"
                  width="24px"
                  stroke="currentColor"
                  xmlns="http://www.w3.org/2000/svg"
                  className="mr-1"
                >
                  <g>
                    <g>
                      <path d="M19.7,23.5H4.3c-2.1,0-3.8-1.7-3.8-3.8V4.3c0-2.1,1.7-3.8,3.8-3.8h15.3c2.1,0,3.8,1.7,3.8,3.8v15.3    C23.5,21.8,21.8,23.5,19.7,23.5z M4.3,1.5c-1.6,0-2.8,1.3-2.8,2.8v15.3c0,1.6,1.3,2.8,2.8,2.8h15.3c1.6,0,2.8-1.3,2.8-2.8V4.3    c0-1.6-1.3-2.8-2.8-2.8H4.3z" />
                    </g>
                    <g>
                      <g>
                        <g>
                          <path d="M12,22.4c-0.1,0-0.2,0-0.2-0.1c-0.2-0.1-0.3-0.3-0.3-0.4V20c-5.2-0.2-9.4-3.9-9.4-8.3c0-4.6,4.5-8.3,9.9-8.3      c5.5,0,9.9,3.7,9.9,8.3c0,2.6-1.4,4.9-3.8,6.5l-5.9,4.1C12.2,22.4,12.1,22.4,12,22.4z M12,4.4c-4.9,0-8.9,3.3-8.9,7.3      S7.1,19,12,19c0.3,0,0.5,0.2,0.5,0.5v1.4l5.1-3.5c2.1-1.4,3.3-3.5,3.3-5.7C20.9,7.7,16.9,4.4,12,4.4z" />
                        </g>
                      </g>
                      <g>
                        <g>
                          <path d="M8.4,14.6h-2c-0.3,0-0.5-0.2-0.5-0.5V9.5C6,9.2,6.2,9,6.5,9S7,9.2,7,9.5v4.1h1.5c0.3,0,0.5,0.2,0.5,0.5      S8.7,14.6,8.4,14.6z" />
                        </g>
                        <g>
                          <path d="M10.2,14.6c-0.3,0-0.5-0.2-0.5-0.5V9.5C9.7,9.2,9.9,9,10.2,9s0.5,0.2,0.5,0.5v4.6C10.7,14.4,10.4,14.6,10.2,14.6z" />
                        </g>
                        <g>
                          <path d="M13.8,14.6c-0.3,0-0.5-0.2-0.5-0.5V9.5c0-0.3,0.2-0.5,0.5-0.5s0.5,0.2,0.5,0.5v4.6C14.3,14.4,14.1,14.6,13.8,14.6z" />
                        </g>
                        <g>
                          <path d="M11.8,14.6c-0.3,0-0.5-0.2-0.5-0.5V9.5c0-0.3,0.2-0.5,0.5-0.5s0.5,0.2,0.5,0.5v4.6C12.3,14.4,12.1,14.6,11.8,14.6z" />
                        </g>
                        <g>
                          <path d="M13.8,14.6c-0.2,0-0.4-0.1-0.5-0.3l-2-4.6c-0.1-0.3,0-0.5,0.3-0.7c0.3-0.1,0.5,0,0.7,0.3l2,4.6c0.1,0.3,0,0.5-0.3,0.7      C13.9,14.6,13.9,14.6,13.8,14.6z" />
                        </g>
                        <g>
                          <path d="M17.5,14.6h-2c-0.3,0-0.5-0.2-0.5-0.5V9.5c0-0.3,0.2-0.5,0.5-0.5h2C17.8,9,18,9.2,18,9.5S17.8,10,17.5,10h-1.5v3.6h1.5      c0.3,0,0.5,0.2,0.5,0.5S17.8,14.6,17.5,14.6z" />
                        </g>
                        <g>
                          <path d="M17.5,12.3h-2c-0.3,0-0.5-0.2-0.5-0.5s0.2-0.5,0.5-0.5h2c0.3,0,0.5,0.2,0.5,0.5S17.8,12.3,17.5,12.3z" />
                        </g>
                      </g>
                    </g>
                  </g>
                </svg>
                分享到 LINE
              </Button>
              <Button
                variant="secondary"
                className="mr-4 rounded border border-gray-300 p-2 text-xs font-bold"
                onClick={() => {
                  navigator.clipboard.writeText(location.href);
                  toast({
                    variant: "info",
                    description: "連結已複製到📋剪貼簿",
                  });
                }}
              >
                <Share2 size={20} className="mr-1" />
                複製連結
              </Button>
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
                  <TabDetail detailContents={project.projectDetail}></TabDetail>
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
      <div className="w-10/12 mx-auto text-2xl font-bold">
        最近瀏覽項目<ViewHistory></ViewHistory>
      </div>
    </>
  );
}

export default ProjectInfo;
