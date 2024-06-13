import { GetPostDTO } from "@/types";
import { Link } from "react-router-dom";
import userThumbnail from "@/assets/admin_img/mygo/6.jpg";
import moment from "moment";
import { FilePenLineIcon } from "lucide-react";
import { useUserContext } from "@/context/AuthContext";
import PostStats from "./PostStats";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Card, CardContent } from "../ui/card";

type PostCardProps = {
  post: GetPostDTO;
};

const PostCard = ({ post }: PostCardProps) => {
  const { user } = useUserContext();

  if (!post.userId) return null;

  return (
    <div className=" bg-slate-50 dark:bg-dark-2 rounded-3xl border dark:border-dark-4 p-5 lg:p-7 w-full max-w-screen-sm">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <Link to={`/users/${post.userId}`}>
            <img
              src={post?.userImg || userThumbnail}
              alt="creator"
              className="rounded-full w-12 lg:h-12"
            />
          </Link>
          <div className="flex flex-col">
            <p className="text-[16px] font-medium leading-[140%] lg:text-[18px]">
              {post.username}
            </p>
            <div className="flex justify-center items-center gap-2 text-light-3">
              <p className="text-[12px] font-semibold leading-[140%] lg:text-[14px] lg:font-normal">
                {moment.utc(post.postTime, "YYYY-MM-DD HH:mm:ss").fromNow()}
              </p>
              -
              <p className="text-[12px] font-semibold leading-[140%] lg:text-[14px] lg:font-normal">
                {post.location}
              </p>
            </div>
          </div>
        </div>
        <Link
          to={`/update-post/${post.postId}`}
          className={`${user.id !== post.userId && "hidden"}`}
        >
          <FilePenLineIcon width={20} height={20} />
        </Link>
      </div>

      <Link to={`/posts/${post.postId}`}>
        <div className="text-[14px] font-medium leading-[140%] lg:text-[16px] py-5">
          <p>{post.caption}</p>
          <ul className="flex gap-1 mt-2">
            {post.tags &&
              post.tags.split(",").map((tag: string, index) => (
                <li key={index} className="text-light-3">
                  #{tag}
                </li>
              ))}
          </ul>
        </div>
      </Link>
      <Carousel>
        <CarouselContent>
          {post.imgUrl &&
            post.imgUrl.split(",").map((img, index) => {
              return (
                <CarouselItem key={index}>
                  <div className="p-1">
                    <Card>
                      <CardContent className="flex aspect-square items-center justify-center p-6">
                        <img
                          src={img}
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

      <PostStats post={post} userId={user.id} />
    </div>
  );
};

export default PostCard;
