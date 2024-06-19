import React, { useState, useEffect } from "react";
import { getUserProject } from "@/services/projects.service";
import { getCoupon } from "@/services/coupons.service";

const CouponModal = ({ setVisibleCouponModal, handleFormSubmit }) => {
  const [couponDemo, setCouponDemo] = useState(["", "", "", "", ""]);
  const [projects, setProjects] = useState(null);
  const [coupons, setCoupons] = useState(null);
  const [code, setCode] = useState("");
  const [ErrorFlag, setErrorFlag] = useState("");

  //載入api
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const fetchedProjects = await getUserProject();
        setProjects(
          fetchedProjects.map((project) => ({
            ...project,
            isEdit: false,
          }))
        );
        // console.log('fetchedProjects:', fetchedProjects); // 確認資料是否成功加載
      } catch (error) {
        console.error("Error fetching projects:", error);
      }
    };
    fetchProjects();
  }, []);
  useEffect(() => {
    const fetchCoupons = async () => {
      try {
        const fetchedCoupons = await getCoupon();
        setCoupons(
          fetchedCoupons.map((coupon) => ({
            ...coupon,
            isEdit: false,
          }))
        );
        // console.log('fetchedProjects:', fetchedProjects); // 確認資料是否成功加載
      } catch (error) {
        console.error("Error fetching coupons:", error);
      }
    };
    fetchCoupons();
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();
    const isDuplicate = coupons && coupons.some((item) => item.code === code);
    // 檢查是否有重複的折扣碼
    if (isDuplicate) {
      setErrorFlag("折扣碼已被使用，請使用其他折扣碼");
    } else {
      setErrorFlag("");
      handleFormSubmit(event);
      setVisibleCouponModal(false); // 隱藏模態框
    }
  };
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
              新增折價券
            </h3>
            <button
              onClick={() => {
                setVisibleCouponModal(false);
                setCouponDemo(["", "", "", "", ""]);
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
            <form className="space-y-4" onSubmit={handleSubmit}>
              {/* <form className="space-y-4" onSubmit={(e) => handleFormSubmit(e)}> */}
              <div className="mb-3 flex items-center">
                <button
                  type="button"
                  className="bg-gray-100 text-gray-900 text-base p-1 border border-gray-400"
                  onClick={() => {
                    setCouponDemo([1, "mygo", 9527, 20, "2024-07-30"]);
                    setCode("mygo");
                  }}
                >
                  でも
                </button>
              </div>
              <div className="mb-3 flex items-center">
                <span className="w-1/4 p-1 pl-3 bg-gray-100 border border-gray-300 rounded-l-md text-gray-900">
                  專案名稱
                </span>
                <select
                  aria-label="Default select example"
                  name="projectId"
                  required
                  defaultValue={couponDemo[0]}
                  className="flex-1 p-1 border border-gray-300 text-black rounded-r-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  style={{ maxWidth: "330px", width: "100%" }}
                >
                  <option value="" disabled>
                    請選擇專案
                  </option>
                  {projects &&
                    projects.map((item) => (
                      <option key={item.projectId} value={item.projectId}>
                        {item.projectName}
                      </option>
                    ))}
                </select>
              </div>
              <div className="mb-3 flex items-center">
                <span className="w-1/4 p-1 pl-3 bg-gray-100 border border-gray-300 rounded-l-md text-gray-900">
                  折扣碼
                </span>
                <input
                  type="text"
                  required
                  name="code"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="flex-1 p-1 border border-gray-300 text-black rounded-r-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div className="mb-3 flex items-center">
                <span className="w-1/4 p-1 pl-3 bg-gray-100 border border-gray-300 rounded-l-md text-gray-900">
                  折價
                </span>
                <input
                  type="number"
                  required
                  name="discount"
                  defaultValue={couponDemo[2]}
                  min="1"
                  className="flex-1 p-1 border border-gray-300 text-black rounded-r-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div className="mb-3 flex items-center">
                <span className="w-1/4 p-1 pl-3 bg-gray-100 border border-gray-300 rounded-l-md text-gray-900">
                  發放數量
                </span>
                <input
                  type="number"
                  required
                  name="initialStock"
                  defaultValue={couponDemo[3]}
                  min="1"
                  className="flex-1 p-1 border border-gray-300 text-black rounded-r-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div className="mb-3 flex items-center">
                <span className="w-1/4 p-1 pl-3 bg-gray-100 border border-gray-300 rounded-l-md text-gray-900">
                  結束時間
                </span>
                <input
                  type="date"
                  name="deadline"
                  defaultValue={couponDemo[4]}
                  min={new Date().toISOString().split("T")[0]}
                  onKeyDown={(e) => e.preventDefault()}
                  className="flex-1 p-1 border border-gray-300 text-black rounded-r-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              {ErrorFlag && <p className="text-ban">{ErrorFlag}</p>}
              <button
                type="submit"
                className="w-full text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
              >
                建立折價券
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CouponModal;
