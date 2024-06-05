import { useEffect, useState } from "react";
import { getAllProjects } from "@/services/projects.service";

type ProjectProps = {
  projectId: string;
  projectName: string;
  projectDescription: string;
};

const PlayGround = () => {
  const [data, setData] = useState<ProjectProps[]>([]);

  const fetchData = async () => {
    const result = await getAllProjects();
    setData(result);
    console.log(data);
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="flex w-full">
      {data &&
        data.map((project, index) => {
          return (
            <div key={project.projectId + " " + index} className="w-1/3">
              <h1>{project.projectName}</h1>
              <p>{project.projectDescription}</p>
            </div>
          );
        })}
    </div>
  );
};

export default PlayGround;
