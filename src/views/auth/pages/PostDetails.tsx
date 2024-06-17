import { Link, useParams } from "react-router-dom";
import {
  useGetPostById,
  useGetPostImg,
} from "@/lib/react-query/queriesAndMutation";
import LoaderSvg from "@/components/shared/LoaderSvg";
import moment from "moment";
import userThumbnail from "@/assets/admin_img/mygo/6.jpg";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";
import { FilePenLineIcon, TrashIcon } from "lucide-react";
import { useUserContext } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import PostStats from "@/components/shared/PostStats";

const PostDetails = () => {
  const { id } = useParams();
  const { data: post, isPending } = useGetPostById(id || "");
  const { data: postImg, isPending: isPostImgLoading } = useGetPostImg(
    post?.imgUrl
  );
  const { user } = useUserContext();

  const handleDeletePost = () => {};

  return (
    <div className="flex flex-col flex-1 gap-10 overflow-scroll py-10 px-5 md:p-14 custom-scrollbar items-center">
      {isPending ? (
        <LoaderSvg />
      ) : (
        <div className="bg-slate-50 dark:bg-dark-2 w-full max-w-5xl rounded-[30px] flex-col flex xl:flex-row border dark:border-dark-4 border-slate-200 xl:rounded-l-[24px]">
          <Carousel className="h-80 lg:h-[480px] xl:w-[48%] rounded-t-[30px] xl:rounded-l-[24px] xl:rounded-tr-none flex">
            <CarouselContent>
              {postImg &&
                postImg.map((img, index) => {
                  return (
                    <CarouselItem key={index}>
                      <div className="p-1">
                        <Card>
                          <CardContent className="flex xl:aspect-square items-center justify-center p-6">
                            <img
                              src={`https://cdn.mumumsit158.com/${img.Key}`}
                              alt="post"
                              className="object-cover select-none"
                            />
                          </CardContent>
                        </Card>
                      </div>
                    </CarouselItem>
                  );
                })}
            </CarouselContent>
          </Carousel>
          <div className="dark:bg-dark-2 bg-slate-50 flex flex-col gap-5 lg:gap-7 flex-1 items-start p-8 rounded-[30px]">
            <div className="flex justify-between items-center w-full">
              <Link
                to={`/users/${post?.userId}`}
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
                  to={`/update-post/${post.postId}`}
                  className={`${user.id !== post.userId && "hidden"}`}
                >
                  <FilePenLineIcon width={24} height={24} />
                </Link>
                <Button
                  onClick={handleDeletePost}
                  variant="ghost"
                  className={`${
                    user.id !== post.userId && "hidden"
                  } ghost_details-delete_btn`}
                >
                  <TrashIcon stroke="red" width={24} height={24} />
                </Button>
              </div>
            </div>
            <hr className="border w-full dark:border-dark-4/80 border-slate-300/80" />
            <div className="flex flex-col flex-1 w-full text-[14px] font-medium leading-[140%] lg:text-[16px]">
              <p>{post?.caption}</p>
              <ul className="flex gap-1 mt-2">
                {post?.tags.split(",").map((tag: string, index) => (
                  <li key={index} className="text-light-3">
                    #{tag}
                  </li>
                ))}
              </ul>
            </div>
            <div className="w-full">
              <PostStats post={post} userId={user.id} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PostDetails;
