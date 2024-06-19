import PostStats from "@/components/shared/PostStats";
import { useUserContext } from "@/context/AuthContext";
import { useGetPostImg } from "@/lib/react-query/queriesAndMutation";
import { Link } from "react-router-dom";

type ProfileGridProps = {
  post: {
    postId: string;
    userId: string;
    username: string;
    userImg: string;
    caption: string;
    imgUrl: string;
    location: string;
    tags: string;
    postTime: string;
    isAnonymous: string;
  };
  userImg: string;
};

const ProfileGridPosts = ({ post, userImg }: ProfileGridProps) => {
  const { user } = useUserContext();
  const { data: postImg } = useGetPostImg(post.imgUrl);

  if (post === undefined) return null;
  return (
    <>
      <Link
        to={`/posts/${post.postId}`}
        className="flex rounded-[24px] border bg-slate-100 dark:border-dark-4 overflow-hidden cursor-pointer w-full h-full"
      >
        <img
          src={postImg ? `https://cdn.mumumsit158.com/${postImg[0].Key}` : ""}
          alt="post"
          className="object-cover w-full h-full"
        />
      </Link>
      <div className="absolute bottom-0 p-5 flex-between w-full bg-gradient-to-t from-dark-3 to-transparent rounded-b-[24px] gap-2">
        <div className="flex items-center justify-start gap-2 flex-1">
          <img src={userImg} className="w-8 h-8 rounded-full" />
          <p className="line-clamp-1">{post?.username}</p>
        </div>
        <PostStats post={post} userId={user.id} commentDisplay={false} />
      </div>
    </>
  );
};

export default ProfileGridPosts;
