import { useUserContext } from "@/context/AuthContext";
import { useGetPostsById } from "@/lib/react-query/queriesAndMutation";
import LoaderSvg from "../shared/LoaderSvg";
import { GetPostDTO } from "@/types";
import PostCard from "../shared/PostCard";
import { Button } from "../ui/button";

type PostProfileReviewProps = {
  id?: string;
};

const PostProfileReview = ({ id }: PostProfileReviewProps) => {
  const { user } = useUserContext();
  const { data: posts, isPending } = useGetPostsById(id || "");

  return (
    <div className="flex flex-1">
      <div
        className="flex flex-col flex-1 items-center gap-10 overflow-scroll py-10 px-5
  md:px-8 lg:p-14 custom-scrollbar"
      >
        <div className="max-w-screen-sm flex flex-col items-center w-full gap-6 md:gap-9">
          <h2 className="text-[24px] font-bold leading-[140%] tracking-tighte md:text-[30px] text-left w-full">
            使用者貼文
          </h2>
          {isPending && !posts ? (
            <LoaderSvg />
          ) : (
            <ul className="flex flex-col flex-1 gap-9 w-full">
              {posts?.map((post: GetPostDTO) => (
                <PostCard post={post} key={post.postId} />
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default PostProfileReview;
