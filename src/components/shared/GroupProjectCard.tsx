import { Project, SimpleUserDTO } from "@/types";
import { Button } from "../ui/button";
import { useGetGroupByProjectId } from "@/lib/react-query/queriesAndMutation";
import { Link } from "react-router-dom";
import userTemp from "@/assets/admin_img/mygo/6.jpg";
import { Fragment } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import GroupForm from "./GroupForm";

type GroupProjectCardProps = {
  project?: Project;
};

const GroupProjectCard = ({ project }: GroupProjectCardProps) => {
  const { data: projectGroups, refetch: refetchGroup } = useGetGroupByProjectId(
    project?.projectId || 0
  );

  return (
    <div className="lg:w-1/3 sm:w-1/2 p-4 ">
      <div className="flex relative">
        <img
          alt="gallery"
          className="absolute inset-0 w-full h-full object-cover object-center"
          src={project?.projectThumbnail}
        />
        <div className="px-8 py-10 relative z-10 w-full border-4 border-gray-200 bg-white opacity-0 hover:opacity-100">
          <h2 className="tracking-widest text-sm title-font font-medium text-indigo-500 mb-1">
            {projectGroups?.groupName || "尚未建立專案群組"}
          </h2>
          <h1 className="title-font text-lg font-medium text-gray-900 mb-3 line-clamp-2">
            {project?.projectName}
          </h1>
          <div className="flex -space-x-2">
            {projectGroups?.users?.length > 0 &&
              projectGroups?.users?.map((user: SimpleUserDTO, index) => (
                <Fragment key={index}>
                  {index < 7 ? (
                    <Link to={`/users/${user?.memberId}`} className="">
                      <img
                        className="inline-block h-10 w-10 rounded-full object-cover ring-2 ring-white"
                        src={user?.thumbnail || userTemp}
                        alt="Group Member"
                      />
                    </Link>
                  ) : (
                    <>
                      {projectGroups?.users?.length == index + 1 && (
                        <div className="flex w-10 h-10 justify-center rounded-full bg-slate-400 ring-2 ring-white items-center">
                          <p className="text-white">
                            +{projectGroups?.users?.length - 7}
                          </p>
                        </div>
                      )}
                    </>
                  )}
                </Fragment>
              ))}
          </div>
          <div className="flex justify-between items-center">
            <Dialog>
              <DialogTrigger asChild>
                <Button className="mt-4 bg-black text-white dark:hover:text-dark-2">
                  {projectGroups?.groupId ? "編輯" : "建立專案群組"}
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>群組設定</DialogTitle>
                  <DialogDescription>
                    如果僅需變更群組名稱，請在新增帳號欄位留空。
                  </DialogDescription>
                </DialogHeader>
                <GroupForm
                  projectGroups={projectGroups}
                  refetchGroup={refetchGroup}
                  action={projectGroups?.groupId ? "update" : "create"}
                  projectId={project?.projectId || 0}
                />
              </DialogContent>
            </Dialog>
            <Button className="mt-4 bg-black text-white dark:hover:text-dark-2">
              <Link to={`/project/${project?.projectId}`}>前往專案</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GroupProjectCard;
