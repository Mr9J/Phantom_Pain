import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SendHorizontal } from "lucide-react";
import { useEffect, useState } from "react";
import axios from "axios";
// import { useUserContext } from "@/context/AuthContext";

function TabComments() {
  // const { user } = useUserContext();
  const URL = import.meta.env.VITE_API_URL;
  const [input, setInput] = useState<string>("");
  const [messages, setMessages] = useState<string[]>([]);

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
      setMessages(res.data);
    })();
  }, []);

  return (
    <>
      <div>
        {messages.map((item, index) => (
          <div key={index} className="list-item">
            <h2>{item.commentMsg}</h2>
            <p>{item.date}</p>
          </div>
        ))}
      </div>

      <div className="flex w-full max-w-sm items-center space-x-2">
        <Input
          placeholder="留下想說的話..."
          onChange={(e) => setInput(e.currentTarget.value)}
        />
        <Button type="submit" onClick={sendComment}>
          <SendHorizontal />
        </Button>
      </div>
    </>
  );
}

export default TabComments;
