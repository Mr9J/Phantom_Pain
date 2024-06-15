import { Project } from "@/types";
import { Link } from "react-router-dom";
import TruncateText from "../shared/TruncateText";

const ProjectCard = ({ project }: { project: Project }) => {
  return (
    <article className="relative overflow-hidden rounded-lg shadow cursor-pointer hover:bg-gray-900 hover:shadow-2xl hover:shadow-sky-400 transition-shadow group">
      <img
        src={project.projectThumbnail}
        className="absolute inset-0 h-full w-full object-cover group-hover:scale-110 duration-500"
      />
      <div className="relative bg-gradient-to-t group-hover:from-gray-900/50 group-hover:to-gray-900/25 pt-32 sm:pt-48 lg:pt-64">
        <div className="p-4 sm:p-6">
          <div className="w-full min-h-60">
            <div className="absolute w-full left-0 p-5 -bottom-16 duration-500 group-hover:-translate-y-12">
              <div className="absolute -z-10 left-0 w-full h-full opacity-0 duration-500 group-hover:opacity-50 bg-slate-900/50"></div>
              <Link to="/">
                <TruncateText
                  content={project.projectDescription}
                  maxLength={50}
                  textStyles="text-xl font-bold text-slate-100"
                />
              </Link>
              <p className="group-hover:opacity-100 w-full duration-500 opacity-0 text-slate-100">
                {String(project.projectStartDate)} -{" "}
                {String(project.projectEndDate)}
              </p>
              <TruncateText
                content={project.projectDescription}
                maxLength={50}
                textStyles="group-hover:opacity-100 w-full duration-500 opacity-0 text-slate-100"
              />
            </div>
          </div>
        </div>
      </div>
    </article>
  );
};

export default ProjectCard;
