import { Link } from "react-router-dom";
import { Skeleton } from "../ui/skeleton";
import moment from "moment";
import { UserProfile } from "@/types";
import avatar from "@/assets/admin_img/mygo/6.jpg";
import cloud from "@/assets/_shared_img/cloud.jpg";
import { PenBoxIcon } from "lucide-react";
import { Button } from "../ui/button";
import { useUserContext } from "@/context/AuthContext";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import FileUploader from "../shared/FileUploader";
import { useUpdateBanner } from "@/lib/react-query/queriesAndMutation";
import { useState } from "react";
import { useToast } from "../ui/use-toast";

type ProfileMainProps = {
  user?: UserProfile;
  isLoading: boolean;
  refetch: (
    options?: RefetchOptions | undefined
  ) => Promise<QueryObserverResult<any, Error>>;
};

const ProfileMain = ({ user, isLoading, refetch }: ProfileMainProps) => {
  const { user: currentUser } = useUserContext();
  const { mutateAsync: updateBanner } = useUpdateBanner();
  const [data, setData] = useState<File[]>([]);
  const { toast } = useToast();

  return (
    <section className="">
      <div className="container px-5 py-12 mx-auto flex flex-col">
        <div className="lg:w-4/6 mx-auto">
          <div className="rounded-lg h-64 overflow-hidden">
            {/* 新增封面圖 */}
            {Number(currentUser?.id) === user?.id && (
              <Drawer>
                <DrawerTrigger>
                  <PenBoxIcon
                    stroke="blue"
                    width={24}
                    height={24}
                    className="absolute bg-white cursor-pointer rounded-lg"
                  />
                </DrawerTrigger>
                <DrawerContent>
                  <div className="mx-auto w-full px-6">
                    <DrawerHeader>
                      <DrawerTitle>封面圖片</DrawerTitle>
                    </DrawerHeader>
                    <FileUploader
                      fieldChange={(e) => {
                        setData(e);
                      }}
                      mediaUrl={
                        user?.banner
                          ? user?.banner
                          : "https://plus.unsplash.com/premium_photo-1679758630055-99ebb2df7d77?q=80&w=1932&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                      }
                      isSingle={true}
                    />
                    <DrawerFooter>
                      <Button
                        onClick={async () => {
                          const session = await updateBanner({
                            file: data,
                            userId: currentUser?.id || "",
                          });

                          if (!session) {
                            toast({
                              variant: "destructive",
                              title: "錯誤",
                              description: "更新失敗，請再試一次。",
                            });

                            return;
                          }

                          toast({
                            title: "成功",
                            description: "更新成功。",
                          });

                          refetch();
                        }}
                      >
                        Submit
                      </Button>
                      <DrawerClose>
                        <Button variant="outline">Cancel</Button>
                      </DrawerClose>
                    </DrawerFooter>
                  </div>
                </DrawerContent>
              </Drawer>
            )}

            {isLoading ? (
              <Skeleton className="object-cover object-center h-full w-full" />
            ) : (
              <img
                alt="content"
                className="object-cover object-center h-full w-full"
                src={
                  user?.banner ||
                  "https://plus.unsplash.com/premium_photo-1679758630055-99ebb2df7d77?q=80&w=1932&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                }
              />
            )}
          </div>
          <div className="flex flex-col sm:flex-row mt-10">
            <div className="sm:w-1/3 text-center sm:pr-8 sm:py-8">
              <div className="w-48 h-48 rounded-full inline-flex items-center justify-center bg-gray-200 text-gray-400">
                {isLoading ? (
                  <svg
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    className="w-10 h-10"
                    viewBox="0 0 24 24"
                  >
                    <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                  </svg>
                ) : (
                  <img
                    src={user?.avatar || avatar}
                    alt="userData.avatar"
                    className="w-48 h-48 object-contain rounded-full"
                  />
                )}
              </div>
              <div className="flex flex-col items-center text-center justify-center">
                <h2 className="font-medium title-font mt-4 text-gray-900 dark:text-indigo-400 text-lg">
                  {user?.nickname || "尚未有暱稱"}
                </h2>
                <div className="w-12 h-1 bg-indigo-500 rounded mt-2 mb-4"></div>
                <p className="text-base dark:text-indigo-50">
                  {user?.description || "尚未有自我介紹"}
                </p>
                <p className="text-blue-500 mt-2">
                  joined :<span> </span>
                  {moment.utc(user?.time, "YYYY-MM-DD HH:mm:ss").fromNow()}
                </p>

                {Number(currentUser?.id) === user?.id && (
                  <Button variant="ghost">
                    <Link to={`/profile/${user?.id}`}>
                      <PenBoxIcon stroke="blue" width={24} height={24} />
                    </Link>
                  </Button>
                )}
              </div>
            </div>
            <div className="sm:w-2/3 sm:pl-8 sm:py-8 sm:border-l border-gray-200 sm:border-t-0 border-t mt-4 pt-4 sm:mt-0 text-center sm:text-left">
              <h2 className="text-3xl mb-3">最新募資方案</h2>
              <img
                src={user?.projects[0]?.projectThumbnail || cloud}
                alt="projectThumbnail"
                className="mb-3 rounded-3xl object-cover max-h-[300px] w-full"
              />
              <h2 className="text-[18px] text-blue-500 dark:text-indigo-300 leading-relaxed text-lg mb-4">
                {user?.projects[0]?.projectName || "尚未有募資方案"}
              </h2>
              <p className="leading-relaxed text-lg mb-4 dark:text-indigo-100">
                {user?.projects[0]?.projectDescription || "甚麼都沒有..."}
              </p>

              <Link
                to={`/project/${user?.projects[0]?.projectId}`}
                className="text-indigo-500 inline-flex items-center"
              >
                Learn More
                <svg
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  className="w-4 h-4 ml-2"
                  viewBox="0 0 24 24"
                >
                  <path d="M5 12h14M12 5l7 7-7 7"></path>
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProfileMain;
