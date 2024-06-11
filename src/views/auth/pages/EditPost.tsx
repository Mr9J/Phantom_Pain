import { ImagePlusIcon } from "lucide-react";
import PostForm from "@/components/forms/PostForm";
import { useParams } from "react-router-dom";
import { useGetPostById } from "@/lib/react-query/queriesAndMutation";

const EditPost = () => {
  const { id } = useParams();
  const { data: post, ispending } = useGetPostById(id || "");

  return (
    <div className="flex flex-1">
      <div className="flex flex-col flex-1 items-center gap-10 overflow-scroll py-10 px-5 md:px-8 lg:p-14 custom-scrollbar">
        <div className="max-w-5xl flex justify-start items-center gap-3 w-full">
          <ImagePlusIcon width={36} height={36} />
          <h2 className="text-[24px] font-bold leading-[140%] tracking-tighter md:text-[30px] text-left w-full">
            編輯貼文
          </h2>
        </div>

        <PostForm action="update" post={post} />
      </div>
    </div>
  );
};

export default EditPost;
