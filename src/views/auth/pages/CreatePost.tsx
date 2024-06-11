import PostForm from "@/components/forms/PostForm";
import { ImagePlusIcon } from "lucide-react";

const CreatePost = () => {
  return (
    <div className="flex flex-1">
      <div className="flex flex-col flex-1 items-center gap-10 overflow-scroll py-10 px-5 md:px-8 lg:p-14 custom-scrollbar">
        <div className="max-w-5xl flex justify-start items-center gap-3 w-full">
          <ImagePlusIcon width={36} height={36} />
          <h2 className="text-[24px] font-bold leading-[140%] tracking-tighter md:text-[30px] text-left w-full">
            新增貼文
          </h2>
        </div>

        <PostForm action="create" />
      </div>
    </div>
  );
};

export default CreatePost;
