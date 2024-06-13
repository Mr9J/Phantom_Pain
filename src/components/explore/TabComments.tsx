import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import axios from "axios";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { useUserContext } from "@/context/AuthContext";
import { DateTimeToString } from "./services";
import { typeComment } from "./types";

function TabComments() {
  const { user, isAuthenticated } = useUserContext();
  const URL = import.meta.env.VITE_API_URL;
  const [input, setInput] = useState<string>("");
  const [comments, setComments] = useState<typeComment[]>([]);

  const sendComment = async () => {
    // 呼叫 API 送出留言
    await axios.post(`${URL}/ProjectInfo/SendComment`, {
      CommentMsg: input,
      ProjectId: 100,
      MemberId: 1,
    });
  };

  useEffect(() => {
    (async () => {
      const res = await axios.get(`${URL}/ProjectInfo/GetComments`, {
        params: {
          projectId: 100,
        },
      });
      console.log(res.data);
      setComments(res.data);
    })();
  }, []);

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
        />
        <Button type="submit" onClick={sendComment}>
          留言
        </Button>
      </div>

      <div className="max-w-2xl mx-auto mt-10 p-4 bg-gray-800 text-white rounded-lg shadow-lg space-y-4">
        {comments.map((item, index) => (
          <div key={index} className="border-b border-gray-700 pb-4">
            <div className="flex items-center mb-2">
              <div className=" w-8 h-8 mr-3">
                <Avatar>
                  <AvatarImage src={"/src/assets/admin_img/mygo/6.jpg"} />
                  <AvatarFallback>{user.nickname[0]}</AvatarFallback>
                </Avatar>
              </div>
              <div>
                <p className="font-bold">comment.username</p>
                <p className="text-xs text-gray-400">
                  {DateTimeToString(item.date)}
                </p>
              </div>
            </div>
            <p>{item.commentMsg}</p>
          </div>
        ))}
      </div>
    </>
  );
}

export default TabComments;
