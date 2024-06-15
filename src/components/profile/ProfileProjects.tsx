import { UserProfile } from "@/types";
import logo from "@/assets/_shared_img/logo.png";
import ProjectCard from "./ProjectCard";

const ProfileProjects = ({ user }: { user: UserProfile }) => {
  return (
    <section className="">
      <div className="container px-5 py-6 mx-auto">
        <div className="flex flex-wrap w-full mb-20">
          <div className="lg:w-1/2 w-full mb-6 lg:mb-0">
            <h1 className="sm:text-3xl text-2xl font-medium title-font mb-2">
              過往募資方案
            </h1>
            <div className="h-1 w-20 bg-indigo-500 rounded"></div>
          </div>
          <img src={logo} className="lg:w-1/2 w-full object-cover" />
        </div>
        <div className="flex flex-wrap -m-4">
          {user.projects.map((project) => (
            <div
              className="xl:w-1/4 md:w-1/2 w-full p-4"
              key={project.projectId}
            >
              <ProjectCard project={project} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProfileProjects;
