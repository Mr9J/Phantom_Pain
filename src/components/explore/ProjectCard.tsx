import { ProjectPhotoProps } from "@/types";
import { ThumbsUpIcon, RocketIcon, HeartIcon } from "lucide-react";

const ProjectCard = ({
  project,
  index,
}: {
  project: ProjectPhotoProps;
  index: number;
}) => {
  return (
    <div className="flex flex-col p-6 justify-center items-start bg-primary-blue-100 dark:bg-slate-900 hover:bg-white dark:hover:bg-slate-800 hover:shadow-md rounded-3xl">
      <div className="w-full flex justify-between items-start gap-2">
        <h2 className="text-[22px] leading-[26px] font-bold capitalize">
          {project.photographer}
        </h2>
      </div>
      <p className="flex mt-6 text-[32px] leading-[38px] font-extrabold">
        <span className="self-start text-[14px] leading-[17px] font-semibold">
          $
        </span>
        {project.id}
        <span className="self-end text-[14px] leading-[17px] font-medium">
          /day
        </span>
      </p>
      <div className="relative w-full h-40 my-3 object-contain">
        <img
          src={project.imgSrc}
          className="object-cover h-full w-full rounded-lg"
        />
      </div>

      <div className="relative flex w-full mt-2">
        <div className="flex group-hover:invisible w-full justify-between text-grey">
          <div className="flex flex-col justify-center items-center gap-2">
            <RocketIcon className="w-[20px] h-[20px] text-blue-500 hover:text-blue-500" />
            <p className="text-[14px] leading-[17px]">{index * 10}%</p>
          </div>
          <div className="flex flex-col justify-center items-center gap-2">
            <ThumbsUpIcon className="w-[20px] h-[20px] text-blue-500" />
            <p className="text-[14px] leading-[17px]">
              {project.photographer_id}
            </p>
          </div>
          <div className="flex flex-col justify-center items-center gap-2">
            <HeartIcon className="w-[20px] h-[20px] text-blue-500" />
            <p className="text-[14px] leading-[17px]">{project.id}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
