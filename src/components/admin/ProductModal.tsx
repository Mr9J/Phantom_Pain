import React, { useState } from "react";

const ProductModal = ({
  alterText,
  productContext,
  orderType,
  setVisibleProductModal,
  handleFormSubmit,
  handleFileChange,
  selectedImage,
  setSelectedImage,
}) => {
  const [productDemo, setProductDemo] = useState(["", "", 3, "", "", ""]);
  return (
    <div
      id="authentication-modal"
      tabIndex={-1}
      aria-hidden="true"
      className="fixed inset-0 flex justify-center items-center w-full h-[calc(100%-1rem)] max-h-full overflow-y-auto overflow-x-hidden bg-gray-800 bg-opacity-75"
    >
      <div className="relative p-4 w-full max-w-lg max-h-full">
        {/* Modal content */}
        <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
          {/* Modal header */}
          <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              {alterText ? "修改產品" : "新增產品"}
            </h3>
            <button
              onClick={() => {
                setVisibleProductModal(false);
                setProductDemo(["", "", 1, "", "", ""]);
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
          {/* Modal body */}
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
                      src={productContext[2]}
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
                    className="bg-gray-100 text-gray-900 text-base p-1 border border-gray-400 pr-2"
                    onClick={() => {
                      setProductDemo([
                        "就甘心餒",
                        `如果贊助200元，會獲得：
❶電子郵件感謝函*1
❷ 活動演出紀念限定明信片*1
❸誠摯邀請您前來看表演，一同見證我們的發光時刻🌟`,
                        2,
                        200,
                        10,
                        "2024-06-01",
                        "2024-09-30",
                      ]);
                    }}
                  >
                    Demo1
                  </button>
                  <button
                    type="button"
                    className="bg-gray-100 text-gray-900 text-base p-1 border border-gray-400"
                    onClick={() => {
                      setProductDemo([
                        "致•最親愛的你",
                        `如果贊助500元，會獲得：
❶電子郵件感謝函*1
❷ 活動演出紀念限定明信片*1
❸誠摯邀請您前來看表演，一同見證我們的發光時刻🌟`,
                        2,
                        500,
                        20,
                        "2024-06-01",
                        "2024-09-30",
                      ]);
                    }}
                  >
                    Demo2
                  </button>
                </div>
              )}

              <div className="mb-3 flex items-center">
                <span className="w-1/4 p-1 pl-3 bg-gray-100 border border-gray-300 rounded-l-md text-gray-900">
                  產品名稱
                </span>
                <input
                  type="text"
                  required
                  name="productName"
                  defaultValue={alterText ? productContext[3] : productDemo[0]}
                  className="flex-1 p-1 border border-gray-300 text-black rounded-r-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div className="mb-3 flex items-center">
                <span className="w-1/4 p-1 pl-3 bg-gray-100 border border-gray-300 rounded-l-md text-gray-900">
                  專案內容
                </span>
                <input
                  type="text"
                  required
                  name="productDescription"
                  defaultValue={alterText ? productContext[4] : productDemo[1]}
                  className="flex-1 p-1 border border-gray-300 text-black rounded-r-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              {(orderType === 1 || orderType === 2) && (
                <div className="mb-3 flex items-center">
                  <span className="w-1/4 p-1 pl-3 bg-gray-100 border border-gray-300 rounded-l-md text-gray-900">
                    狀態
                  </span>
                  <select
                    name="statusId"
                    aria-label="Default select example"
                    defaultValue={
                      alterText ? productContext[5] : productDemo[2]
                    }
                    className="flex-1 p-1 border border-gray-300 text-black rounded-r-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="1">募資中</option>
                    <option value="2">下架</option>
                  </select>
                </div>
              )}
              <div className="mb-3 flex items-center">
                <span className="w-1/4 p-1 pl-3 bg-gray-100 border border-gray-300 rounded-l-md text-gray-900">
                  產品金額
                </span>
                <input
                  type="number"
                  min="0"
                  required
                  name="productPrice"
                  defaultValue={alterText ? productContext[6] : productDemo[3]}
                  className="flex-1 p-1 border border-gray-300 text-black rounded-r-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div className="mb-3 flex items-center">
                <span className="w-1/4 p-1 pl-3 bg-gray-100 border border-gray-300 rounded-l-md text-gray-900">
                  庫存量
                </span>
                <input
                  type="number"
                  min="0"
                  required
                  name="initialStock"
                  defaultValue={alterText ? productContext[7] : productDemo[4]}
                  className="flex-1 p-1 border border-gray-300 text-black rounded-r-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              {alterText && (
                <div className="mb-3 flex items-center">
                  <span className="w-1/4 p-1 pl-3 bg-gray-100 border border-gray-300 rounded-l-md text-gray-900">
                    剩餘量
                  </span>
                  <input
                    type="number"
                    min="0"
                    required
                    name="currentStock"
                    defaultValue={
                      alterText ? productContext[8] : productDemo[4]
                    }
                    className="flex-1 p-1 border border-gray-300 text-black rounded-r-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              )}

              <div className="mb-3 flex items-center">
                <span className="w-1/4 p-1 pl-3 bg-gray-100 border border-gray-300 rounded-l-md text-gray-900">
                  開始時間
                </span>
                <input
                  type="date"
                  required
                  name="startDate"
                  defaultValue={alterText ? productContext[9] : productDemo[5]}
                  onKeyDown={(e) => e.preventDefault()}
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
                  defaultValue={alterText ? productContext[10] : productDemo[6]}
                  onKeyDown={(e) => e.preventDefault()}
                  className="flex-1 p-1 border border-gray-300 text-black rounded-r-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              {/* hidden inputs */}
              <input
                type="hidden"
                required
                name="projectId"
                value={productContext[0]}
              />
              <input
                type="hidden"
                required
                name="id"
                value={productContext[1]}
              />
              <input type="hidden" required name="orderBy" value={1} />
              {/* submit button */}
              {alterText ? (
                <button
                  type="submit"
                  className="w-full text-white bg-yellow-500 hover:bg-yellow-500 focus:ring-4 focus:outline-none focus:ring-yellow-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-yellow-500 dark:hover:bg-yellow-500 dark:focus:ring-yellow-500"
                >
                  修改產品
                </button>
              ) : (
                <button
                  type="submit"
                  className="w-full text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
                >
                  建立產品
                </button>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductModal;
