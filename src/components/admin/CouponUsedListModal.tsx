import React, { useState, useEffect } from "react";
import { getCouponsUsedList } from "@/services/coupons.service";
interface ModalProps {
  isVisible: boolean;
  onClose: () => void;
  couponId: number;
}
interface CouponItem {
  username: ReactNode;
  id: number;
  thumbnail: string;
  // 其他屬性根據實際情況添加
}
type UsedListResponse = CouponItem[];
const CouponUsedListModal: React.FC<ModalProps> = ({
  isVisible,
  onClose,
  couponId,
}) => {
  if (!isVisible) {
    return null;
  }
  const [usedList, setUsedList] = useState<CouponItem[]>([]); // 使用 CouponItem[] 作為 useState 的泛型參數

  useEffect(() => {
    const fetchUsedList = async (couponId: number) => {
      try {
        const fetchedUsedList: UsedListResponse = await getCouponsUsedList(
          couponId
        );
        const updatedList = fetchedUsedList.map((item) => ({
          ...item,
          isEdit: false,
        }));
        setUsedList(updatedList);
        // console.log('fetchedUsedList:', fetchedUsedList); // 確認資料是否成功加載
      } catch (error) {
        console.error("Error fetching UsedList:", error);
      }
    };

    if (isVisible) {
      fetchUsedList(couponId);
    }
  }, [isVisible, couponId]);

  if (!isVisible) {
    return null;
  }
  return (
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
            onClick={onClose}
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
          <div className="p-4 md:p-5 text-center">
            <p className="text-lg pb-5">使用者列表</p>
            {usedList.map((item) => (
              <div key={item.id} className="flex items-center mb-5">
                <div className="w-10 h-10 mr-2 sm:mr-3">
                  <img
                    className="rounded-full w-10 h-10"
                    src={item.thumbnail}
                    loading="lazy"
                    alt="Thumbnail"
                  />
                </div>
                <h3 className="text-lg font-normal text-gray-500 dark:text-gray-400">
                  <p>{item.username}</p>
                </h3>
              </div>
            ))}
            {usedList.length == 0 && (
              <p className="pb-5">還沒人使用過此折價券</p>
            )}
            <button
              type="button"
              onClick={onClose}
              className="text-white bg-green-600 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-300 dark:focus:ring-green-800 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center"
            >
              確認
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CouponUsedListModal;
