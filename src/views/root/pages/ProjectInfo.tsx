import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import NotFound from "./NotFound";
import Progress from "@/components/explore/Progress";
import ProjectToolBar from "@/components/explore/ProjectToolBar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

function ProjectInfo() {
  const { pid } = useParams();
  const URL = import.meta.env.VITE_API_URL;
  const [project, setProject] = useState<{
    projectThumbnail: string;
    projectName: string;
    projectGoal: number;
    projectDescription: string;
  } | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await axios.get(`${URL}/project/${pid}`);
        setProject(res.data);
      } catch (error) {
        console.error(error);
      }
    })();
  }, [URL, pid]);

  if (!project) return <NotFound></NotFound>;
  console.log(project);

  return (
    <>
      <div className="w-full pb-32">
        <div className="flex flex-wrap lg:-mx-4 justify-center py-4">
          {/* 圖片 */}
          <div className=" lg:w-7/12 lg:px-4">
            {project && (
              <img
                className="aspect-video w-full min-w-2xl"
                src={project.projectThumbnail}
                alt="Project Thumbnail"
              />
            )}
          </div>

          {/* 簡介 */}
          <div className="flex w-full flex-col justify-center px-4  lg:w-3/12">
            <div className="mt-4 text-xs lg:mt-0">
              {/* 提案人 */}
              <div className="text-sm text-gray-500">
                <span className="text-gray-500">提案人 </span>
                <a
                  className="text-zec-green font-bold"
                  href="/users/2721388?tab=projects"
                ></a>
              </div>
              {/* 專案名稱 */}
              <h1 className="my-4 text-lg font-bold leading-relaxed tracking-wide">
                {project && project.projectName}
              </h1>
            </div>

            {/* 進度條 */}
            <Progress goal={project.projectGoal} value={1234}></Progress>
            <p className="my-4 text-sm leading-relaxed tracking-wider text-gray-500">
              {project.projectDescription}
            </p>

            {/* 分隔線以下(募資期間...) */}
            <div className="border-t pt-4 text-xs leading-relaxed text-gray-500">
              <h2 className="mr-1 inline-block text-xs text-gray-500">
                募資期間
              </h2>
              <h3 className="inline-block text-xs text-gray-500">
                2023/10/08 12:00 – 2023/12/01 01:59
              </h3>
            </div>

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
          </div>
        </div>
        <ProjectToolBar></ProjectToolBar>

        {/* 下半部 */}
        <div className="w-full lg:-mx-4 flex justify-center">
          <div className="lg:w-7/12 lg:px-4">
            <Tabs defaultValue="details" className="w-[400px]">
              <TabsList>
                <TabsTrigger value="details">專案內容</TabsTrigger>
                <TabsTrigger value="qa">常見問答</TabsTrigger>
                <TabsTrigger value="comments">留言</TabsTrigger>
              </TabsList>
              <TabsContent value="details">放專案內容</TabsContent>
              <TabsContent value="qa">放 Q&A</TabsContent>
              <TabsContent value="comments">放留言</TabsContent>
            </Tabs>
          </div>
          <div className="lg:w-3/12 lg:px-4">放商品卡片</div>
        </div>
      </div>
    </>
  );
}

export default ProjectInfo;
