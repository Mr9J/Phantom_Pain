import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import NotFound from "./NotFound";

function ProjectInfo() {
  const { pid } = useParams();
  const URL = import.meta.env.VITE_API_URL;
  const [project, setProject] = useState();

  useEffect(() => {
    (async () => {
      try {
        const res = await axios.get(`${URL}/project/${pid}`);
        setProject(res.data);
      } catch (error) {
        console.error(error);
      }
    })();
  }, [pid, URL]);

  if (!project) return <NotFound></NotFound>;
  console.log(project);

  return (
    <div className="w-full lg:my-8">
      <div className="flex flex-wrap lg:-mx-4">
        {/* 圖片 */}
        <div className="w-full lg:w-7/12 lg:px-4">
          {project && (
            <img
              className="w-full max-w-2xl"
              src={project.thumbnail}
              alt="Project Thumbnail"
            />
          )}
        </div>

        {/* 簡介 */}
        <div className="flex w-full flex-col justify-center px-4 lg:w-3/12">
          <div className="mt-4 text-xs lg:mt-0">
            {/* 提案人 */}
            <div className="text-sm text-gray-500">
              <span className="text-gray-500">提案人 </span>
              <a
                className="text-zec-green font-bold"
                href="/users/2721388?tab=projects"
              ></a>
            </div>
            {/* 專案名稱 */}
            <h1 className="my-4 text-lg font-bold leading-relaxed tracking-wide">
              {project && project.projectName}
            </h1>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProjectInfo;
