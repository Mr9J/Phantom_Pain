import LoaderSvg from "@/components/shared/LoaderSvg";
import PostCard from "@/components/shared/PostCard";
import { Button } from "@/components/ui/button";
import { useGetRecentPosts } from "@/lib/react-query/queriesAndMutation";
import { GetPostDTO } from "@/types";
import { useEffect, useState } from "react";

const Social = () => {
  const [page, setPage] = useState(0);
  const [data, setData] = useState([]);

  const {
    data: posts,
    isPending: isPostLoading,
    isError: isErrorPosts,
  } = useGetRecentPosts(page);

  useEffect(() => {
    if (posts) {
      setData([...data, ...posts]);
    }
  }, [posts]);

  return (
    <div className="flex flex-1">
      <div
        className="flex flex-col flex-1 items-center gap-10 overflow-scroll py-10 px-5
      md:px-8 lg:p-14 custom-scrollbar"
      >
        <div className="max-w-screen-sm flex flex-col items-center w-full gap-6 md:gap-9">
          <h2 className="text-[24px] font-bold leading-[140%] tracking-tighte md:text-[30px] text-left w-full">
            Social Feed
          </h2>
          {isPostLoading && !data ? (
            <LoaderSvg />
          ) : (
            <ul className="flex flex-col flex-1 gap-9 w-full">
              {data.map((post: GetPostDTO) => (
                <PostCard post={post} key={post.postId} />
              ))}
            </ul>
          )}
        </div>
        {posts && posts.length === 0 ? (
          <>
            <p className="text-[16px] font-bold leading-[140%]">
              已經沒有更多貼文了...
            </p>
            <Button
              onClick={() => {
                window.location.reload();
              }}
            >
              重新整理
            </Button>
          </>
        ) : (
          <Button
            onClick={() => {
              setPage(page + 1);
            }}
          >
            More
          </Button>
        )}
      </div>
    </div>
  );
};

export default Social;
