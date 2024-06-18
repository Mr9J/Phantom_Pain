import { useState, useEffect } from "react";
import "@/css/style.css";
import "@/css/backstageStyle.css";
import CouponModal from "@/components/admin/CouponModal";
import ConfirmModal from "@/components/admin/ConfirmModal";
import SearchBar from "@/components/admin/SearchBar";
import axios from "axios";
import CouponTicket from "@/components/admin/CouponTicket";
const baseUrl = import.meta.env.VITE_API_URL;

const Coupons = () => {
  const [visibleCreateModal, setvisibleCreateModal] = useState(false);
  const [visibleConfirmModal, setvisibleConfirmModal] = useState(false);
  const [modalText, setModalText] = useState("");
  const [formData, setFormData] = useState({});
  const [searchQuery, setSearchQuery] = useState<string>("");

  const handleFormSubmit = (event) => {
    event.preventDefault(); // 阻止表單默認的提交行為

    const formData = new FormData(event.target); // 收集表單數據

    const jsonData = {};
    formData.forEach((value, key) => {
      jsonData[key] = value;
    });
    setFormData(jsonData);
    setModalText("您確認要建立這個折價券嗎？");
    setvisibleConfirmModal(true);
  };
  const handleConfirmSubmit = () => {
    const url = `${baseUrl}/coupon`;
    const method = "POST";

    //debug用
    console.log("URL:", url);
    console.log("Method:", method);
    console.log("Data being sent:", formData);

    axios({
      method: method,
      url: url,
      headers: {
        "Content-Type": "application/json",
      },
      data: formData,
    })
      .then((response) => {
        console.log("成功提交數據：", response.data);

        setvisibleConfirmModal(false); // 確認表單
        setvisibleCreateModal(false);

        //window.location.reload();
      })
      .catch((error) => {
        if (error.response) {
          console.error("提交數據時發生錯誤：", error.response.data);
        } else {
          console.error("提交數據時發生錯誤：", error.message);
        }
      });
  };
  const handleSearch = (query: string) => {
    console.log("Searching for:", query);
    setSearchQuery(query);
  };
  return (
    <>
      <div>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:max-w-none ">
            <h2 className="text-4xl font-bold">折價券列表</h2>
          </div>
          <div className="pt-4" style={{ display: "flex" }}>
            <button
              type="button"
              onClick={() => {
                setvisibleCreateModal(!visibleCreateModal);
              }}
              className="mb-2 py-2.5 px-5 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm  text-center inline-flex items-center me-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            >
              <svg
                className="w-[15px] h-[15px] fill-[#f2f2f2]"
                viewBox="0 0 448 512"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M256 80c0-17.7-14.3-32-32-32s-32 14.3-32 32V224H48c-17.7 0-32 14.3-32 32s14.3 32 32 32H192V432c0 17.7 14.3 32 32 32s32-14.3 32-32V288H400c17.7 0 32-14.3 32-32s-14.3-32-32-32H256V80z"></path>
              </svg>
              <p className="text-base">新增折價券</p>
            </button>
            <div style={{ marginLeft: "auto" }} className="pb-2">
              <SearchBar onSearch={handleSearch} />
            </div>
          </div>
          <CouponTicket />
        </div>
      </div>
      {visibleCreateModal && (
        <CouponModal
          setVisibleCouponModal={setvisibleCreateModal}
          handleFormSubmit={handleFormSubmit}
        />
      )}
      <ConfirmModal
        isVisible={visibleConfirmModal}
        onClose={() => setvisibleConfirmModal(false)}
        onConfirm={handleConfirmSubmit}
        modalText={modalText}
      />
    </>
  );
};

export default Coupons;
