import { useRef, useState } from "react";
import { Button } from "../ui/button";
import { childCommentsType } from "@/types";
import TruncateText from "./TruncateText";
import moment from "moment";
import { FlagIcon, ThumbsDownIcon, ThumbsUpIcon } from "lucide-react";
import { useToast } from "../ui/use-toast";
import { Input } from "../ui/input";
import {
  useCommentLike,
  useCommentPost,
} from "@/lib/react-query/queriesAndMutation";
import { Link } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "../ui/label";

type ChildPostCommentProps = {
  child: childCommentsType;
  userId: string;
  comId: number;
  refetchComments: (
    options?: RefetchOptions | undefined
  ) => Promise<QueryObserverResult<any, Error>>;
};

const ChildPostComment = ({
  child,
  userId,
  comId,
  refetchComments,
}: ChildPostCommentProps) => {
  const [isCommentOpen, setIsCommentOpen] = useState(false);
  const [isReplying, setIsReplying] = useState(false);
  const [comment, setComment] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const { mutateAsync: commentPost, isPending: isCommentSubmitting } =
    useCommentPost();
  const { mutateAsync: likeComment, isPending: isCommentStatusLoading } =
    useCommentLike();

  const commentSubmitHandler = async () => {
    try {
      const session = await commentPost({
        postId: String(child.postID),
        comment: comment,
        userId: userId,
        parentId: String(comId),
      });

      if (!session) {
        toast({
          variant: "destructive",
          title: "錯誤",
          description: "伺服器錯誤，請稍後再試。",
        });
        return;
      }

      if (inputRef.current) inputRef.current.value = "";

      toast({
        title: "成功",
        description: "留言已送出",
      });

      setIsReplying(false);

      refetchComments();
    } catch (error) {
      console.error(error);
    }
  };

  const likeHandler = async (status: string) => {
    const session = await likeComment({
      commentId: child.postCommentID,
      status: status,
    });

    if (!session) {
      toast({
        variant: "destructive",
        title: "錯誤",
        description: "伺服器錯誤，請稍後再試。",
      });
      return;
    }

    refetchComments();
  };

  return (
    <div className="flex flex-col border-l-4 border-blue-500">
      <div className="grid grid-cols-6 gap-1 justify-center items-center overflow-hidden py-2 w-full">
        <div className="flex justify-center items-center col-start-1 col-end-2">
          <Link to={`/profile/${child.memberID}`}>
            <img
              src={child.thumbnail}
              alt="thumbnail"
              className="h-12 w-12 rounded-full"
            />
          </Link>
        </div>
        <div className=" flex justify-start items-center col-start-2 col-end-3">
          <DropdownMenu>
            <DropdownMenuTrigger>
              <TruncateText
                content={child.nickname}
                maxLength={8}
                textStyles="text-blue-500"
              />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              <DropdownMenuLabel>用戶資訊</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Link to={`/profile/${child.memberID}`}>{child.nickname}</Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Link to={`/users/${child.memberID}`}>募資企畫</Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="flex justify-start items-center col-start-3 col-end-6">
          {child.comment.length > 50 && !isCommentOpen ? (
            <div>
              <TruncateText
                content={child.comment}
                maxLength={50}
                textStyles="break-words"
              />
              <p
                className="text-blue-500 cursor-pointer"
                onClick={() => setIsCommentOpen(true)}
              >
                完整留言...
              </p>
            </div>
          ) : (
            <div>
              <p className="break-words">{child.comment}</p>
              {child.comment.length > 50 && (
                <p
                  className="text-blue-500 cursor-pointer"
                  onClick={() => setIsCommentOpen(false)}
                >
                  收起留言
                </p>
              )}
            </div>
          )}
        </div>
        <div className="flex justify-start items-center col-start-6 col-end-7">
          <p className="text-blue-500">
            {moment.utc(child.date, "YYYY-MM-DD HH:mm:ss").fromNow()}
          </p>
        </div>
      </div>
      <div className="flex justify-between items-center">
        <div className="flex justify-center items-center">
          <Button variant="link" onClick={() => likeHandler("T")}>
            {child.postCommentDetail.isLiked ? (
              <ThumbsUpIcon width={16} height={16} stroke="blue" fill="blue" />
            ) : (
              <ThumbsUpIcon width={16} height={16} />
            )}

            <p className="text-base pl-1">
              {child.postCommentDetail.likeCount}
            </p>
          </Button>
          <Button variant="link" onClick={() => likeHandler("F")}>
            {child.postCommentDetail.isDisliked ? (
              <ThumbsDownIcon width={16} height={16} stroke="red" fill="red" />
            ) : (
              <ThumbsDownIcon width={16} height={16} />
            )}
            <p className="text-base pl-1">
              {child.postCommentDetail.dislikeCount}
            </p>
          </Button>
          <Dialog>
            <DialogTrigger>
              <FlagIcon width={16} height={16} stroke="red" fill="red" />
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>檢舉事由</DialogTitle>
                <DialogDescription>
                  寫下檢舉此留言的原因，我們會盡快處理。
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">
                    檢舉對象
                  </Label>
                  <Input
                    id="name"
                    disabled
                    defaultValue={child.nickname}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="username" className="text-right">
                    檢舉事由
                  </Label>
                  <Input
                    id="username"
                    placeholder="請填寫檢舉事由..."
                    className="col-span-3"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit">送出</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
        <Button
          variant="link"
          onClick={() => {
            setIsReplying(!isReplying);
          }}
        >
          {isReplying ? "取消" : "回覆"}
        </Button>
      </div>
      {isReplying && (
        <div className="flex justify-between items-center p-2 gap-2 w-full">
          <Input
            ref={inputRef}
            type="text"
            placeholder={`回覆留言串...`}
            onChange={(e) => {
              setComment(e.target.value);
            }}
          />
          <Button onClick={commentSubmitHandler} disabled={isCommentSubmitting}>
            送出
          </Button>
        </div>
      )}
    </div>
  );
};

export default ChildPostComment;
