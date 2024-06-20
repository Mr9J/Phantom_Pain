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
function TabComments({ pid }: { pid: number }) {
  const { user, isAuthenticated } = useUserContext();
  const URL = import.meta.env.VITE_API_URL;
  const [input, setInput] = useState<string>("");
  const [comments, setComments] = useState<typeComment[]>([]);

  const sendComment = async () => {
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
    };
    // 呼叫 Hub 送出留言
    connection
      .invoke("SendMessage", newComment)
      .catch((err) => console.error(err));
    setInput("");
  };

  const DtoToComment = (data: typeCommentDto): typeComment => {
    return {
      commentId: data.commentId!,
      commentMsg: data.commentMsg,
      date: data.date!,
      sender: data.member!,
      liked: data.liked,
      parentId: data.parentId,
    };
  };
  const handleReceivedComment = (data: typeCommentDto) => {
    const receivedComment = DtoToComment(data);
    setComments((comments) => [...comments, receivedComment]);
  };

  const getComments = async (config?: string) => {
    const res = await axios.get(`${URL}/ProjectInfo/GetComments`, {
      params: {
        projectId: pid,
        orderby: config,
      },
    });
    console.log(res.data);
    const comments = res.data.map((data: typeCommentDto) => DtoToComment(data));
    setComments(comments);
  };
  useEffect(() => {
    getComments();

    // 註冊接收訊息事件
    // connection.on("ReceiveComment", handleReceivedComment);
  }, []);
  // comment一有變動就會去抓會員資料
  useEffect(() => {
    console.log(comments);
  }, [comments]);

  const handleSortChange = async (value: string) => {
    switch (value) {
      case "nto":
        await getComments();
        break;
      case "otn":
        await getComments("Date");
        break;
      case "hot":
        await getComments("CommentId");
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
            <SelectItem value="hot">熱門留言</SelectItem>
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
        <Button onClick={sendComment}>留言</Button>
      </div>

      <div className=" mx-auto mt-10 p-4 rounded-lg shadow-lg space-y-4">
        {comments.map(
          (c) =>
            // [元件]一則留言
            !c.parentId && (
              <div>
                {/* 顯示第一層留言(ParentId 為 null) */}
                <div
                  key={c.commentId}
                  className="border-b border-gray-700 pb-4"
                >
                  <div className="flex items-center mb-2">
                    <div className="w-8 h-8 mr-3">
                      <Avatar>
                        <AvatarImage src={c.sender.thumbnail} />
                        <AvatarFallback>{c.sender.username}</AvatarFallback>
                      </Avatar>
                    </div>
                    <div className="flex-col">
                      <p className="font-bold">{c.sender.username}</p>
                      <div className="flex">
                        <p className="text-xs">{DateTimeToString(c.date)}</p>
                        <Button
                          variant="ghost"
                          className="p-2 h-4 text-xs cursor-pointer ml-1"
                          onClick={() => alert("hi")}
                        >
                          <ThumbsUp width={10} className="mr-1" />
                          {c.liked}
                        </Button>
                        <Button
                          variant="ghost"
                          className="p-2 h-4 text-xs text-gray-400 ml-1"
                          onClick={sendComment}
                        >
                          回覆
                        </Button>
                      </div>
                    </div>
                  </div>
                  <div>{c.commentMsg}</div>
                </div>
                {/* 第二層留言 */}
                <div className="ml-8">
                  {comments
                    .filter((sc) => sc.parentId === c.commentId)
                    .map((sc) => (
                      <div
                        key={sc.commentId}
                        className="border-b border-gray-600 pb-2 pt-2"
                      >
                        <div className="flex items-center mb-2">
                          <div className="w-8 h-8 mr-3">
                            <Avatar>
                              <AvatarImage src={sc.sender.thumbnail} />
                              <AvatarFallback>
                                {sc.sender.username}
                              </AvatarFallback>
                            </Avatar>
                          </div>
                          <div className="flex-col">
                            <p className="font-bold">{sc.sender.username}</p>
                            <div className="flex">
                              <p className="text-xs">
                                {DateTimeToString(sc.date)}
                              </p>
                              <Button
                                variant="ghost"
                                className="p-2 h-4 text-xs cursor-pointer ml-1"
                                onClick={() => alert("hi")}
                              >
                                <ThumbsUp width={10} className="mr-1" />
                                {sc.liked}
                              </Button>
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
