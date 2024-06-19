import React, { useState, useEffect } from "react";
import numeral from "numeral";
import { getProjects, getProjectCounts } from "@/services/projects.service";
const baseUrl = import.meta.env.VITE_API_URL;
const frontUrl = import.meta.env.VITE_FRONT_URL;
import "@/css/style.css";
import "@/css/backstageStyle.css";
import { ProjectDTO, ProjectCount } from "@/types/index";
import SearchBar from "@/components/admin/SearchBar";

type ProjectContext = [number, string, number, number, number];
//計算剩餘天數
function calculateRemainingDays(expireDate: string, startDate: string): number {
  const endDate: Date = new Date(expireDate);
  const startDateObj: Date = new Date(startDate);
  const timeDiff: number = endDate.getTime() - startDateObj.getTime();
  const remainingDays: number = Math.ceil(timeDiff / (1000 * 3600 * 24));
  return remainingDays;
}
const date = new Date();

const Projects: React.FC = () => {
  const [visibleBanProjectModal, setBanProjectModal] = useState(false);
  const [projectContext, setProjectContext] = useState<ProjectContext>([
    0,
    "",
    0,
    0,
    0,
  ]);
  const [projects, setProjects] = useState<ProjectDTO[] | null>(null);
  const [formData, setFormData] = useState({});
  const [orderType, setorderType] = useState(1); //列表選擇
  const [projectStatus, setProjectStatus] = useState(-1);
  const [projectCount, setProjectCount] = useState<ProjectCount>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");

  const filteredProjects: ProjectDTO[] | null =
    projectStatus > 0
      ? projects?.filter(
          (item: ProjectDTO) => item.statusId === projectStatus
        ) ?? null
      : projects;
  const filteredProjectsKeyword =
    searchQuery.length > 0
      ? filteredProjects?.filter((item) =>
          item.projectName.includes(searchQuery)
        )
      : filteredProjects;

  const statusMap: Record<number, string> = {
    1: "募資中",
    2: "下架",
    3: "待審核",
  };
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

  //專案狀態篩選
  useEffect(() => {
    const fetchProjectCount = async () => {
      try {
        const fetchedProjectCount: ProjectCount = await getProjectCounts();
        setProjectCount(fetchedProjectCount);
        //console.log('fetchedProjectCount:', fetchedProjectCount); // 確認資料是否成功加載
      } catch (error) {
        console.error("Error fetching projectCount:", error);
      }
    };

    fetchProjectCount();
  }, []);
  //Modal
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
    //event.preventDefault(); // 阻止表單默認的提交行為

    const formData = new FormData(event.currentTarget); // 收集表單數據

    const jsonData: Record<string, string> = {};
    formData.forEach((value, key) => {
      jsonData[key] = value as string;
    });
    setFormData(jsonData);

    const url = `${baseUrl}/project/${jsonData.id}`;
    const method = "PUT";
    //debug用
    //console.log("URL:", url);
    //console.log("Method:", method);
    //console.log("Data being sent:", jsonData);

    fetch(url, {
      method: method,
      headers: {
        "Content-Type": "application/json", // 指定 Content-Type 為 application/json
      },
      body: JSON.stringify(jsonData), // 轉換數據為 JSON 字符串並作為請求體
    })
      .then((response) => {
        if (!response.ok) {
          return response.text().then((text) => {
            throw new Error(text);
          });
        }
        return response.json();
      })
      .then((data) => {
        console.log("成功提交數據：", data);
        setBanProjectModal(false); // 確認表單
      })
      .catch((error) => {
        console.error("提交數據時發生錯誤：", error);
      });
  };
  const handleSearch = (query: string) => {
    console.log("Searching for:", query);
    setSearchQuery(query);
  };
  return (
    <>
      <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">
        <div className="col-span-full xl:col-span-8 bg-white dark:bg-slate-800 shadow-lg rounded-sm border border-slate-200 dark:border-slate-700">
          <header className="px-5 py-4 border-b border-slate-100 dark:border-slate-700">
            <h2 className="font-semibold text-slate-800 dark:text-slate-100">
              專案列表
            </h2>
          </header>
          <div className="p-3">
            <div style={{ display: "flex" }}>
              {orderType === 1 ? (
                <button
                  type="button"
                  className="text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-base px-7 py-3 me-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700"
                >
                  全部({projectCount[0]})
                </button>
              ) : (
                <button
                  type="button"
                  className="text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-base px-7 py-3 me-2 mb-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700"
                  onClick={() => {
                    setorderType(1);
                    setProjectStatus(-1);
                  }}
                >
                  全部({projectCount[0]})
                </button>
              )}
              {orderType === 2 ? (
                <button
                  type="button"
                  className="text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-base px-7 py-3 me-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700"
                >
                  進行中({projectCount[1]})
                </button>
              ) : (
                <button
                  type="button"
                  className="text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-base px-7 py-3 me-2 mb-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700"
                  onClick={() => {
                    setorderType(2);
                    setProjectStatus(1);
                  }}
                >
                  進行中({projectCount[1]})
                </button>
              )}
              {orderType === 3 ? (
                <button
                  type="button"
                  className="text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-base px-7 py-3 me-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700"
                >
                  已下架({projectCount[2]})
                </button>
              ) : (
                <button
                  type="button"
                  className="text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-base px-7 py-3 me-2 mb-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700"
                  onClick={() => {
                    setorderType(3);
                    setProjectStatus(2);
                  }}
                >
                  已下架({projectCount[2]})
                </button>
              )}
              {orderType === 4 ? (
                <button
                  type="button"
                  className="text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-base px-7 py-3 me-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700"
                >
                  待審核({projectCount[3]})
                </button>
              ) : (
                <button
                  type="button"
                  className="text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-base px-7 py-3 me-2 mb-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700"
                  onClick={() => {
                    setorderType(4);
                    setProjectStatus(3);
                  }}
                >
                  待審核({projectCount[3]})
                </button>
              )}
              <div style={{ marginLeft: "auto" }} className="pb-2">
                <SearchBar onSearch={handleSearch} />
              </div>
            </div>
            {/* Table */}
            <div className="overflow-x-auto">
              <table className="table-auto w-full dark:text-slate-300">
                {/* Table header */}
                <thead className="text-xs uppercase text-slate-400 dark:text-slate-500 bg-slate-50 dark:bg-slate-700 dark:bg-opacity-50 rounded-sm">
                  <tr>
                    <th className="pl-1">
                      <div className="text-sm font-semibold text-left"></div>
                    </th>
                    <th className="p-2" style={{ width: 600 }}>
                      <div className="text-sm font-semibold text-left">
                        專案名稱
                      </div>
                    </th>
                    <th className="p-2 pr-4">
                      <div className="text-sm font-semibold text-center">
                        狀態
                      </div>
                    </th>
                    <th className="p-2" style={{ width: 400 }}>
                      <div className="text-sm font-semibold text-center">
                        進度
                      </div>
                    </th>
                    <th className="p-2">
                      <div className="text-sm font-semibold text-center">
                        剩餘時間
                      </div>
                    </th>
                    <th style={{ width: 130 }}>
                      <div className="text-sm font-semibold text-center"></div>
                    </th>
                  </tr>
                </thead>
                {
                  //#region 專案-----------------------------------------------------------------------------------
                }
                {projects &&
                  filteredProjectsKeyword &&
                  filteredProjectsKeyword.map((item) => (
                    <React.Fragment key={item.projectId}>
                      <tbody className="text-sm font-medium divide-y divide-slate-100 dark:divide-slate-700">
                        {/* Row */}
                        <tr className="hover:bg-gray-200 dark:hover:bg-slate-500">
                          <td className="pl-1">
                            <img
                              src={item.thumbnail}
                              alt=""
                              className="rounded-full w-10 h-10"
                            />
                          </td>
                          <td className="p-2">
                            <div
                              className="flex items-center"
                              style={{ width: 600 }}
                            >
                              <a
                                href={`${frontUrl}/project/${item.projectId}`}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                <div className="text-base text-slate-800 dark:text-slate-100 underline">
                                  {item.projectName}
                                </div>
                              </a>
                            </div>
                          </td>
                          <td className="p-2 pr-4">
                            <div className="text-base font-semibold text-center">
                              {statusMap[item.statusId]}
                            </div>
                          </td>
                          <td className="p-2">
                            <div className="grid grid-cols-2">
                              <div className="text-base">
                                {Math.floor(
                                  (item.totalAmount / item.projectGoal) * 100
                                )}
                                %
                              </div>
                              <div className="ms-3 text-end">
                                <small className="text-base">
                                  {numeral(item.totalAmount).format("0,0")}/
                                  {numeral(item.projectGoal).format("0,0")}
                                </small>
                              </div>
                            </div>
                            <div
                              className="w-full bg-gray-200 rounded-full h-2.5 mb-4 dark:bg-gray-700"
                              style={{ width: 400 }}
                            >
                              {item.totalAmount / item.projectGoal >= 0.8 ? (
                                <div
                                  className="bg-green-600 h-2.5 rounded-full dark:bg-green-500"
                                  style={{
                                    width: `${
                                      item.totalAmount / item.projectGoal >= 1
                                        ? 100
                                        : (item.totalAmount /
                                            item.projectGoal) *
                                          100
                                    }%`,
                                  }}
                                ></div>
                              ) : item.totalAmount / item.projectGoal >= 0.5 ? (
                                <div
                                  className="bg-yellow-300 h-2.5 rounded-full dark:bg-yellow-500"
                                  style={{
                                    width: `${
                                      item.totalAmount / item.projectGoal >= 1
                                        ? 100
                                        : (item.totalAmount /
                                            item.projectGoal) *
                                          100
                                    }%`,
                                  }}
                                ></div>
                              ) : (
                                <div
                                  className="bg-rose-600 h-2.5 rounded-full dark:bg-rose-500"
                                  style={{
                                    width: `${
                                      item.totalAmount / item.projectGoal >= 1
                                        ? 100
                                        : (item.totalAmount /
                                            item.projectGoal) *
                                          100
                                    }%`,
                                  }}
                                ></div>
                              )}
                            </div>
                          </td>
                          <td className="p-2">
                            <div className="text-base font-semibold fw-semibold text-nowrap text-center">
                              {" "}
                              {calculateRemainingDays(item.endDate, date) < 0
                                ? 0
                                : calculateRemainingDays(item.endDate, date)}
                              天
                            </div>
                          </td>
                          <td style={{ width: 260 }} className="text-center">
                            {Number(item.statusId) === 1 && (
                              <button
                                type="button"
                                onClick={() => {
                                  setBanProjectModal(!visibleBanProjectModal);
                                  setProjectContext([
                                    item.projectId,
                                    item.projectName,
                                    item.projectGoal,
                                    item.startDate,
                                    item.endDate,
                                  ]);
                                }}
                                className="text-slate-50 bg-ban hover:bg-rose-400 border border-gray-200 focus:ring-4 focus:outline-none focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:focus:ring-gray-600 dark:bg-ban dark:border-gray-700 dark:text-white dark:hover:bg-gray-700 me-2 mb-2"
                              >
                                <svg
                                  className="w-[20px] h-[20px] fill-[#ffffff] border-black"
                                  viewBox="0 0 512 512"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path d="M367.2 412.5L99.5 144.8C77.1 176.1 64 214.5 64 256c0 106 86 192 192 192c41.5 0 79.9-13.1 111.2-35.5zm45.3-45.3C434.9 335.9 448 297.5 448 256c0-106-86-192-192-192c-41.5 0-79.9 13.1-111.2 35.5L412.5 367.2zM0 256a256 256 0 1 1 512 0A256 256 0 1 1 0 256z"></path>
                                </svg>
                                <div className="text-base font-semibold">
                                  下架
                                </div>
                              </button>
                            )}
                            {Number(item.statusId) === 3 && (
                              <button
                                type="button"
                                onClick={() => {
                                  setBanProjectModal(!visibleBanProjectModal);
                                  setProjectContext([
                                    item.projectId,
                                    item.projectName,
                                    item.projectGoal,
                                    item.startDate,
                                    item.endDate,
                                  ]);
                                }}
                                className="text-slate-50 bg-green-600 hover:bg-rose-400 border border-gray-200 focus:ring-4 focus:outline-none focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:focus:ring-gray-600 dark:bg-ban dark:border-gray-700 dark:text-white dark:hover:bg-gray-700 me-2 mb-2"
                              >
                                <svg
                                  className="w-[20px] h-[20px] fill-[#ffffff] border-black"
                                  viewBox="0 0 512 512"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM369 209L241 337c-9.4 9.4-24.6 9.4-33.9 0l-64-64c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0l47 47L335 175c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9z"></path>
                                </svg>
                                <div className="text-base font-semibold">
                                  審核通過
                                </div>
                              </button>
                            )}
                          </td>
                        </tr>
                      </tbody>
                    </React.Fragment>
                  ))}
                {
                  //#endregion
                }
              </table>
            </div>
          </div>
        </div>
      </div>
      {
        // #region modal-----------------------------------------------------------------------------------
      }
      {visibleBanProjectModal && (
        <div
          id="popup-modal"
          tabIndex={-1}
          aria-hidden="true"
          className="fixed inset-0 flex justify-center items-center w-full h-[calc(100%-1rem)] max-h-full overflow-y-auto overflow-x-hidden bg-gray-800 bg-opacity-75"
        >
          <div className="relative p-4 w-full max-w-md max-h-full">
            <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
              <button
                type="button"
                onClick={() => setBanProjectModal(false)}
                className="absolute top-3 end-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                data-modal-hide="popup-modal"
              >
                <svg
                  className="w-3 h-3"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 14 14"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                  />
                </svg>
                <span className="sr-only">Close modal</span>
              </button>
              <form className="space-y-4" onSubmit={(e) => handleSubmit(e)}>
                <div className="p-4 md:p-5 text-center">
                  <svg
                    className="mx-auto mb-4 text-gray-400 w-12 h-12 dark:text-gray-200"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 20 20"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M10 11V6m0 8h.01M19 10a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                    />
                  </svg>
                  <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
                    <p>{projectContext[1]}</p>
                    <br />
                    <p>您確定要下架這個專案嗎？</p>
                  </h3>
                  <input type="hidden" required name="statusId" value="2" />
                  <input type="hidden" name="id" value={projectContext[0]} />
                  <input
                    type="hidden"
                    name="projectName"
                    value={projectContext[1]}
                  />
                  <input
                    type="hidden"
                    name="projectGoal"
                    value={projectContext[2]}
                  />
                  <input
                    type="hidden"
                    name="startDate"
                    value={projectContext[3]}
                  />
                  <input
                    type="hidden"
                    name="endDate"
                    value={projectContext[4]}
                  />
                  <button
                    type="submit"
                    className="py-2.5 px-5 ms-3 text-white bg-green-600 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-300 dark:focus:ring-green-800 font-medium rounded-lg text-sm inline-flex items-center text-center"
                  >
                    確認
                  </button>
                  <button
                    type="button"
                    onClick={() => setBanProjectModal(false)}
                    className="py-2.5 px-5 ms-3 text-white bg-rose-600 hover:bg-rose-800 focus:ring-4 focus:outline-none focus:ring-rose-300 dark:focus:ring-rose-800 font-medium rounded-lg text-sm inline-flex items-center text-center"
                  >
                    取消
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
      {
        //#endregion
      }
    </>
  );
};
export default Projects;
