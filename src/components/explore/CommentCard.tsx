import { ThumbsUp } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { DateTimeToString } from "./services";
import { typeComment } from "./types";
import ReplyInput from "./ReplyInput";
import { useState } from "react";

function CommentCard({ c, projectId }: { c: typeComment; projectId: number }) {
  const [showReplyInput, setShowReplyInput] = useState(false);
  const toggleReplyInput = () => {
    setShowReplyInput((prevShowChild) => !prevShowChild);
  };

  return (
    <div
      key={c.date}
      className={` border-gray-700 px-4 py-2 rounded-lg ${
        c.isNew ? "animate-bounce bg-blue-200 text-black" : ""
      }`}
    >
      <div className="flex items-center mb-2">
        <div className="w-16 h-16 mr-3">
          <Avatar className="w-16 h-16">
            <AvatarImage src={c.sender.thumbnail} />
            <AvatarFallback>{c.sender.username[0]}</AvatarFallback>
          </Avatar>
        </div>
        <div className="flex-col">
          <p className="font-bold">{c.sender.username}</p>
          <div className="flex">
            <p className="text-xs">{DateTimeToString(c.date)}</p>
            {/* <Button
              variant="ghost"
              className="p-2 h-4 text-xs cursor-pointer ml-1"
              onClick={() => alert("hi")}
            >
              <ThumbsUp width={10} className="mr-1" />
              {c.liked}
            </Button> */}
            <Button
              variant="ghost"
              className="p-2 h-4 text-xs text-gray-400 ml-1"
              onClick={toggleReplyInput}
            >
              {showReplyInput ? "取消回覆" : "回覆"}
            </Button>
          </div>
        </div>
      </div>
      <div>{c.commentMsg}</div>
      {showReplyInput && (
        <ReplyInput parentId={c.commentId} projectId={projectId} />
      )}
    </div>
  );
}

export default CommentCard;
