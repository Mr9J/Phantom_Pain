import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import axios from "axios";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { useUserContext } from "@/context/AuthContext";
import { DateTimeToString } from "./services";
import { typeComment, typeCommentDto, typeMember } from "./types";
import connection from "./signalrService";

function TabComments() {
  const { user, isAuthenticated } = useUserContext();
  const URL = import.meta.env.VITE_API_URL;
  const [input, setInput] = useState<string>("");
  const [comments, setComments] = useState<typeComment[]>([]);

  const sendComment = async () => {
    const newComment: typeCommentDto = {
      commentMsg: input,
      projectId: 100,
      memberId: 1,
    };
    // 呼叫 API 送出留言
    await axios.post(`${URL}/ProjectInfo/SendComment`, newComment);
    setInput("");
  };

  const fetchMember = async (memberId: number): Promise<typeMember> => {
    const res = await axios.get(`${URL}/ProjectInfo/Member`, {
      params: {
        memberId,
      },
    });
    const member: typeMember = res.data;
    console.log(member);
    return member;
  };
  const handleReceivedComment = async (data: typeCommentDto) => {
    const receivedComment: typeComment = {
      commentId: data.commentId!,
      commentMsg: data.commentMsg,
      date: data.date!,
      user: data.user,
    };
    setComments((preComments) => [...preComments, receivedComment]);
  };
  const DtoToComment = (data: typeCommentDto): typeComment => {
    return {
      commentId: data.commentId!,
      commentMsg: data.commentMsg,
      date: data.date!,
      sender: data.member,
    };
  };

  useEffect(() => {
    (async () => {
      const res = await axios.get(`${URL}/ProjectInfo/GetComments`, {
        params: {
          projectId: 100,
        },
      });

      const comments = res.data.map((data: typeCommentDto) =>
        DtoToComment(data)
      );
      console.log(comments);
      setComments(comments);
    })();

    // 註冊接收訊息事件
    connection.on("ReceiveComment", handleReceivedComment);

    return () => {
      connection.off("ReceiveMessage", handleReceivedComment);
    };
  }, []);
  // comment一有變動就會去抓會員資料
  useEffect(() => {
    console.log(comments);
  }, [comments]);

  return (
    <>
      <h2>{comments.length}則留言</h2>
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

      <div className=" mx-auto mt-10 p-4   rounded-lg shadow-lg space-y-4">
        {comments.map((c) => (
          <div key={c.commentId} className="border-b border-gray-700 pb-4">
            <div className="flex items-center mb-2">
              <div className=" w-8 h-8 mr-3">
                <Avatar>
                  <AvatarImage src={c.sender.thumbnail} />
                  <AvatarFallback>{c.sender.username}</AvatarFallback>
                </Avatar>
              </div>
              <div>
                <p className="font-bold">{c.sender.username}</p>
                <p className="text-xs ">{DateTimeToString(c.date)}</p>
              </div>
            </div>
            <p>{c.commentMsg}</p>
          </div>
        ))}
      </div>
    </>
  );
}

export default TabComments;
