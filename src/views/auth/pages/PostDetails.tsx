import { Link, useNavigate, useParams } from "react-router-dom";
import {
  useDeletePost,
  useGetPostById,
  useGetPostImg,
} from "@/lib/react-query/queriesAndMutation";
import { useRef } from "react";
import LoaderSvg from "@/components/shared/LoaderSvg";
import moment from "moment";
import userThumbnail from "@/assets/admin_img/mygo/6.jpg";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";
import {
  FilePenLineIcon,
  TrashIcon,
  Copy,
  Twitter,
  Facebook,
  ShareIcon,
} from "lucide-react";
import { useUserContext } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import PostStats from "@/components/shared/PostStats";
import { useToast } from "@/components/ui/use-toast";
import { ToastAction } from "@/components/ui/toast";
import GoogleTranslate from "@/config/GoogleTranslate";
import { Fragment, useEffect, useState } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const PostDetails = () => {
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const { id } = useParams();
  const { toast } = useToast();
  const { data: post, isPending } = useGetPostById(id || "");
  const { data: postImg, isPending: isPostImgLoading } = useGetPostImg(
    post?.imgUrl || ""
  );
  const { mutateAsync: deletePost, isPending: isDeletingPost } =
    useDeletePost();
  const { user } = useUserContext();
  const [translateCaption, setTranslateCaption] = useState(post?.caption);
  const [isTranslate, setIsTranslate] = useState(false);
  const [ensure, setEnsure] = useState(false);
  const handleEnsure = () => {
    setEnsure(!ensure);
  };

  const handleTranslate = async () => {
    if (translateCaption) {
      await GoogleTranslate(translateCaption, "zh-TW").then((res) => {
        setIsTranslate(true);
        setTranslateCaption(res);
      });
    }
  };

  const handleDeletePost = async () => {
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
  };

  useEffect(() => {
    if (post?.caption) setTranslateCaption(post?.caption);
  }, [post?.caption]);

  return (
    <div
      className={`flex flex-col flex-1 gap-10 overflow-scroll py-10 px-5 md:p-14 custom-scrollbar items-center`}
    >
      {isPending ? (
        <LoaderSvg />
      ) : (
        <div
          className={`${
            post?.isAnonymous === "Y" ? "bg-red-600 text-white" : "bg-slate-50"
          }  dark:bg-dark-2 w-full max-w-5xl rounded-[30px] flex-col flex xl:flex-row border dark:border-dark-4 border-slate-200 xl:rounded-l-[24px]`}
        >
          {post?.isAnonymous === "Y" && !ensure ? (
            <Button onClick={handleEnsure} className="w-full">
              該則貼文被列為警告，請點及確認是否查看
            </Button>
          ) : (
            <Fragment>
              <Carousel className="h-80 lg:h-[480px] xl:w-[48%] rounded-t-[30px] xl:rounded-l-[24px] xl:rounded-tr-none flex">
                <CarouselContent>
                  {isPostImgLoading ? (
                    <LoaderSvg />
                  ) : (
                    postImg?.map((img, index) => {
                      return (
                        <CarouselItem key={index}>
                          <div className="p-1">
                            <Card>
                              <CardContent className="flex xl:aspect-square items-center justify-center">
                                <img
                                  src={`https://cdn.mumumsit158.com/${img.Key}`}
                                  alt="post"
                                  className="object-contain select-none w-full h-full"
                                />
                              </CardContent>
                            </Card>
                          </div>
                        </CarouselItem>
                      );
                    })
                  )}
                </CarouselContent>
              </Carousel>
              <div
                className={`${
                  post?.isAnonymous === "Y"
                    ? "bg-red-600"
                    : "dark:bg-dark-2 bg-slate-50"
                }  flex flex-col gap-5 lg:gap-7 flex-1 items-start p-8 rounded-[30px]`}
              >
                <div className="flex justify-between items-center w-full">
                  <Link
                    to={`/profile/${post?.userId}`}
                    className="flex items-center gap-3"
                  >
                    <img
                      src={post?.userImg || userThumbnail}
                      alt="creator"
                      className="rounded-full w-8 h-8 lg:w-12 lg:h-12"
                    />
                    <div className="flex flex-col">
                      <p className="text-[16px] font-medium leading-[140%] lg:text-[18px]">
                        {post?.username}
                      </p>
                      <div className="flex justify-center items-center gap-2 text-light-3">
                        <p className="text-[12px] font-semibold leading-[140%] lg:text-[14px] lg:font-normal">
                          {moment
                            .utc(post?.postTime, "YYYY-MM-DD HH:mm:ss")
                            .fromNow()}
                        </p>
                        -
                        <p className="text-[12px] font-semibold leading-[140%] lg:text-[14px] lg:font-normal">
                          {post?.location}
                        </p>
                      </div>
                    </div>
                  </Link>
                  <div className="flex justify-center items-center">
                    <Link
                      to={`/update-post/${post?.postId}`}
                      className={`${user.id !== post?.userId && "hidden"}`}
                    >
                      <FilePenLineIcon width={24} height={24} />
                    </Link>
                    <Button
                      onClick={handleDeletePost}
                      variant="ghost"
                      disabled={isDeletingPost}
                      className={`${
                        user.id !== post?.userId && "hidden"
                      } ghost_details-delete_btn`}
                    >
                      <TrashIcon stroke="red" width={24} height={24} />
                    </Button>
                  </div>
                  <div className="flex justify-center items-center gap-3">
                    <Button
                      variant="outline"
                      onClick={() =>
                        window.open(
                          `https://twitter.com/share?text=${post?.caption}&url=https://mumumsit158.com/posts/${id}`,
                          "_blank"
                        )
                      }
                    >
                      <Twitter className="w-[16px] h-[16px]" />
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() =>
                        window.open(
                          `https://www.facebook.com/sharer/sharer.php?u=https://mumumsit158.com/posts/${id}`,
                          "_blank"
                        )
                      }
                    >
                      <Facebook className="w-[16px] h-[16px]" />
                    </Button>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline">
                          <ShareIcon className="w-[16px] h-[16px]" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                          <DialogTitle>Share link</DialogTitle>
                          <DialogDescription>
                            Anyone who has this link will be able to view this.
                          </DialogDescription>
                        </DialogHeader>
                        <div className="flex items-center space-x-2">
                          <div className="grid flex-1 gap-2">
                            <Label htmlFor="link" className="sr-only">
                              Link
                            </Label>
                            <Input
                              ref={inputRef}
                              id="link"
                              defaultValue={`https://mumumsit158.com/posts/${id}`}
                              readOnly
                            />
                          </div>
                          <Button
                            type="submit"
                            size="sm"
                            className="px-3"
                            onClick={async () => {
                              const link = inputRef?.current?.value;
                              await navigator.clipboard.writeText(link || "");
                            }}
                          >
                            <span className="sr-only">Copy</span>
                            <Copy className="h-4 w-4" />
                          </Button>
                        </div>
                        <DialogFooter className="sm:justify-start">
                          <DialogClose asChild>
                            <Button type="button" variant="secondary">
                              Close
                            </Button>
                          </DialogClose>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
                <hr className="border w-full dark:border-dark-4/80 border-slate-300/80" />
                <div className="flex flex-col flex-1 w-full text-[14px] font-medium leading-[140%] lg:text-[16px] whitespace-pre-wrap">
                  <p>{isTranslate ? translateCaption : post?.caption}</p>
                  <p
                    className="text-blue-500 cursor-pointer"
                    onClick={handleTranslate}
                  >
                    翻譯蒟蒻...
                  </p>
                  <ul className="flex gap-1 mt-2">
                    {post?.tags.split(",").map((tag: string, index) => (
                      <li key={index} className="text-light-3">
                        #{tag}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="w-full">
                  <PostStats
                    post={post}
                    userId={user.id}
                    commentDisplay={true}
                  />
                </div>
              </div>
            </Fragment>
          )}
        </div>
      )}
    </div>
  );
};

export default PostDetails;
