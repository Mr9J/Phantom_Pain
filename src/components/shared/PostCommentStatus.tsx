import { Button } from "../ui/button";
import { ThumbsDownIcon, ThumbsUpIcon } from "lucide-react";

const PostCommentStatus = () => {
  return (
    <div className="flex justify-center items-center">
      <Button variant="link">
        <ThumbsUpIcon width={16} height={16} />
        <p className="text-base pl-1">0</p>
      </Button>
      <Button variant="link">
        <ThumbsDownIcon width={16} height={16} />{" "}
        <p className="text-base pl-1">0</p>
      </Button>
    </div>
  );
};

export default PostCommentStatus;
