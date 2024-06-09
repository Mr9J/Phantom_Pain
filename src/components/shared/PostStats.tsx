import { GetPostDTO } from "@/types";
import { BookmarkIcon, HeartIcon } from "lucide-react";

type PostStatsProps = {
  post: GetPostDTO;
  userId: string;
};

const PostStats = ({ post, userId }: PostStatsProps) => {
  return (
    <div className="flex justify-between items-center z-20">
      <div className="flex gap-2 mt-2">
        <HeartIcon
          width={20}
          height={20}
          onClick={() => {}}
          className="cursor-pointer"
        />
        <p className="text-[14px] font-medium leading-[140%] lg:text-[16px]">
          0
        </p>
      </div>

      <div className="flex gap-2 mt-2">
        <BookmarkIcon
          width={20}
          height={20}
          onClick={() => {}}
          className="cursor-pointer"
        />
      </div>
    </div>
  );
};

export default PostStats;
