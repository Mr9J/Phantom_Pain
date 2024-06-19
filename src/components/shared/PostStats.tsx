import {
  useCommentPost,
  useGetCommentPost,
  useLikePost,
  useSavePost,
} from "@/lib/react-query/queriesAndMutation";
import { GetPostDTO } from "@/types";
import { BookmarkIcon, HeartIcon } from "lucide-react";
import { useToast } from "../ui/use-toast";
import { likePostCheck, savePostCheck } from "@/services/post.service";
import { useEffect, useRef, useState } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import moment from "moment";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
  ContextMenuSeparator,
  ContextMenuSub,
  ContextMenuSubTrigger,
  ContextMenuSubContent,
  ContextMenuShortcut,
} from "@/components/ui/context-menu";
import { Link } from "react-router-dom";

type PostStatsProps = {
  post: GetPostDTO;
  userId: string;
  commentDisplay: boolean;
};

type likePostCheckType = {
  likeCount: string;
  isLiked: string;
};

const PostStats = ({ post, userId, commentDisplay }: PostStatsProps) => {
  const { mutateAsync: likePost } = useLikePost();
  const { mutateAsync: savePost } = useSavePost();
  const { toast } = useToast();
  const [isCommentOpen, setIsCommentOpen] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [isSaved, setIsSaved] = useState(false);
  const [comment, setComment] = useState("");
  const [commentData, setCommentData] = useState(null);
  const [visibleComments, setVisibleComments] = useState(5);
  const inputRef = useRef<HTMLInputElement>(null);
  const { mutateAsync: commentPost, isPending: isCommentSubmitting } =
    useCommentPost();
  const {
    data: comments,
    isPending: isCommentLoading,
    isError: isCommentError,
    refetch: refetchComments,
  } = useGetCommentPost(post?.postId);

  const checkStatus = async () => {
    const session: likePostCheckType = await likePostCheck(
      post?.postId || "",
      userId || ""
    );
    const session2: string = await savePostCheck(
      post?.postId || "",
      userId || ""
    );

    if (!session || !session2) return;

    setIsLiked(session.isLiked === "True" ? true : false);
    setLikeCount(parseInt(session.likeCount));
    setIsSaved(session2 === "True" ? true : false);
  };

  const loadMoreComments = () => {
    setVisibleComments(visibleComments + 5);
  };

  const commentHandler = () => {
    setIsCommentOpen(!isCommentOpen);
  };

  const commentSubmitHandler = async () => {
    try {
      const session = await commentPost({
        postId: post.postId,
        userId,
        comment,
      });

      if (!session) {
        toast({
          variant: "destructive",
          title: "錯誤",
          description: "伺服器錯誤，請稍後再試。",
        });
        return;
      }
      refetchComments().then(() => {
        if (comments !== "沒有留言" && comments !== undefined) {
          setCommentData(comments);
        }
      });
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    refetchComments().then(() => {
      if (comments !== "沒有留言" && comments !== undefined) {
        setCommentData(comments);
      }
    });
  }, [comments]);

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

      checkStatus();
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

      checkStatus();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <div className="flex justify-between items-center z-20">
        <div className="flex gap-2 mt-2">
          {isLiked ? (
            <HeartIcon
              fill="red"
              width={20}
              height={20}
              stroke="red"
              onClick={likeHandler}
              className="cursor-pointer"
            />
          ) : (
            <HeartIcon
              width={20}
              height={20}
              onClick={likeHandler}
              className={`cursor-pointer  ${
                commentDisplay ? "dark:text-white" : "text-white"
              }`}
            />
          )}
          <p
            className={`text-[14px] font-medium leading-[140%] lg:text-[16px] ${
              !commentDisplay && "text-white"
            }`}
          >
            {likeCount}
          </p>
        </div>

        <div className="flex gap-2 mt-2">
          {isSaved ? (
            <BookmarkIcon
              fill="blue"
              width={20}
              height={20}
              stroke="blue"
              onClick={savePostHandler}
              className="cursor-pointer"
            />
          ) : (
            <BookmarkIcon
              width={20}
              height={20}
              onClick={savePostHandler}
              className={`cursor-pointer  ${
                commentDisplay ? "dark:text-white" : "text-white"
              }`}
            />
          )}
        </div>
      </div>

      {commentDisplay && (
        <>
          <Separator className="my-4" />
          <div className="flex justify-between items-center mt-2 w-full">
            <Button
              variant="link"
              onClick={commentHandler}
              disabled={isCommentLoading}
            >
              查看留言... ({commentData ? commentData.length : 0})
            </Button>
          </div>
          <div
            className={`justify-start items-center mt-2 w-full ${
              isCommentOpen ? "flex" : "hidden"
            } overflow-hidden`}
          >
            <ul>
              {commentData ? (
                commentData.slice(0, visibleComments).map((com, index) => (
                  <ContextMenu key={index}>
                    <ContextMenuTrigger
                      className="flex items-start gap-4 mt-2 w-full"
                      key={com.id}
                    >
                      <Link
                        to={`/profile/${com.userId}`}
                        className="flex gap-2"
                      >
                        <img
                          src={com.thumbnail}
                          alt="userImg"
                          className="h-8 w-8 rounded-full"
                        />
                        <p className="text-blue-500 w-20 overflow-y-hidden overflow-x-scroll custom-scrollbar">
                          {com.username}
                        </p>{" "}
                      </Link>
                      <div className="max-w-[480px]">
                        <p className="break-words">{com.comment}</p>
                        <p className="text-blue-400">
                          {moment
                            .utc(com.time, "YYYY-MM-DD HH:mm:ss")
                            .fromNow()}
                        </p>
                      </div>
                    </ContextMenuTrigger>
                    <ContextMenuContent className="w-48">
                      <ContextMenuItem>
                        <Link to={`/profile/${com.userId}`}>個人檔案</Link>
                      </ContextMenuItem>
                      <ContextMenuItem onClick={() => {}}>追隨</ContextMenuItem>
                      <ContextMenuSeparator />
                      <ContextMenuSub>
                        <ContextMenuSubTrigger inset className="text-red">
                          檢舉
                        </ContextMenuSubTrigger>
                        <ContextMenuSubContent className="w-48">
                          <ContextMenuItem className="text-red">
                            不當言論
                          </ContextMenuItem>
                          <ContextMenuItem className="text-red">
                            騷擾或欺凌
                          </ContextMenuItem>
                          <ContextMenuSeparator />
                          <ContextMenuItem className="text-red">
                            其他
                          </ContextMenuItem>
                        </ContextMenuSubContent>
                      </ContextMenuSub>
                    </ContextMenuContent>
                  </ContextMenu>
                ))
              ) : (
                <p>沒有人留言...</p>
              )}
              {commentData && commentData.length > visibleComments && (
                <Button variant="link" onClick={loadMoreComments}>
                  載入更多...
                </Button>
              )}
            </ul>
          </div>
          <div className="flex items-center justify-center mt-2 gap-2 w-full">
            <Input
              ref={inputRef}
              type="text"
              placeholder="comment"
              onChange={(e) => {
                setComment(e.currentTarget.value);
              }}
            />
            <Button
              onClick={() => {
                commentSubmitHandler();
                if (inputRef.current) inputRef.current.value = "";
              }}
              disabled={isCommentSubmitting}
            >
              送出
            </Button>
          </div>
        </>
      )}
    </>
  );
};

export default PostStats;
