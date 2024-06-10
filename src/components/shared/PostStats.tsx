import { useLikePost, useSavePost } from "@/lib/react-query/queriesAndMutation";
import { GetPostDTO } from "@/types";
import { BookmarkIcon, HeartIcon } from "lucide-react";
import { useToast } from "../ui/use-toast";
import { likePostCheck, savePostCheck } from "@/services/post.service";
import { useEffect, useState } from "react";

type PostStatsProps = {
  post: GetPostDTO;
  userId: string;
};

type likePostCheckType = {
  likeCount: string;
  isLiked: string;
};

const PostStats = ({ post, userId }: PostStatsProps) => {
  const { mutateAsync: likePost } = useLikePost();
  const { mutateAsync: savePost } = useSavePost();
  const { toast } = useToast();
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [isSaved, setIsSaved] = useState(false);
  const checkStatus = async () => {
    const session: likePostCheckType = await likePostCheck(post.postId, userId);
    const session2: string = await savePostCheck(post.postId, userId);

    if (!session || !session2) return;

    setIsLiked(session.isLiked === "True" ? true : false);
    setLikeCount(parseInt(session.likeCount));
    setIsSaved(session2 === "True" ? true : false);
  };

  useEffect(() => {
    if (userId) {
      checkStatus();
    }
  }, [checkStatus]);

  const likeHandler = async () => {
    try {
      const session = await likePost({ postId: post.postId, userId });

      if (session === "找不到該貼文") {
        toast({
          variant: "destructive",
          title: "錯誤",
          description: "找不到該貼文，請重新整理頁面，確認貼文是否存在。",
        });

        return;
      }

      if (!session) {
        toast({
          variant: "destructive",
          title: "錯誤",
          description: "伺服器錯誤，請稍後再試。",
        });

        return;
      }
    } catch (error) {
      console.error(error);
    }
  };

  const savePostHandler = async () => {
    try {
      const session = await savePost({ postId: post.postId, userId });

      if (session === "找不到該貼文") {
        toast({
          variant: "destructive",
          title: "錯誤",
          description: "找不到該貼文，請重新整理頁面，確認貼文是否存在。",
        });

        return;
      }

      if (!session) {
        toast({
          variant: "destructive",
          title: "錯誤",
          description: "伺服器錯誤，請稍後再試。",
        });

        return;
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="flex justify-between items-center z-20">
      <div className="flex gap-2 mt-2">
        {isLiked ? (
          <HeartIcon
            fill="red"
            width={20}
            height={20}
            onClick={likeHandler}
            className="cursor-pointer"
          />
        ) : (
          <HeartIcon
            width={20}
            height={20}
            onClick={likeHandler}
            className="cursor-pointer"
          />
        )}
        <p className="text-[14px] font-medium leading-[140%] lg:text-[16px]">
          {likeCount}
        </p>
      </div>

      <div className="flex gap-2 mt-2">
        {isSaved ? (
          <BookmarkIcon
            fill="blue"
            width={20}
            height={20}
            onClick={savePostHandler}
            className="cursor-pointer"
          />
        ) : (
          <BookmarkIcon
            width={20}
            height={20}
            onClick={savePostHandler}
            className="cursor-pointer"
          />
        )}
      </div>
    </div>
  );
};

export default PostStats;
