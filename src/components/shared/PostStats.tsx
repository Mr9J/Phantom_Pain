import {
  useCommentPost,
  useGetCommentPost,
  useLikePost,
  useSavePost,
  useSearchUsersByKeyword,
} from "@/lib/react-query/queriesAndMutation";
import { GetPostDTO, commentPostType } from "@/types";
import { BookmarkIcon, HeartIcon } from "lucide-react";
import { useToast } from "../ui/use-toast";
import { likePostCheck, savePostCheck } from "@/services/post.service";
import { Fragment, useEffect, useRef, useState } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import PostComment from "./PostComment";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
  const [keyword, setKeyword] = useState("");
  const [showSmartOptions, setShowSmartOptions] = useState(false);
  const [isCommentOpen, setIsCommentOpen] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [isSaved, setIsSaved] = useState(false);
  const [comment, setComment] = useState("");
  const [commentData, setCommentData] = useState<commentPostType | null>(null);
  const [visibleComments, setVisibleComments] = useState(5);
  const inputRef = useRef<HTMLInputElement>(null);
  const { mutateAsync: commentPost, isPending: isCommentSubmitting } =
    useCommentPost();
  const {
    data: comments,
    isPending: isCommentLoading,
    refetch: refetchComments,
  } = useGetCommentPost(post?.postId);
  const { data: userResult } = useSearchUsersByKeyword(keyword);

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

  const handleChange = (value: string) => {
    setComment(value);

    if (value.includes("@")) {
      const parts = value.split("@");
      const lastPart = parts?.[parts.length - 1] ?? "";

      if (lastPart.length >= 2) {
        setKeyword(lastPart);
        setShowSmartOptions(true);
      }
    } else {
      setShowSmartOptions(false);
    }
  };

  const commentSubmitHandler = async () => {
    try {
      if (comment === "") {
        toast({
          variant: "destructive",
          title: "錯誤",
          description: "留言不得為空。",
        });
        return;
      }

      //inputRef.current?.value 跟 comment 分開

      const session = await commentPost({
        postId: post.postId,
        userId,
        comment,
        isReply: false,
      });

      if (!session) {
        toast({
          variant: "destructive",
          title: "錯誤",
          description: "伺服器錯誤，請稍後再試。",
        });
        return;
      }
      toast({
        title: "成功",
        description: "留言已送出",
      });

      setComment("");
      if (inputRef.current) inputRef.current.value = "";

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
    checkStatus();
    refetchComments().then(() => {
      if (comments !== "沒有留言" && comments !== undefined) {
        setCommentData(comments);
      }
    });
  }, [comments, refetchComments]);

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
              查看留言... ({Array.isArray(commentData) ? commentData.length : 0}
              )
            </Button>
          </div>
          <div
            className={`justify-start items-center mt-2 w-full ${
              isCommentOpen ? "flex" : "hidden"
            } overflow-hidden`}
          >
            <ul className="w-full">
              {Array.isArray(commentData) && commentData.length !== 0 ? (
                commentData
                  .slice(0, visibleComments)
                  .map((com: commentPostType) => (
                    <Fragment key={com.postCommentID}>
                      <PostComment
                        com={com}
                        userId={userId}
                        refetchComments={refetchComments}
                      />
                      <Separator />
                    </Fragment>
                  ))
              ) : (
                <p>沒有人留言...</p>
              )}
              {Array.isArray(commentData) &&
                commentData.length > visibleComments && (
                  <Button variant="link" onClick={loadMoreComments}>
                    載入更多...
                  </Button>
                )}
            </ul>
          </div>
          <div className="flex items-center justify-center mt-2 gap-2 w-full">
            <div className="relative w-full">
              <Input
                ref={inputRef}
                type="text"
                placeholder="評論貼文..."
                onChange={(e) => handleChange(e.target.value)}
              />
              {showSmartOptions && (
                <div className="absolute w-full">
                  <Select
                    open={showSmartOptions}
                    onValueChange={(e) => {
                      const parts = inputRef.current?.value.split("@");
                      const lastPart = parts?.[parts.length - 1] ?? "";
                      inputRef.current.value = inputRef.current?.value.replace(
                        "@" + lastPart,
                        "@" + e
                      );
                      setShowSmartOptions(false);
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="搜尋使用者" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Users</SelectLabel>
                        {userResult?.map((user) => (
                          <SelectItem
                            key={user.memberId}
                            value={user.nickname}
                            className="p-4 w-full"
                          >
                            <div className="flex-row gap-4 flex justify-center items-center w-full">
                              <div className="flex-shrink-0">
                                <p className="relative block">
                                  <img
                                    alt="profil"
                                    src={user.thumbnail}
                                    className="mx-auto object-cover rounded-full h-16 w-16 "
                                  />
                                </p>
                              </div>
                              <div className=" flex flex-col">
                                <span className="text-lg font-medium">
                                  {user.nickname}
                                </span>
                                <span className="text-xs text-blue-500">
                                  @{user.username}
                                </span>
                              </div>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>

            <Button
              onClick={commentSubmitHandler}
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
