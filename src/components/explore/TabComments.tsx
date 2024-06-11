import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SendHorizontal } from "lucide-react";
import { useContext, useState } from "react";
import axios from "axios";
// import { AuthContext } from "@/context/AuthContext"; // Replace "@/path/to/AuthContext" with the actual path to the AuthContext file

function TabComments() {
  // const { user } = useContext(AuthContext);
  const URL = import.meta.env.VITE_API_URL;
  const [message, setMessage] = useState<string>("");

  const sendComment = async () => {
    await axios.post(`${URL}/ProjectInfo/SendComment`, {
      CommentMsg: message,
      ProjectId: 100,
      MemberId: 1,
    });
  };
  return (
    <>
      <div className="flex w-full max-w-sm items-center space-x-2">
        <Input
          placeholder="留下想說的話..."
          onChange={(e) => setMessage(e.currentTarget.value)}
        />
        <Button type="submit" onClick={sendComment}>
          <SendHorizontal />
        </Button>
      </div>
    </>
  );
}

export default TabComments;
