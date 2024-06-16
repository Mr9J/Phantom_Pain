import React, { useState } from "react";
import { useUserContext } from "@/context/AuthContext";
const ProjectModal = ({
  alterText,
  projectContext,
  setVisibleProjectModal,
  handleFormSubmit,
  handleFileChange,
  selectedImage,
  setSelectedImage,
}) => {
  const [projectDemo, setProjectDemo] = useState(["", "", 2, "", "", ""]);
  const { user } = useUserContext();

  return (
    <div
      id="authentication-modal"
      tabIndex={-1}
      aria-hidden="true"
      className="fixed inset-0 flex justify-center items-center w-full h-[calc(100%-1rem)] max-h-full overflow-y-auto overflow-x-hidden bg-gray-800 bg-opacity-75"
    >
      <div className="relative p-4 w-full max-w-lg max-h-full">
        <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
          <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              {alterText ? "修改專案" : "新增專案"}
            </h3>
            <button
              onClick={() => {
                setVisibleProjectModal(false);
                setProjectDemo(["", "", 2, "", "", ""]);
                setSelectedImage("");
              }}
              type="button"
              className="end-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
              data-modal-hide="authentication-modal"
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
          </div>
          <div className="p-4 md:p-5">
            <form className="space-y-4" onSubmit={(e) => handleFormSubmit(e)}>
              <div className="mb-3">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="block w-full text-sm text-gray-900 border-gray-300 cursor-pointer focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                />
                {alterText ? (
                  selectedImage ? (
                    <img
                      src={selectedImage.preview}
                      alt="Selected"
                      className="max-w-full max-h-full"
                    />
                  ) : (
                    <img
                      src={projectContext[1]}
                      alt="Selected"
                      className="max-w-full max-h-full"
                    />
                  )
                ) : selectedImage ? (
                  <img
                    src={selectedImage.preview}
                    alt="Selected"
                    className="max-w-full max-h-full"
                  />
                ) : null}
              </div>
              {!alterText && (
                <div className="mb-3 flex items-center">
                  <button
                    type="button"
                    className="bg-gray-100 text-gray-900 text-base p-1 border border-gray-400"
                    onClick={() => {
                      setProjectDemo([
                        "Marco的Python大補帖",
                        "不買你明天下午就會後悔",
                        3,
                        8000,
                        "2024-05-01",
                        "2024-06-30",
                      ]);
                    }}
                  >
                    由於時間的關係我們這邊使用Demo鍵
                  </button>
                </div>
              )}
              <div className="mb-3 flex items-center">
                <span className="w-1/4 p-1 pl-3 bg-gray-100 border border-gray-300 rounded-l-md text-gray-900">
                  專案名稱
                </span>
                <input
                  type="text"
                  required
                  name="projectName"
                  defaultValue={alterText ? projectContext[2] : projectDemo[0]}
                  className="flex-1 p-1 border border-gray-300 text-black rounded-r-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div className="mb-3 flex items-center">
                <span className="w-1/4 p-1 pl-3 bg-gray-100 border border-gray-300 rounded-l-md text-gray-900">
                  專案內容
                </span>
                <input
                  type="text"
                  name="projectDescription"
                  defaultValue={alterText ? projectContext[3] : projectDemo[1]}
                  className="flex-1 p-1 border border-gray-300 text-black rounded-r-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              {alterText === true && projectContext[4] !== 3 && (
                <div className="mb-3 flex items-center">
                  <span className="w-1/4 p-1 pl-3 bg-gray-100 border border-gray-300 rounded-l-md text-gray-900">
                    狀態
                  </span>
                  <select
                    aria-label="Default select example"
                    name="statusId"
                    defaultValue={
                      alterText ? projectContext[4] : projectDemo[2]
                    }
                    className="flex-1 p-1 border border-gray-300 text-black rounded-r-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="1">募資中</option>
                    <option value="2">下架</option>
                  </select>
                </div>
              )}
              {/* 新建專案或待審核 */}
              {alterText === false ||
                (projectContext[4] === 3 && (
                  <input
                    type="hidden"
                    required
                    name="statusId"
                    defaultValue="3"
                  />
                ))}
              <div className="mb-3 flex items-center">
                <span className="w-1/4 p-1 pl-3 bg-gray-100 border border-gray-300 rounded-l-md text-gray-900">
                  募資目標
                </span>
                <input
                  type="text"
                  required
                  name="projectGoal"
                  defaultValue={alterText ? projectContext[5] : projectDemo[3]}
                  className="flex-1 p-1 border border-gray-300 text-black rounded-r-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div className="mb-3 flex items-center">
                <span className="w-1/4 p-1 pl-3 bg-gray-100 border border-gray-300 rounded-l-md text-gray-900">
                  開始時間
                </span>
                <input
                  type="date"
                  required
                  name="startDate"
                  defaultValue={alterText ? projectContext[6] : projectDemo[4]}
                  className="flex-1 p-1 border border-gray-300 text-black rounded-r-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div className="mb-3 flex items-center">
                <span className="w-1/4 p-1 pl-3 bg-gray-100 border border-gray-300 rounded-l-md text-gray-900">
                  結束時間
                </span>
                <input
                  type="date"
                  required
                  name="endDate"
                  defaultValue={alterText ? projectContext[7] : projectDemo[5]}
                  className="flex-1 p-1 border border-gray-300 text-black rounded-r-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <input
                type="hidden"
                required
                name="memberId"
                defaultValue={user.id}
              />
              <input type="hidden" name="id" value={projectContext[0]} />
              <input type="hidden" name="groupId" value="1" />
              {alterText ? (
                <button
                  type="submit"
                  className="w-full text-white bg-yellow-500 hover:bg-yellow-500 focus:ring-4 focus:outline-none focus:ring-yellow-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-yellow-500 dark:hover:bg-yellow-500 dark:focus:ring-yellow-500"
                >
                  修改專案
                </button>
              ) : (
                <button
                  type="submit"
                  className="w-full text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
                >
                  建立專案
                </button>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectModal;
