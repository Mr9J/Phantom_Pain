import { UserProfile } from "@/types";
import GroupProjectCard from "../shared/GroupProjectCard";

type GroupProps = {
  id: string;
  userData?: UserProfile;
};

const Group = ({ id, userData }: GroupProps) => {
  return (
    <section className="body-font">
      <div className="container px-5 py-24 mx-auto">
        <div className="flex flex-col text-center w-full mb-20">
          <h2 className="sm:text-3xl text-2xl font-medium title-font mb-4">
            募資專案權限管理
          </h2>
          <p className="lg:w-2/3 mx-auto leading-relaxed text-base">
            您可以在此設定權限，讓其他的使用者也能共同編輯、管理您發起的募資企劃。
          </p>
        </div>
        <div className="flex flex-wrap -m-4">
          {userData?.projects.map((project) => (
            <GroupProjectCard project={project} key={project?.projectId} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Group;
