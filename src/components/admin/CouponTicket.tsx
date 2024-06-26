import React, { useState, useEffect } from "react";
import { CouponDTO } from "@/types";
import CouponUsedListModal from "./CouponUsedListModal";
const baseUrl = import.meta.env.VITE_API_URL;

type CouponContext = [
  number,
  number,
  string,
  number,
  number,
  number,
  string,
  number
];
type CouponTicketProps = {
  coupon: CouponDTO & { isEdit: boolean };
};
const CouponTicket: React.FC<CouponTicketProps> = ({ coupon }) => {
  const [visibleConponUsedListModal, setvisibleConponUsedListModal] =
    useState(false);
  const [couponID, setcouponID] = useState(0);
  const [visibleBanCouponModal, setBanCouponModal] = useState(false);
  const [formData, setFormData] = useState({});
  const [CouponContext, setCouponContext] = useState<CouponContext>([
    0,
    0,
    "",
    0,
    0,
    0,
    "",
    0,
  ]);
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
    //event.preventDefault(); // 阻止表單默認的提交行為

    const formData = new FormData(event.currentTarget); // 收集表單數據

    const jsonData: Record<string, string> = {};
    formData.forEach((value, key) => {
      jsonData[key] = value as string;
    });
    setFormData(jsonData);

    const url = `${baseUrl}/coupon/${jsonData.id}`;
    const method = "PUT";
    //debug用
    console.log("URL:", url);
    console.log("Method:", method);
    console.log("Data being sent:", jsonData);

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
        setBanCouponModal(false); // 確認表單
      })
      .catch((error) => {
        console.error("提交數據時發生錯誤：", error);
      });
  };
  return (
    <>
      <div className="flex items-center justify-center from-red-100 via-red-300 to-blue-500 bg-gradient-to-br pb-5">
        <div className="p-4 items-center justify-center w-[1250px] rounded-xl group sm:flex space-x-6 bg-gray-200 dark:bg-white bg-opacity-50 shadow-xl hover:rounded-2xl">
          <img
            className="mx-auto block w-3/12 h-40 rounded-lg"
            alt="art cover"
            loading="lazy"
            src={coupon.projectThumbnail}
          />
          <div className="sm:w-8/12 pl-0 p-5">
            <div className="space-y-2">
              <div className="space-y-4">
                {coupon.statusId === 9 && (
                  <h4 className="text-md font-semibold text-cyan-900 text-justify">
                    {coupon.discount}元折價券
                  </h4>
                )}
                {coupon.statusId === 10 && (
                  <h4 className="text-md font-semibold text-cyan-900 text-justify text-decoration-line: line-through">
                    {coupon.discount}元折價券
                  </h4>
                )}
                {coupon.statusId === 9 && (
                  <h4 className="text-md font-semibold text-cyan-900 text-justify">
                    折扣碼:{coupon.code}
                  </h4>
                )}
                {coupon.statusId === 10 && (
                  <h4 className="text-md font-semibold text-cyan-900 text-justify text-decoration-line: line-through">
                    折扣碼:{coupon.code}
                  </h4>
                )}
              </div>
              <div className="flex items-center space-x-4 justify-between">
                <div className="flex gap-3 space-y-1 w-8/12">
                  {/* <img
                    src="https://flowbite.com/docs/images/people/profile-picture-1.jpg"
                    className="rounded-full h-8 w-8"
                  /> */}
                  <span className="text-base  text-black">
                    {coupon.projectName}
                  </span>
                </div>
                <div className=" px-3 py-1 rounded-lg flex space-x-2 flex-row">
                  <div className="text-center text-md justify-center items-center flex">
                    {/* <svg
                      stroke="currentColor"
                      fill="currentColor"
                      stroke-width="0"
                      viewBox="0 0 1024 1024"
                      height="1em"
                      width="1em"
                      xmlns="http://www.w3.org/2000/svg"
                      className="text-md"
                    >
                      <path d="M923 283.6a260.04 260.04 0 0 0-56.9-82.8 264.4 264.4 0 0 0-84-55.5A265.34 265.34 0 0 0 679.7 125c-49.3 0-97.4 13.5-139.2 39-10 6.1-19.5 12.8-28.5 20.1-9-7.3-18.5-14-28.5-20.1-41.8-25.5-89.9-39-139.2-39-35.5 0-69.9 6.8-102.4 20.3-31.4 13-59.7 31.7-84 55.5a258.44 258.44 0 0 0-56.9 82.8c-13.9 32.3-21 66.6-21 101.9 0 33.3 6.8 68 20.3 103.3 11.3 29.5 27.5 60.1 48.2 91 32.8 48.9 77.9 99.9 133.9 151.6 92.8 85.7 184.7 144.9 188.6 147.3l23.7 15.2c10.5 6.7 24 6.7 34.5 0l23.7-15.2c3.9-2.5 95.7-61.6 188.6-147.3 56-51.7 101.1-102.7 133.9-151.6 20.7-30.9 37-61.5 48.2-91 13.5-35.3 20.3-70 20.3-103.3.1-35.3-7-69.6-20.9-101.9zM512 814.8S156 586.7 156 385.5C156 283.6 240.3 201 344.3 201c73.1 0 136.5 40.8 167.7 100.4C543.2 241.8 606.6 201 679.7 201c104 0 188.3 82.6 188.3 184.5 0 201.2-356 429.3-356 429.3z"></path>
                    </svg> */}
                    <span className="text-md mx-1 text-black">
                      剩餘:{coupon.currentStock}張/
                    </span>
                  </div>
                  <div className="text-center text-md justify-center items-center flex">
                    {/* <svg
                      stroke="currentColor"
                      fill="currentColor"
                      stroke-width="0"
                      viewBox="0 0 24 24"
                      height="1em"
                      width="1em"
                      xmlns="http://www.w3.org/2000/svg"
                      className="text-md"
                    >
                      <path d="M20 2H4c-1.103 0-2 .897-2 2v18l5.333-4H20c1.103 0 2-.897 2-2V4c0-1.103-.897-2-2-2zm0 14H6.667L4 18V4h16v12z"></path>
                      <circle cx="15" cy="10" r="2"></circle>
                      <circle cx="9" cy="10" r="2"></circle>
                    </svg> */}
                    <span className="text-md mx-1 text-black">
                      總張數:{coupon.initialStock}張
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-4 justify-between">
                <div className="text-grey-500 flex flex-row space-x-1  my-4 dark:text-black">
                  <svg
                    stroke="currentColor"
                    fill="none"
                    stroke-width="0"
                    viewBox="0 0 24 24"
                    height="1em"
                    width="1em"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    ></path>
                  </svg>
                  <p className="text-sm text-black">{coupon.deadline}</p>
                </div>
                <div className="flex flex-row space-x-1">
                  <button
                    className="bg-blue-600 shadow-lg shadow- shadow-blue-600  text-white cursor-pointer px-3 text-center justify-center items-center py-1 rounded-xl flex space-x-2 flex-row"
                    onClick={() => {
                      setvisibleConponUsedListModal(true);
                      setcouponID(coupon.couponId);
                    }}
                  >
                    <span>使用者列表</span>
                  </button>
                  {coupon.statusId === 9 && (
                    <button
                      className="bg-ban shadow-lg shadow-red-600 text-white cursor-pointer px-3 py-1 text-center justify-center items-center rounded-xl flex space-x-2 flex-row"
                      onClick={() => {
                        setBanCouponModal(!visibleBanCouponModal);
                        setCouponContext([
                          coupon.couponId,
                          coupon.projectId,
                          coupon.code,
                          coupon.discount,
                          coupon.initialStock || 0,
                          coupon.currentStock || 0,
                          coupon.deadline,
                          coupon.statusId,
                        ]);
                      }}
                    >
                      <span>下架</span>
                    </button>
                  )}
                  {coupon.statusId === 10 && (
                    <button
                      className="bg-green-500 shadow-lg shadow-green-600 text-white cursor-pointer px-3 py-1 text-center justify-center items-center rounded-xl flex space-x-2 flex-row"
                      onClick={() => {
                        setBanCouponModal(!visibleBanCouponModal);
                        setCouponContext([
                          coupon.couponId,
                          coupon.projectId,
                          coupon.code,
                          coupon.discount,
                          coupon.initialStock || 0,
                          coupon.currentStock || 0,
                          coupon.deadline,
                          coupon.statusId,
                        ]);
                      }}
                    >
                      <span>上架</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <CouponUsedListModal
        isVisible={visibleConponUsedListModal}
        onClose={() => setvisibleConponUsedListModal(false)}
        couponId={couponID}
      />
      {visibleBanCouponModal && (
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
                onClick={() => setBanCouponModal(false)}
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
                  <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
                    {CouponContext[7] === 9 && <p>您確定將折價券下架嗎？</p>}
                    {CouponContext[7] === 10 && <p>您確定將折價券上架嗎？</p>}
                  </h3>
                  <input
                    type="hidden"
                    name="statusId"
                    {...(CouponContext[7] === 9 && { value: "10" })}
                    {...(CouponContext[7] === 10 && { value: "9" })}
                  />
                  <input type="hidden" name="id" value={CouponContext[0]} />
                  <input
                    type="hidden"
                    name="projectId"
                    value={CouponContext[1]}
                  />
                  <input type="hidden" name="code" value={CouponContext[2]} />
                  <input
                    type="hidden"
                    name="discount"
                    value={CouponContext[3]}
                  />
                  <input
                    type="hidden"
                    name="initialStock"
                    value={CouponContext[4]}
                  />
                  <input
                    type="hidden"
                    name="currentStock"
                    value={CouponContext[5]}
                  />
                  <input
                    type="hidden"
                    name="deadline"
                    value={CouponContext[6]}
                  />
                  <button
                    type="submit"
                    className="text-white bg-green-600 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-300 dark:focus:ring-green-800 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center"
                  >
                    確認
                  </button>
                  <button
                    type="button"
                    onClick={() => setBanCouponModal(false)}
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
    </>
  );
};
export default CouponTicket;
