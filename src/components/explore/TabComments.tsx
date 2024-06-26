import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import axios from "axios";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { useUserContext } from "@/context/AuthContext";
import { DateTimeToString } from "./services";
import { typeComment, typeCommentDto, typeCommentRequest } from "./types";
import connection from "./signalrService";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ThumbsUp } from "lucide-react";
import ReplyInput from "./ReplyInput";
import CommentCard from "./CommentCard";

function TabComments({ pid }: { pid: number }) {
  const { user, isAuthenticated } = useUserContext();
  const URL = import.meta.env.VITE_API_URL;
  const [input, setInput] = useState<string>("");
  const [comments, setComments] = useState<typeComment[]>([]);
  const [sortConfig, setSortConfig] = useState<string>("nto");

  const sendComment = async (reply?: number) => {
    // 判斷是否登入
    if (!isAuthenticated) {
      alert("請先登入");
      return;
    }

    if (input.trim() == "") {
      alert("請輸入留言");
      return;
    }
    // 假設某人發送留言
    const newComment: typeCommentRequest = {
      commentMsg: input,
      projectId: pid,
      parentId: reply,
    };
    // 呼叫 Hub 送出留言
    connection
      .invoke("SendMessage", newComment)
      .catch((err) => console.error(err));
  };

  const DtoToComment = (data: typeCommentDto): typeComment => {
    return {
      commentId: data.commentId!,
      commentMsg: data.commentMsg,
      date: data.date!,
      sender: data.member!,
      liked: data.liked,
      parentId: data.parentId,
      isNew: false,
    };
  };
  const handleReceivedComment = (data: typeCommentDto) => {
    const receivedComment = DtoToComment(data);
    receivedComment.isNew = true;

    // 依照排序方式加入留言
    if (sortConfig === "nto")
      setComments((comments) => [receivedComment, ...comments]);
    else setComments((comments) => [...comments, receivedComment]);

    setTimeout(() => {
      setComments((prevComments) =>
        prevComments.map((m) =>
          m.date === receivedComment.date ? { ...m, isNew: false } : m
        )
      );
    }, 3000);
  };

  // 取得排序後的所有留言
  const getComments = async (sortConfig?: string) => {
    const res = await axios.get(`${URL}/ProjectInfo/GetComments`, {
      params: {
        projectId: pid,
        orderby: sortConfig,
      },
    });
    console.log(res.data);
    const comments = res.data.map((data: typeCommentDto) => DtoToComment(data));
    setComments(comments);
  };
  useEffect(() => {
    getComments(sortConfig);

    // 註冊接收訊息事件
    connection.on("ReceiveComment", handleReceivedComment);

    return () => {
      connection.off("ReceiveComment", handleReceivedComment);
    };
  }, [sortConfig]);
  // comment一有變動就會去抓會員資料
  useEffect(() => {
    console.log(comments);
  }, [comments]);

  const handleSortChange = (value: string) => {
    switch (value) {
      case "otn":
        setSortConfig("otn");
        break;
      case "hot":
        setSortConfig("hot");
        break;
      default:
        setSortConfig("nto");
        break;
    }
  };

  return (
    <>
      <div className="flex justify-between">
        <h2>{comments.length}則留言</h2>

        <Select onValueChange={handleSortChange}>
          <SelectTrigger className="w-[120px]">
            <SelectValue placeholder="排序依據" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="nto">由新到舊</SelectItem>
            <SelectItem value="otn">由舊到新</SelectItem>
            {/* <SelectItem value="hot">熱門留言</SelectItem> */}
          </SelectContent>
        </Select>
      </div>
      <div className="p-2 flex w-full items-center space-x-2">
        <Avatar className="border">
          <AvatarImage
            src={
              isAuthenticated
                ? user.thumbnail
                : "/src/assets/admin_img/mygo/6.jpg"
            }
          />
          <AvatarFallback>{user.nickname[0]}</AvatarFallback>
        </Avatar>
        <Input
          placeholder="留下想說的話..."
          onChange={(e) => setInput(e.currentTarget.value)}
          value={input}
        />
        <Button
          onClick={() => {
            sendComment();
            setInput("");
          }}
        >
          留言
        </Button>
      </div>

      <div className=" mx-auto mt-10 p-4 rounded-lg shadow-lg space-y-4">
        {comments.map(
          (c) =>
            // [元件]一則留言
            !c.parentId && (
              <div className="border-b" style={{ borderColor: "currentcolor" }}>
                {/* 顯示第一層留言(ParentId 為 null) */}
                <CommentCard c={c} projectId={pid} />
                {/* 第二層留言 */}
                <div className="ml-8">
                  {comments
                    .filter((sc) => sc.parentId === c.commentId)
                    .map((sc) => (
                      <div
                        key={sc.commentId}
                        className={`border-b px-4 py-2 rounded-lg ${
                          sc.isNew
                            ? "animate-bounce bg-blue-200 text-black"
                            : ""
                        }`}
                      >
                        <div className="flex items-center mb-2 ">
                          <div className="w-8 h-8 mr-3">
                            <Avatar>
                              <AvatarImage src={sc.sender.thumbnail} />
                              <AvatarFallback>
                                {sc.sender.username[0]}
                              </AvatarFallback>
                            </Avatar>
                          </div>
                          <div className="flex-col">
                            <p className="font-bold">{sc.sender.username}</p>
                            <div className="flex">
                              <p className="text-xs">
                                {DateTimeToString(sc.date)}
                              </p>
                              {/* <Button
                                variant="ghost"
                                className="p-2 h-4 text-xs cursor-pointer ml-1"
                                onClick={() => alert("hi")}
                              >
                                <ThumbsUp width={10} className="mr-1" />
                                {sc.liked}
                              </Button> */}
                              {/* <Button
                                variant="ghost"
                                className="p-2 h-4 text-xs text-gray-400 ml-1"
                                onClick={sendComment}
                              >
                                回覆
                              </Button> */}
                            </div>
                          </div>
                        </div>
                        <div>{sc.commentMsg}</div>
                        {/* <ReplyInput parentId={sc.commentId} projectId={pid} /> */}
                      </div>
                    ))}
                </div>
              </div>
            )
        )}
      </div>
    </>
  );
}

export default TabComments;
