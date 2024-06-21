import { useUserContext } from "@/context/AuthContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { typeCommentRequest } from "./types";
import connection from "./signalrService";

function ReplyInput({
  parentId,
  projectId,
}: {
  parentId: number;
  projectId: number;
}) {
  const { isAuthenticated, user } = useUserContext();
  const [input, setInput] = useState<string>("");
  const sendReplyComment = async (reply?: number) => {
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
      projectId: projectId,
      parentId: reply,
    };
    // 呼叫 Hub 送出留言
    connection
      .invoke("SendMessage", newComment)
      .catch((err) => console.error(err));
  };

  return (
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
        placeholder="新增回覆 ..."
        onChange={(e) => setInput(e.currentTarget.value)}
        value={input}
      />
      <Button
        onClick={() => {
          sendReplyComment(parentId);
          setInput("");
        }}
      >
        留言
      </Button>
    </div>
  );
}

export default ReplyInput;
