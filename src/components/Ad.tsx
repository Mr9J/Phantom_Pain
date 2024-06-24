/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { getProjects } from "@/services/projects.service";
import { ProjectDTO } from "@/types/index";


interface ModalProps {
  id: string;
}
const excludedIndexes = [8, 130, 137, 138, 145, 147, 154, 157, 160]; // 排除的索引
const validIndexes = Array.from({ length: 169 }, (_, i) => i).filter(
  (index) => !excludedIndexes.includes(index)
);
const randomIndex =
  validIndexes[Math.floor(Math.random() * validIndexes.length)];

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
      showModal();
    }
  }, [projects]);
  const showModal = () => {
    const modal = document.getElementById(id) as HTMLDialogElement;
    if (modal) modal.showModal();
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    const modal = document.getElementById(id) as HTMLDialogElement;
    if (modal) modal.close();
    document.body.style.overflow = 'auto';
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
              style={{ backgroundColor: "white" }}
            >
              ✕
            </button>
          </form>
          {projects && projects.length > 1 && (
            <a className="z-50" href={`/project/${projects[randomIndex].projectId}`}>
              <img className="border-4 border-primary aspect-video rounded" src={projects[randomIndex].thumbnail} alt="" />
            </a>
          )}
        </div>
        
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.5)", 
            zIndex: -20, 
          }}
        />
      </dialog>
    </>
  );
};

export default Ad;
