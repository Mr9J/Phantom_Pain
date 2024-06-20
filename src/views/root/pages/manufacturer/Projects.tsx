import React, { useState, useEffect } from "react";
import numeral from "numeral";
import {
  getUserProject,
  getUserProjectCounts,
} from "@/services/projects.service";
import "@/css/style.css";
import "@/css/backstageStyle.css";
import SearchBar from "@/components/admin/SearchBar";
import ProjectModal from "@/components/admin/ProjectModal";
import ProductModal from "@/components/admin/ProductModal";
import ConfirmModal from "@/components/admin/ConfirmModal";

const baseUrl = import.meta.env.VITE_API_URL;
const frontUrl = import.meta.env.VITE_FRONT_URL;

//計算剩餘天數
function calculateRemainingDays(expireDate: string, startDate: string): number {
  const endDate: Date = new Date(expireDate);
  const startDateObj: Date = new Date(startDate);
  const timeDiff: number = endDate.getTime() - startDateObj.getTime();
  const remainingDays: number = Math.ceil(timeDiff / (1000 * 3600 * 24));
  return remainingDays;
}
const date = new Date();

const Projects = () => {
  const [visibleModal, setModalVisible] = useState(false);
  const [modalText, setModalText] = useState("");
  const [visibleProjectLg, setvisibleProjectModal] = useState(false);
  const [visibleProductLg, setVisibleProductModal] = useState(false);
  const [projectContext, setProjectContext] = useState({});
  const [productContext, setProductContext] = useState({});
  const [productVisible, setProductVisible] = useState<{
    [key: string]: boolean;
  }>({});
  const [selectedImage, setSelectedImage] = useState(null);
  const [projects, setProjects] = useState(null);
  const [formData, setFormData] = useState({});
  const [orderType, setorderType] = useState(1);
  const [projectStatus, setProjectStatus] = useState(-1);
  const [projectCount, setProjectCount] = useState([]);
  const [searchQuery, setSearchQuery] = useState<string>("");

  const filteredProjects =
    projectStatus > 0
      ? projects.filter((item) => item.statusId === projectStatus)
      : projects;
  const filteredProjectsKeyword =
    searchQuery.length > 0
      ? filteredProjects.filter((item) =>
          item.projectName.includes(searchQuery)
        )
      : filteredProjects;

  //下拉式選單
  const productTableClick = (itemId: string) => {
    setProductVisible((prevState) => ({
      ...prevState,
      [itemId]: !prevState[itemId],
    }));
  };
  const [alterText, setAlter] = useState(true);
  const statusMap = {
    1: "募資中",
    2: "下架",
    3: "待審核",
  };
  //圖片處理
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      // 檢查檔案類型是否為圖像
      if (file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const contents = e.target.result;
          setSelectedImage({
            file: file,
            preview: contents, // 用於顯示預覽圖像
          }); // 更新狀態以顯示所選圖像
        };
        reader.readAsDataURL(file); // 以 Data URL 格式讀取檔案內容
      } else {
        alert("請選擇圖像檔案！");
      }
    }
  };

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

  //專案狀態篩選
  useEffect(() => {
    const fetchProjectCount = async () => {
      try {
        const fetchedProjectCount = await getUserProjectCounts();
        fetchedProjectCount.map((item) => ({
          ...item,
          isEdit: false,
        }));
        setProjectCount(fetchedProjectCount);
        //console.log('fetchedProjectCount:', fetchedProjectCount); // 確認資料是否成功加載
      } catch (error) {
        console.error("Error fetching projectCount:", error);
      }
    };
    fetchProjectCount();
  }, []);

  //POST/PUT Modal------------------------------------------------------
  const handleFormSubmit = (event) => {
    event.preventDefault(); // 阻止表單默認的提交行為

    const formData = new FormData(event.target); // 收集表單數據

    if (selectedImage && selectedImage.file instanceof File) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64Image = reader.result.split(",")[1]; // 獲取 Base64 編碼的圖片數據
        formData.append("Thumbnail", base64Image); // 將 Base64 圖片數據添加到 formData 中

        // 準備要發送的數據，可以對數據進行進一步處理或驗證
        const jsonData = {};
        formData.forEach((value, key) => {
          jsonData[key] = value;
        });
        setFormData(jsonData);
        setModalText(
          visibleProductLg
            ? alterText
              ? "您確認要修改這個產品嗎？"
              : "您確認要建立這個產品嗎？"
            : alterText
            ? "您確認要修改這個專案嗎？"
            : "您確認要建立這個專案嗎？"
        );
        setModalVisible(true);
      };
      reader.readAsDataURL(selectedImage.file);
    } else {
      // 如果沒有選擇圖片，則直接處理其他表單數據
      const jsonData = {};
      formData.forEach((value, key) => {
        jsonData[key] = value;
      });
      setFormData(jsonData);
      setModalText(
        visibleProductLg
          ? alterText
            ? "您確認要修改這個產品嗎？"
            : "您確認要建立這個產品嗎？"
          : alterText
          ? "您確認要修改這個專案嗎？"
          : "您確認要建立這個專案嗎？"
      );
      setModalVisible(true);
    }
  };
  const handleConfirmSubmit = () => {
    const url = visibleProductLg
      ? alterText
        ? `${baseUrl}/product/${formData.id}`
        : `${baseUrl}/product`
      : alterText
      ? `${baseUrl}/project/${formData.id}`
      : `${baseUrl}/project`;
    const method = alterText ? "PUT" : "POST";
    //debug用
    //console.log("URL:", url);
    //console.log("Method:", method);
    //console.log("Data being sent:", formData);

    fetch(url, {
      method: method,
      headers: {
        "Content-Type": "application/json", // 指定 Content-Type 為 application/json
      },
      body: JSON.stringify(formData), // 轉換數據為 JSON 字符串並作為請求體
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
        setModalVisible(false); // 確認表單
        if (visibleProductLg) {
          setVisibleProductModal(false);
        } else {
          setvisibleProjectModal(false);
        }
        window.location.reload();
      })
      .catch((error) => {
        console.error("提交數據時發生錯誤：", error);
      });
  };
  const handleSearch = (query: string) => {
    //console.log("Searching for:", query);
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
            {orderType === 1 ? (
              <button
                type="button"
                className="text-white bg-gray-800 hover:bg-gray-700 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-base px-7 py-3 me-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700"
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
            <div style={{ display: "flex" }}>
              <button
                type="button"
                onClick={() => {
                  //setvisibleProjectModal(!visibleProjectLg);
                  //setAlter(false);
                  window.location.href = "/createproject";
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
                <p className="text-base">新增專案</p>
              </button>
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
                    <th style={{ width: 130 }}>
                      <div className="text-smfont-semibold text-center"></div>
                    </th>
                  </tr>
                </thead>
                {
                  //#region 專案-----------------------------------------------------------------------------------
                }
                {projects &&
                  filteredProjectsKeyword.map((item) => (
                    <React.Fragment key={item.projectId}>
                      <tbody className="text-sm font-medium divide-y divide-slate-100 dark:divide-slate-700">
                        {/* Row */}
                        <tr className="hover:bg-gray-100 dark:hover:bg-slate-500">
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
                          <td style={{ width: 130 }} className="text-center">
                            <button
                              type="button"
                              onClick={() => {
                                // setvisibleProjectModal(!visibleProjectLg);
                                // setAlter(true);
                                // setProjectContext([
                                //   item.projectId,
                                //   item.thumbnail,
                                //   item.projectName,
                                //   item.projectDescription,
                                //   item.statusId,
                                //   item.projectGoal,
                                //   item.startDate,
                                //   item.endDate,
                                // ]);
                                window.open(`/editproject/${item.projectId}`);
                              }}
                              className="text-gray-900 bg-white hover:bg-gray-100 border border-gray-200 focus:ring-4 focus:outline-none focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:focus:ring-gray-600 dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:hover:bg-gray-700 me-2 mb-2"
                            >
                              <svg
                                className="w-[20px] h-[20px] fill-[#8e8e8e]"
                                viewBox="0 0 512 512"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path d="M471.6 21.7c-21.9-21.9-57.3-21.9-79.2 0L362.3 51.7l97.9 97.9 30.1-30.1c21.9-21.9 21.9-57.3 0-79.2L471.6 21.7zm-299.2 220c-6.1 6.1-10.8 13.6-13.5 21.9l-29.6 88.8c-2.9 8.6-.6 18.1 5.8 24.6s15.9 8.7 24.6 5.8l88.8-29.6c8.2-2.7 15.7-7.4 21.9-13.5L437.7 172.3 339.7 74.3 172.4 241.7zM96 64C43 64 0 107 0 160V416c0 53 43 96 96 96H352c53 0 96-43 96-96V320c0-17.7-14.3-32-32-32s-32 14.3-32 32v96c0 17.7-14.3 32-32 32H96c-17.7 0-32-14.3-32-32V160c0-17.7 14.3-32 32-32h96c17.7 0 32-14.3 32-32s-14.3-32-32-32H96z"></path>
                              </svg>
                              <div className="text-base font-semibold">
                                修改
                              </div>
                            </button>
                          </td>
                          <td style={{ width: 130 }} className="text-center">
                            <button
                              type="button"
                              className="text-gray-900 bg-white hover:bg-gray-100  focus:ring-4 focus:outline-none focus:ring-gray-100 font-medium rounded-lg text-sm  text-center inline-flex items-center dark:focus:ring-gray-600 dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:hover:bg-gray-700 me-2 mb-2"
                              onClick={() => productTableClick(item.projectId)}
                            >
                              <svg
                                className="w-[30px] h-[30px] fill-[#262626] dark:fill-[#f2f2f2]"
                                viewBox="0 0 512 512"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                {productVisible[item.projectId] ? (
                                  <path d="M256 48a208 208 0 1 1 0 416 208 208 0 1 1 0-416zm0 464A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM135.1 217.4c-4.5 4.2-7.1 10.1-7.1 16.3c0 12.3 10 22.3 22.3 22.3H208v96c0 17.7 14.3 32 32 32h32c17.7 0 32-14.3 32-32V256h57.7c12.3 0 22.3-10 22.3-22.3c0-6.2-2.6-12.1-7.1-16.3L269.8 117.5c-3.8-3.5-8.7-5.5-13.8-5.5s-10.1 2-13.8 5.5L135.1 217.4z"></path>
                                ) : (
                                  <path d="M256 464a208 208 0 1 1 0-416 208 208 0 1 1 0 416zM256 0a256 256 0 1 0 0 512A256 256 0 1 0 256 0zM376.9 294.6c4.5-4.2 7.1-10.1 7.1-16.3c0-12.3-10-22.3-22.3-22.3H304V160c0-17.7-14.3-32-32-32l-32 0c-17.7 0-32 14.3-32 32v96H150.3C138 256 128 266 128 278.3c0 6.2 2.6 12.1 7.1 16.3l107.1 99.9c3.8 3.5 8.7 5.5 13.8 5.5s10.1-2 13.8-5.5l107.1-99.9z"></path>
                                )}
                              </svg>
                            </button>
                          </td>
                        </tr>
                      </tbody>
                      {
                        // #region 產品-----------------------------------------------------------------------------------
                      }
                      {productVisible[item.projectId] && (
                        <React.Fragment>
                          <thead className="text-xs uppercase text-slate-400 dark:text-slate-500 bg-slate-50 dark:bg-slate-700 dark:bg-opacity-50 rounded-sm">
                            <tr>
                              <th className="pl-1">
                                <div className="text-sm font-semibold text-center">
                                  項次
                                </div>
                              </th>
                              <th className="p-2" style={{ width: 600 }}>
                                <div className="text-sm font-semibold text-left">
                                  產品名稱
                                </div>
                              </th>
                              <th className="p-2 pr-4">
                                <div className="text-sm font-semibold text-center">
                                  狀態
                                </div>
                              </th>
                              <th className="p-2" style={{ width: 400 }}>
                                <div className="text-sm font-semibold text-center">
                                  進度(售出/目標)
                                </div>
                              </th>
                              <th className="p-2">
                                <div className="text-sm font-semibold text-center">
                                  剩餘時間
                                </div>
                              </th>
                              <th style={{ width: 130 }}>
                                <div className="text-sm font-semibold text-center">
                                  庫存
                                </div>
                              </th>
                              <th style={{ width: 130 }}>
                                {(orderType === 1 || orderType === 2) && (
                                  <div className="text-smfont-semibold text-center">
                                    <button
                                      type="button"
                                      onClick={() => {
                                        setVisibleProductModal(
                                          !visibleProductLg
                                        );
                                        setAlter(false);
                                        setProductContext([item.projectId]);
                                      }}
                                      className=" text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-2 py-1 text-center inline-flex items-center me-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                                    >
                                      <svg
                                        className="w-[15px] h-[15px] fill-[#f2f2f2]"
                                        viewBox="0 0 448 512"
                                        xmlns="http://www.w3.org/2000/svg"
                                      >
                                        <path d="M256 80c0-17.7-14.3-32-32-32s-32 14.3-32 32V224H48c-17.7 0-32 14.3-32 32s14.3 32 32 32H192V432c0 17.7 14.3 32 32 32s32-14.3 32-32V288H400c17.7 0 32-14.3 32-32s-14.3-32-32-32H256V80z"></path>
                                      </svg>
                                      <p className="text-base">新增產品</p>
                                    </button>
                                  </div>
                                )}
                              </th>
                            </tr>
                          </thead>
                          {item.products.map((product, productIndex) => (
                            <tbody className="text-sm font-medium divide-y divide-slate-100 dark:divide-slate-700 bg-gray-100 dark:bg-gray-900 ">
                              {/* Row */}
                              <tr className="hover:bg-gray-200 dark:hover:bg-slate-500">
                                <td className="pl-1">
                                  <div className="text-base text-slate-800 dark:text-slate-100 text-center">
                                    {" "}
                                    {productIndex + 1}
                                  </div>
                                </td>
                                <td className="p-2">
                                  <div
                                    className="flex items-center"
                                    style={{ width: 600 }}
                                  >
                                    <div className="text-base text-slate-800 dark:text-slate-100">
                                      {product.productName}
                                    </div>
                                  </div>
                                </td>
                                <td className="p-2 pr-4">
                                  <div className="text-base font-semibold text-center">
                                    {statusMap[product.statusId]}
                                  </div>
                                </td>
                                <td className="p-2">
                                  <div className="grid grid-cols-2">
                                    <div className="text-base">
                                      {Math.floor(
                                        ((product.initialStock -
                                          product.currentStock) /
                                          product.initialStock) *
                                          100
                                      )}
                                      %
                                    </div>
                                    <div className="ms-3 text-end">
                                      <small className="text-base">
                                        {product.initialStock -
                                          product.currentStock}
                                        /{product.initialStock}
                                      </small>
                                    </div>
                                  </div>
                                  <div
                                    className="w-full bg-gray-200 rounded-full h-2.5 mb-4 dark:bg-gray-700"
                                    style={{ width: 400 }}
                                  >
                                    {(product.initialStock -
                                      product.currentStock) /
                                      product.quantit >=
                                    0.8 ? (
                                      <div
                                        className="bg-green-600 h-2.5 rounded-full dark:bg-green-500"
                                        style={{
                                          width: `${
                                            ((product.initialStock -
                                              product.currentStock) /
                                              product.initialStock) *
                                            100
                                          }%`,
                                        }}
                                      ></div>
                                    ) : (product.initialStock -
                                        product.currentStock) /
                                        product.quantit >=
                                      0.5 ? (
                                      <div
                                        className="bg-yellow-300 h-2.5 rounded-full dark:bg-yellow-500"
                                        style={{
                                          width: `${
                                            ((product.initialStock -
                                              product.currentStock) /
                                              product.initialStock) *
                                            100
                                          }%`,
                                        }}
                                      ></div>
                                    ) : (
                                      <div
                                        className="bg-rose-600 h-2.5 rounded-full dark:bg-rose-500"
                                        style={{
                                          width: `${
                                            ((product.initialStock -
                                              product.currentStock) /
                                              product.initialStock) *
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
                                    {calculateRemainingDays(
                                      product.endDate,
                                      date
                                    ) < 0
                                      ? 0
                                      : calculateRemainingDays(
                                          product.endDate,
                                          date
                                        )}
                                    天
                                  </div>
                                </td>
                                <td
                                  style={{ width: 130 }}
                                  className="text-center"
                                >
                                  <div className="text-base text-slate-800 dark:text-slate-100 font-semibold">
                                    {product.currentStock}
                                  </div>
                                </td>
                                <td
                                  style={{ width: 130 }}
                                  className="text-center"
                                >
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setVisibleProductModal(!visibleProductLg);
                                      setAlter(true);
                                      setProductContext([
                                        item.projectId,
                                        product.productId,
                                        product.thumbnail,
                                        product.productName,
                                        product.productDescription,
                                        product.statusId,
                                        product.productPrice,
                                        product.initialStock,
                                        product.currentStock,
                                        product.startDate,
                                        product.endDate,
                                      ]);
                                    }}
                                    className="text-gray-900 bg-white hover:bg-gray-100 border border-gray-200 focus:ring-4 focus:outline-none focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:focus:ring-gray-600 dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:hover:bg-gray-700 me-2 mb-2"
                                  >
                                    <svg
                                      className="w-[20px] h-[20px] fill-[#8e8e8e]"
                                      viewBox="0 0 512 512"
                                      xmlns="http://www.w3.org/2000/svg"
                                    >
                                      <path d="M471.6 21.7c-21.9-21.9-57.3-21.9-79.2 0L362.3 51.7l97.9 97.9 30.1-30.1c21.9-21.9 21.9-57.3 0-79.2L471.6 21.7zm-299.2 220c-6.1 6.1-10.8 13.6-13.5 21.9l-29.6 88.8c-2.9 8.6-.6 18.1 5.8 24.6s15.9 8.7 24.6 5.8l88.8-29.6c8.2-2.7 15.7-7.4 21.9-13.5L437.7 172.3 339.7 74.3 172.4 241.7zM96 64C43 64 0 107 0 160V416c0 53 43 96 96 96H352c53 0 96-43 96-96V320c0-17.7-14.3-32-32-32s-32 14.3-32 32v96c0 17.7-14.3 32-32 32H96c-17.7 0-32-14.3-32-32V160c0-17.7 14.3-32 32-32h96c17.7 0 32-14.3 32-32s-14.3-32-32-32H96z"></path>
                                    </svg>
                                    <div className="text-base font-semibold">
                                      修改
                                    </div>
                                  </button>
                                </td>
                              </tr>
                            </tbody>
                          ))}
                        </React.Fragment>
                      )}
                      {
                        //#endregion
                      }
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
      <ConfirmModal
        isVisible={visibleModal}
        onClose={() => setModalVisible(false)}
        onConfirm={handleConfirmSubmit}
        modalText={modalText}
      />
      {
        //#endregion
      }
      {
        //#region 方案選單-----------------------------------------------------------------------------------
      }
      {visibleProjectLg && (
        <ProjectModal
          alterText={alterText}
          projectContext={projectContext}
          setVisibleProjectModal={setvisibleProjectModal}
          handleFormSubmit={handleFormSubmit}
          handleFileChange={handleFileChange}
          selectedImage={selectedImage}
          setSelectedImage={setSelectedImage}
        />
      )}
      {
        //#endregion
      }

      {
        //#region 產品選單-----------------------------------------------------------------------------------
      }
      {visibleProductLg && (
        <ProductModal
          alterText={alterText}
          productContext={productContext}
          orderType={orderType}
          setVisibleProductModal={setVisibleProductModal}
          handleFormSubmit={handleFormSubmit}
          handleFileChange={handleFileChange}
          selectedImage={selectedImage}
          setSelectedImage={setSelectedImage}
        />
      )}
      {
        //#endregion
      }
    </>
  );
};

export default Projects;
