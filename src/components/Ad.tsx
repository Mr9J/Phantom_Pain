/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { getProjects } from "@/services/projects.service";
import { ProjectDTO } from "@/types/index";
const frontUrl = import.meta.env.VITE_FRONT_URL;

interface ModalProps {
  id: string;
}
const randomIndex = Math.floor(Math.random() * 169);

const Ad: React.FC<ModalProps> = ({ id }) => {
  const [projects, setProjects] = useState<ProjectDTO[] | null>(null);

  //載入api
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const fetchedProjects: ProjectDTO[] = await getProjects();
        setProjects(
          fetchedProjects.map((project) => ({
            ...project,
            isEdit: false,
          }))
        );
        //console.log('fetchedProjects:', fetchedProjects); // 確認資料是否成功加載
      } catch (error) {
        console.error("Error fetching projects:", error);
      }
    };
    fetchProjects();
  }, []);
  useEffect(() => {
    if (projects && projects.length > 1) {
      showModal(); // 自动打开对话框
    }
  }, [projects]);
  const showModal = () => {
    const modal = document.getElementById(id) as HTMLDialogElement;
    if (modal) modal.showModal();
  };

  const closeModal = () => {
    const modal = document.getElementById(id) as HTMLDialogElement;
    if (modal) modal.close();
  };

  return (
    <>
      {/* <button className="btn" onClick={showModal}>open modal</button> */}
      <dialog id={id} className="modal">
        <div className="modal-box">
          <form method="dialog">
            <button
              type="button"
              onClick={closeModal}
              className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
            >
              ✕
            </button>
          </form>
          {projects && projects.length > 1 && (
            <a href={`${frontUrl}/project/${projects[randomIndex].projectId}`}>
              <img src={projects[randomIndex].thumbnail} alt="" />
            </a>
          )}
        </div>
      </dialog>
    </>
  );
};

export default Ad;
