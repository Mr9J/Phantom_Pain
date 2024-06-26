import React, {
  useState,
  useEffect,
  ChangeEvent,
  useRef,
  useLayoutEffect,
} from "react";
import taiwan_districts from "@/constants/taiwan_districts.json";
import { getProjectfromProductId } from "@/services/projects.service";
import { createOrder, checkProductInventory } from "@/services/orders.service";
import Projectcard from "@/components/ProjectCard/projectcard.jsx";
import { useLocation, useNavigate } from "react-router-dom";
import PaymentForm from "@/components/service/ECPay";
import { useUserContext } from "@/context/AuthContext";
import { getCoupons } from "@/services/coupons.service";

interface ProjectCardDTO {
  projectId: number;
  memberId: number;
  projectGoal: number;
  total: number;
  projectName?: string;
  projectDescription?: string;
  thumbnail?: string;
  member?: MemberDTO | null;
  products?: ProductCardDTO[] | null;
  productInCart?: number[] | null;
  productInCartCount?: number[] | null;
}

interface MemberDTO {
  memberId: number;
  username: string;
  nickname?: string | null;
  thumbnail?: string | null;
  email?: string | null;
  address?: string | null;
  memberIntroduction?: string | null;
  phone?: string | null;
  registrationTime?: Date | null;
}

interface ProductCardDTO {
  productId: number;
  productName?: string | null;
  productDescription?: string | null;
  initialStock: number;
  productPrice: number;
  currentStock: number;
  startDate: Date;
  endDate: Date;
  thumbnail?: string | null;
}

function Paypage() {
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const { user } = useUserContext();
  const submitButtonRef = useRef<HTMLButtonElement>(null);
  const buttonRefs = useRef<{ [key: string]: HTMLButtonElement | null }>({});
  const inputRefs = useRef<{ [key: string]: HTMLInputElement | null }>({});
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const selectedproductId = searchParams.get("product");
  const projectId = searchParams.get("project");
  const fromCartPage = searchParams.get("fromCartPage") === "true";
  const [showModal, setShowModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // const testmemberId = 6;

  const [selectedCity, setSelectedCity] = useState<string>(""); // 存城市名稱
  const [districtsName, setDistrictsName] = useState<JSX.Element[]>([]); // 存區域名稱
  const [isHidden, setIsHidden] = useState(false);
  const [projectAndproductsData, setProjectData] = useState<ProjectCardDTO[]>();
  const [addToPurchase, setPrice] = useState(0);
  const [donationInfo, setDonationInfo] = useState({
    hasDonate: false,
    donationAmount: 0,
  });
  const [inputDonateValue, setInputValue] = useState<string>("0");
  const [paymentMethod, setPaymentMethod] = useState("1");
  const [productCounts, setProductCounts] = useState<{ [key: string]: number }>(
    {}
  );
  const [selectedProductCount, setSelectedProductCount] = useState(
    fromCartPage ? 0 : 1
  );
  const [buttonDisabled, setButtonDisabled] = useState<{
    [key: string]: boolean;
  }>({}); //radio按鈕
  const previousProjectAndproductsData = useRef(projectAndproductsData);
  const [isConfirming, setIsConfirming] = useState(false);
  const [showCoupons, setshowCoupons] = useState(false);
  const [showNotFoundCoupons, setshowNotFoundCoupons] = useState(false);
  const [discount, setDiscount] = useState<number>(0);
  //Demo
  const [address, setAddress] = useState("");
  const [postcode, setPostcode] = useState("");
  const [recipient, setRecipient] = useState(""); //姓名
  const [phone, setPhone] = useState("");
  const [totalAmount, setTotalAmount] = useState<number>(0);
  //Demo
  const navigate = useNavigate();
  const handleConfirm = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    e.preventDefault();
    const button = submitButtonRef.current;
    button && button.click(); //模擬表單提交資料驗證
    const form = document.querySelector("form");
    if (selectedCity === "" || selectedCity === "-選擇-") {
      alert("請選擇縣市");
      return;
    }
    if (parseFloat(inputDonateValue) < 0) {
      alert("加碼贊助金額有誤");
      return;
    }
    if (form && !form.reportValidity()) {
      // 如果表單無效直接返回
      return;
    }
    // console.log(orderData.productdata);
    const response = await checkProductInventory(orderData.productdata); //檢查商品庫存
    if (response === "ok") {
      setIsConfirming(true);
    } else {
      console.log(response);
      await setErrorMessage(response);
      setShowModal(true);
    }
  };

  const handleSubmit = (e) => {
    e.stopPropagation();
    e.preventDefault();
  };

  const handleCancel = () => {
    setIsConfirming(false);
  };

  const handleConfirmButtonClick = async () => {
    if (totalAmount == 0 || totalAmount > 300000) {
      createOrder(orderData);
      setTimeout(() => {
        navigate(`/ReturnURL`);
      }, 3000);
      return;
    }
    // console.log("確認");
    setShowPaymentForm(true);
    setIsConfirming(false);
    await createOrder(orderData);
  };

  //購買資訊
  const [orderData, setOrderData] = useState({
    memberID: user.id,
    paymentMethodID: 1,
    projectID: projectId,
    productID: [selectedproductId],
    productdata: [
      { productId: selectedproductId, count: selectedProductCount },
    ],
    discount: discount,
    donate: 0,
    couponCode: "",
  });

  const handlePaymentMethodChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setPaymentMethod(value);
    setOrderData((orderData) => ({
      ...orderData,
      paymentMethodID: Number(value), // 將 paymentMethodID 設定為 value
    }));
  };

  //觀察orderData變化用
  // useEffect(() => {
  //   console.log(orderData);
  //   console.log(buttonDisabled);
  // }, [orderData, buttonDisabled]);

  // 加購商品，加入集合及左方金額顯示變化
  const AddToPurchase = async (
    e: ChangeEvent<HTMLInputElement>,
    price: number
  ) => {
    const isChecked = e.target.checked;
    const productId = e.target.value;
    if (!productCounts[productId]) {
      return;
    }
    await setButtonDisabled((prevState) => ({
      ...prevState,
      [productId]: !prevState[productId],
    }));

    await setOrderData((orderData) => ({
      ...orderData,
      productdata: isChecked
        ? [
            ...orderData.productdata,
            { productId, count: productCounts[productId] || 0 },
          ]
        : orderData.productdata.filter((item) => item.productId !== productId),
    }));

    await setOrderData((orderData) => ({
      ...orderData,
      productID: orderData.productID.includes(productId)
        ? orderData.productID.filter((id) => id !== productId)
        : [...orderData.productID, productId],
    }));

    await setPrice((prevPrice) =>
      isChecked
        ? (prevPrice += price * (productCounts[productId] || 0))
        : (prevPrice -= price * (productCounts[productId] || 0))
    );
  };
  //載入
  useEffect(() => {
    getProjectfromProductId(Number(projectId), Number(user.id))
      .then((data) => {
        setProjectData(data);
      })
      .catch((error) => {
        console.error("Error fetching project data:", error);
      });
  }, [projectId, user]);

  //測試購物車傳入頁面先行載入資訊，fromCartPage判斷是從哪個頁面進入
  useLayoutEffect(() => {
    if (!fromCartPage) return;
    // console.log("執行幾次");
    if (
      JSON.stringify(projectAndproductsData) !==
      JSON.stringify(previousProjectAndproductsData.current)
    ) {
      previousProjectAndproductsData.current = projectAndproductsData; // 更新前一个状态的值
      projectAndproductsData &&
        projectAndproductsData.forEach(async (item) => {
          if (item.productInCart !== null && item.productInCartCount !== null) {
            await simulateButtonClick(
              item.productInCart,
              item.productInCartCount
            );
          }
        });
      // console.log(buttonRefs.current);
    }
  }, [fromCartPage, projectAndproductsData]);

  //從購物車導入時模擬按鍵點擊自動點選購物車內商品
  const simulateButtonClick = async (
    productInCart: number[] | undefined,
    productInCartCount: number[] | undefined
  ) => {
    if (!productInCart || !productInCartCount) {
      return;
    }

    for (let i = 0; i < productInCart.length; i++) {
      const productId = productInCart[i];
      const clickCount = productInCartCount[i];
      if (buttonRefs.current[productId]) {
        for (let j = 0; j < clickCount; j++) {
          await new Promise((resolve) => setTimeout(resolve, 0)); // 等待前一个点击事件完成
          await buttonRefs.current[productId]?.click();
        }
      }
      inputRefs.current[productId]?.click();
    }
  };
  //限制商品詳細字數顯示
  const truncateText = (text: string, maxLength: number) => {
    if (text.length > maxLength) {
      return text.substring(0, maxLength) + "..."; //截斷並添加省略號
    } else {
      return text;
    }
  };

  //主要商品更新數量
  useEffect(() => {
    // 篩選並更新 productdata 中對應的項目
    setOrderData((prevOrderData) => ({
      ...prevOrderData,
      productdata: prevOrderData.productdata.map((item) => {
        if (item.productId === selectedproductId) {
          return { ...item, count: selectedProductCount };
        }
        return item;
      }),
    }));
  }, [selectedProductCount, selectedproductId]);

  //折價卷
  const EnterToGetCoupons = async (
    event: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (event.key === "Enter") {
      event.preventDefault();
      const value = event.currentTarget.value;

      const discount = await getCoupons(
        value == "" ? "0" : value,
        Number(projectId)
      );
      // console.log("Input value:", value);
      if (discount == "0") {
        await setDiscount(Number(discount));

        await setshowNotFoundCoupons(true);
        await setshowCoupons(false);
        await setOrderData((prevOrderData) => ({
          ...prevOrderData,
          discount: Number(discount),
          couponCode: "",
        }));
        return;
      } else {
        await setDiscount(Number(discount));
        await setshowCoupons(true);
        await setshowNotFoundCoupons(false);
        await setOrderData((prevOrderData) => ({
          ...prevOrderData,
          discount: Number(discount),
          couponCode: value,
        }));
      }
    }
  };

  const handleDonation = (value: string) => {
    if (value === "" || parseFloat(value) === 0) {
      setDonationInfo({
        hasDonate: false,
        donationAmount: 0,
      });
      setOrderData((prevFormData) => ({
        ...prevFormData,
        donate: 0, //如果沒有設置金額 返回0
      }));
    } else {
      const donate = parseFloat(value);
      setOrderData((prevFormData) => ({
        ...prevFormData,
        donate: donate, //更新斗內
      }));
      setDonationInfo({
        hasDonate: true,
        donationAmount: donate,
      });
    }
  };

  const EnterToDonate = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
      handleDonation(event.currentTarget.value);
    }
  };

  const handleBlur = (event: React.FocusEvent<HTMLInputElement>) => {
    handleDonation(event.currentTarget.value);
  };

  //按下斗內
  // const EnterToDonate = (event: React.KeyboardEvent<HTMLInputElement>) => {
  //   if (event.key === "Enter") {
  //     event.preventDefault();
  //     const value = event.currentTarget.value;
  //     if (value === "" || parseFloat(value) === 0) {
  //       setDonationInfo({
  //         hasDonate: false,
  //         donationAmount: 0,
  //       });
  //       setOrderData((prevFormData) => ({
  //         ...prevFormData,
  //         donate: 0, //如果沒有設置金額 返回0
  //       }));
  //     } else {
  //       const donate = parseFloat(value);
  //       setOrderData((prevFormData) => ({
  //         ...prevFormData,
  //         donate: donate, //更新斗內
  //       }));
  //       setDonationInfo({
  //         hasDonate: true,
  //         donationAmount: donate,
  //       });
  //     }
  //   }
  // };
  //斗內輸入變化
  const DonateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const parsedValue = parseFloat(e.target.value);
    setInputValue(isNaN(parsedValue) ? "" : String(parsedValue)); //值轉成字串
  };

  const CityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedCity = e.target.value; // 更新所選的城市
    setSelectedCity(selectedCity);
    const newDistricts = getDistrictsName(selectedCity); // 根據城市變更更新區域
    setDistrictsName(newDistricts);
  };

  // 生成區域列
  const getDistrictsName = (selectedCity: string): JSX.Element[] => {
    const filteredDistricts = taiwan_districts.find(
      (item) => item.name === selectedCity
    );
    return filteredDistricts
      ? filteredDistricts.districts.map((item) => (
          <option key={item.name} value={item.name}>
            {item.name}
          </option>
        ))
      : [];
  };

  const ClickToHidden = () => {
    setIsHidden(!isHidden);
  };

  //商品數量變更(排除主商品)
  const handleDecrease = async (
    e: React.MouseEvent<HTMLButtonElement>,
    productId: number
  ) => {
    e.stopPropagation();
    e.preventDefault();
    const updatedProductCounts = { ...productCounts };
    const currentCount = updatedProductCounts[productId] || 0;
    if (currentCount <= 0) {
      return;
    }
    updatedProductCounts[productId] = currentCount - 1;
    await setProductCounts(updatedProductCounts);
  };

  const handleIncrease = (
    e: React.MouseEvent<HTMLButtonElement>,
    productId: number
  ) => {
    e.stopPropagation();
    e.preventDefault();
    const updatedProductCounts = { ...productCounts };
    updatedProductCounts[productId] =
      (updatedProductCounts[productId] || 0) + 1;
    setProductCounts(updatedProductCounts);
  };

  //Demo
  const handleDemo = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const addressDemo = "復興南路一段390號2樓";
    const postCodeDemo = "106";
    const recipientDemo = "王大槌";
    const phoneDemo = "0956459635";

    await setAddress(addressDemo);
    await setPostcode(postCodeDemo);
    await setRecipient(recipientDemo);
    await setPhone(phoneDemo);
  };

  useEffect(() => {
    if (projectAndproductsData) {
      projectAndproductsData.forEach((item) => {
        item.products!.forEach((pjitem) => {
          if (pjitem.productId.toString() === selectedproductId) {
            const computedTotalAmount =
              pjitem.productPrice * selectedProductCount +
              addToPurchase +
              donationInfo.donationAmount -
              discount;

            setTotalAmount(computedTotalAmount < 0 ? 0 : computedTotalAmount);
          }
        });
      });
    }
  }, [
    projectAndproductsData,
    selectedproductId,
    selectedProductCount,
    addToPurchase,
    donationInfo,
    discount,
  ]);

  const poductlist =
    projectAndproductsData &&
    projectAndproductsData.map((item) => (
      <div key={item.projectId} style={{ display: "flex", flexGrow: "1" }}>
        {item.products &&
          item.products.map((pjitem) => {
            if (pjitem.productId.toString() == selectedproductId) {
              return null;
            }
            ///////////////////
            return (
              <div
                key={pjitem.productId}
                style={{ width: "300px" }}
                className="mx-1 mt-14"
              >
                <label className="bg-zinc-100 rounded-md p-4 leading-none block mb-0 mx-0.5 dark:text-white dark:bg-slate-500">
                  {/* value傳商品id */}
                  <input
                    ref={(buttonRef) => {
                      inputRefs.current[pjitem.productId] = buttonRef;
                    }}
                    className="mr-4"
                    type="checkbox"
                    value={pjitem.productId}
                    disabled={
                      productCounts[pjitem.productId] == undefined ||
                      productCounts[pjitem.productId] == 0
                    }
                    onChange={(e) => AddToPurchase(e, pjitem.productPrice)}
                  />
                  選擇
                </label>
                {/* 點擊商品後 href顯示加購及結帳  */}
                <div
                  className="p-4 border-2 border-inherit rounded mb-8 block dark:bg-slate-800"
                  style={{ width: "300px", height: "615px" }}
                >
                  <img
                    //  src商品圖片
                    className="rounded-md"
                    src={`${pjitem.thumbnail}`}
                    alt="Description"
                  />
                  <div className="text-gray-600 font-extrabold font-mono text-base mt-4 mb-2 dark:text-white">
                    {pjitem.productName}
                  </div>
                  <div className="text-black font-bold text-xl items-center dark:text-white">
                    NT${pjitem.productPrice.toLocaleString()}
                  </div>

                  <div className="text-xs my-2">
                    <span className="text-xs text-white px-2 py-1 bg-rose-700 font-bold inline-block">
                      剩餘 {pjitem.currentStock} 份
                    </span>
                    <span className="text-black px-2 py-1 bg-zinc-100 inline-block">
                      已被贊助
                      <span className="font-bold">
                        {(pjitem.initialStock - pjitem.currentStock).toString()}
                      </span>
                      / {pjitem.initialStock} 次
                    </span>
                  </div>

                  <div className="overflow-y-auto break-all">
                    <div className="text-black text-sm space-y-4 leading-8 dark:text-white">
                      {/* 加入商品敘述 */}
                      <p className="font-sans">
                        {truncateText(pjitem.productDescription!, 70)}
                      </p>
                    </div>

                    <div className="text-center text-xs text-gray-600 pt-4 mt-4 border-t">
                      <div className="flex items-center justify-center space-x-2 mb-4">
                        <button
                          className={`px-3 py-2 bg-gray-200 rounded cursor-pointer font-black hover:bg-slate-300 ${
                            buttonDisabled[pjitem.productId]
                              ? "opacity-50 cursor-not-allowed pointer-events-none bg-slate-500"
                              : ""
                          }`}
                          disabled={buttonDisabled[pjitem.productId]}
                          value={pjitem.productId}
                          onClick={(e) => handleDecrease(e, pjitem.productId)}
                        >
                          -
                        </button>
                        <span className="font-bold dark:text-white">
                          {productCounts[pjitem.productId] || 0}
                        </span>
                        <button
                          ref={(buttonRef) => {
                            buttonRefs.current[pjitem.productId] = buttonRef;
                          }}
                          className={`px-3 py-2 bg-gray-200 rounded cursor-pointer font-black hover:bg-slate-300 ${
                            buttonDisabled[pjitem.productId]
                              ? "opacity-50 cursor-not-allowed pointer-events-none bg-slate-500"
                              : ""
                          }`}
                          disabled={buttonDisabled[pjitem.productId]}
                          value={pjitem.productId}
                          onClick={(e) =>
                            productCounts[pjitem.productId] ==
                            pjitem.currentStock
                              ? ""
                              : handleIncrease(e, pjitem.productId)
                          }
                        >
                          +
                        </button>
                      </div>
                    </div>
                    {item.productInCart &&
                    item.productInCart.includes(pjitem.productId) ? (
                      <span
                        className={`w-full float-right mb-1 rounded-full font-bold text-xs py-2 px-2 text-center leading-none ${
                          (item.productInCartCount &&
                            item.productInCartCount[
                              item.productInCart.indexOf(pjitem.productId)
                            ] <= productCounts[pjitem.productId]) ||
                          0
                            ? "bg-lime-500 text-neutral-600"
                            : "bg-slate-500 text-neutral-300 "
                        }`}
                      >
                        已在購物車內 :{" "}
                        {item.productInCartCount &&
                          item.productInCartCount[
                            item.productInCart.indexOf(pjitem.productId)
                          ]}
                        件
                      </span>
                    ) : (
                      <></>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
      </div>
    ));

  const selectedProduct =
    projectAndproductsData &&
    projectAndproductsData.map((item) => (
      <div key={item.projectId}>
        {item.products &&
          item.products.map((pjitem) => {
            const totalAmount =
              pjitem.productPrice * selectedProductCount +
              addToPurchase +
              donationInfo.donationAmount -
              discount;

            if (pjitem.productId.toString() == selectedproductId)
              return (
                <div key={pjitem.productId}>
                  <div
                    className="w-80 h-auto p-4 border-2 border-inherit rounded my-8 ml-4 block dark:bg-slate-800"
                    key={pjitem.productId}
                  >
                    {/* 更改回饋回上頁 */}
                    {fromCartPage ? (
                      <></>
                    ) : (
                      <div
                        className="float-right mb-3 rounded-full font-bold text-xs py-1 px-2 cursor-pointer bg-neutral-200 text-center text-neutral-600 leading-none dark:text-white dark:bg-slate-600"
                        onClick={() => window.history.back()}
                      >
                        返回贊助
                      </div>
                    )}

                    {/* 點擊商品後 href顯示加購及結帳 */}
                    <img
                      className="rounded-md"
                      src={`${pjitem.thumbnail}`}
                      alt="Description"
                    />
                    <div className="text-gray-600 font-extrabold font-mono text-base mt-4 mb-2 dark:text-white">
                      {pjitem.productName}
                    </div>
                    <div className="text-black font-bold text-2xl items-center dark:text-white">
                      NT${pjitem.productPrice.toLocaleString()}
                    </div>

                    <div className="text-xs my-2">
                      <span className="text-xs text-white px-2 py-1 bg-rose-700 font-bold inline-block">
                        剩餘 {pjitem.currentStock} 份
                      </span>
                      <span className="text-black px-2 py-1 bg-zinc-100 inline-block">
                        已被贊助
                        <span className="font-bold">
                          {(
                            pjitem.initialStock - pjitem.currentStock
                          ).toString()}
                        </span>
                        / {pjitem.initialStock} 次
                      </span>
                    </div>

                    <div className="overflow-y-auto break-all">
                      <div className="text-black text-sm space-y-4 leading-8 dark:text-white">
                        {/* 加入商品敘述 */}
                        <p className="font-sans">
                          {truncateText(pjitem.productDescription!, 150)}
                        </p>
                      </div>

                      <div className="text-center text-xs text-gray-600 pt-4 mt-4 border-t">
                        <div className="flex items-center justify-center space-x-2 mb-3">
                          <button
                            className="px-3 py-2 bg-gray-200 rounded cursor-pointer font-black hover:bg-slate-300"
                            value={pjitem.productId}
                            onClick={(e) => {
                              e.stopPropagation();
                              e.preventDefault();
                              selectedProductCount == 1
                                ? setSelectedProductCount(selectedProductCount)
                                : setSelectedProductCount(
                                    selectedProductCount - 1
                                  );
                            }}
                          >
                            -
                          </button>
                          {fromCartPage ? (
                            <>
                              <span className="font-black dark:text-white">
                                {selectedProductCount}
                              </span>
                              <button
                                ref={(buttonRef) => {
                                  buttonRefs.current[pjitem.productId] =
                                    buttonRef;
                                }}
                                className="px-3 py-2 bg-gray-200 rounded cursor-pointer font-black hover:bg-slate-300"
                                value={pjitem.productId}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  e.preventDefault();
                                  selectedProductCount == pjitem.currentStock
                                    ? ""
                                    : setSelectedProductCount(
                                        selectedProductCount + 1
                                      );
                                }}
                              >
                                +
                              </button>
                            </>
                          ) : (
                            <>
                              <span className="font-black dark:text-white">
                                {selectedProductCount}
                              </span>
                              <button
                                className="px-3 py-2 bg-gray-200 rounded cursor-pointer font-black hover:bg-slate-300"
                                value={pjitem.productId}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  e.preventDefault();
                                  selectedProductCount == pjitem.currentStock
                                    ? ""
                                    : setSelectedProductCount(
                                        selectedProductCount + 1
                                      );
                                }}
                              >
                                +
                              </button>
                            </>
                          )}
                        </div>
                        {item.productInCart &&
                        item.productInCart.includes(pjitem.productId) ? (
                          <span
                            className={`w-full float-right mb-1 rounded-full font-bold text-xs py-2 px-2 text-center leading-none ${
                              item.productInCartCount &&
                              item.productInCartCount[
                                item.productInCart.indexOf(pjitem.productId)
                              ] <= selectedProductCount
                                ? "bg-lime-500 text-neutral-600"
                                : "bg-slate-500 text-neutral-300 "
                            }`}
                          >
                            已在購物車內 :{" "}
                            {item.productInCartCount &&
                              item.productInCartCount[
                                item.productInCart.indexOf(pjitem.productId)
                              ]}
                            件
                          </span>
                        ) : (
                          <></>
                        )}{" "}
                      </div>
                    </div>
                  </div>
                  <div className="border-0 ml-6 w-80">
                    <div className="flex flex-col text-sm py-2 mt-4">
                      <div className="flex">
                        <div className="whitespace-nowrap font-bold text-base">
                          使用
                          <label className="mb-0 inline-block">折扣碼</label>
                        </div>
                        <div className="whitespace-nowrap text-right flex-1">
                          <input
                            className="text-right w-1/2 rounded border-2 text-zec-blue mb-0 focus:outline-none focus:ring-1 text-lg"
                            type="text"
                            onKeyDown={EnterToGetCoupons}
                          />
                        </div>
                      </div>
                      {showCoupons ? (
                        <span className="text-green-400 text-sm font-bold">
                          已帶入折扣碼-{discount}元
                        </span>
                      ) : (
                        ""
                      )}
                      {showNotFoundCoupons ? (
                        <span className="text-rose-400">無效的折扣碼</span>
                      ) : (
                        ""
                      )}

                      <div className="whitespace-nowrap font-bold flex-auto text-lg mt-3">
                        選項金額
                      </div>
                      <div className="whitespace-nowrap text-right text-base">
                        NT${" "}
                        {(
                          pjitem.productPrice * selectedProductCount
                        ).toLocaleString()}
                        <div>
                          <div className="inline-block bg-zinc-100 mr-2 leading-none rounded-full px-2 py-1 dark:bg-rose-600 text-base">
                            加購
                          </div>
                          + NT$ {addToPurchase.toLocaleString()}
                        </div>
                        <div
                          className={`whitespace-nowrap font-bold flex-auto ${
                            donationInfo.hasDonate ? "inline-block" : "hidden"
                          }`}
                        >
                          加碼贊助 :{" "}
                          {donationInfo.donationAmount.toLocaleString()}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-start text-xl pb-2 pt-4 border-t-4 border-gray-300">
                      <div className="whitespace-nowrap font-bold flex-auto text-2xl">
                        總價
                      </div>
                      <div className="whitespace-nowrap text-right font-extrabold text-2xl">
                        {/* 金額正規化顯示.toLocaleString() */}
                        NT$ {totalAmount < 0 ? 0 : totalAmount.toLocaleString()}
                        {/* 條件渲染 PaymentForm */}
                        {showPaymentForm && (
                          <PaymentForm
                            projectName={item.projectName!}
                            totalAmount={
                              pjitem.productPrice * selectedProductCount +
                              addToPurchase +
                              donationInfo.donationAmount -
                              discount
                            }
                          />
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
          })}
      </div>
    ));

  const payment = (
    <div
      className={`px-4 lg:w-2/3 overflow-x-auto ${
        isHidden ? "inline-block" : "hidden"
      }`}
    >
      <button
        className={`dark:text-slate-200 h-auto border-2 border-current rounded p-4 w-full text-left text-neutral-400 hover:text-neutral-600 font-bold ${""} hover:bg-sky-500`}
        type="button"
        onClick={ClickToHidden}
      >
        <span className="align-middle text-sm mr-2"></span>
        顯示品項細節
        <span className="align-middle text-sm ml-2"></span>
      </button>
      <div className="mt-8">
        <label className="font-bold text-sm text-black mb-4 dark:text-slate-300">
          付款方式
        </label>
        <label className="mb-2 mt-2 rounded hover:bg-zinc-200 cursor-pointer bg-zinc-100 px-4 py-2 flex items-center min-h-14 dark:bg-slate-800 dark:hover:bg-slate-600">
          {/* 兩個radio設定同樣name，達成單選效果 */}
          <input
            className="flex-initial"
            type="radio"
            value="1"
            checked={paymentMethod === "1"}
            name="paymentmethod"
            onChange={handlePaymentMethodChange}
          />
          <h3 className="ml-2 flex-1">
            <span className="block font-bold">信用卡付款</span>
            <p className="flex text-xs text-gray-800 mt-1 dark:text-slate-300">
              <span>台新、玉山享 3 期 / 零利率</span>、<span>可用銀聯卡</span>、
              <span>可用國外卡</span>
            </p>
          </h3>
        </label>
        <label className="mb-2 rounded hover:bg-zinc-200 cursor-pointer bg-zinc-100 px-4 py-2 flex items-center min-h-14 dark:bg-slate-800 dark:hover:bg-slate-600">
          <input
            className="zec js-payment-method flex-initial"
            type="radio"
            checked={paymentMethod === "3"}
            value="3"
            name="paymentmethod"
            onChange={handlePaymentMethodChange}
          />
          <h3 className="ml-2 flex-1">
            <span className="block font-bold">ATM 轉帳或銀行臨櫃繳款</span>
            <span className="mt-2 text-xs text-gray-800 dark:text-slate-300">
              需於指定時間內完成付款，超過時限則會取消交易
            </span>
          </h3>
        </label>
        <div className="p-4 border mt-2 rounded border-slate-200">
          <ul className="list-disc m-0 pl-4 text-slate-600 dark:text-slate-300">
            <li>
              您了解您的贊助是支持創意專案的一種方式，也了解創意實踐過程中充滿變數，專案不一定能確保回饋。
            </li>
          </ul>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="mb-2 mt-4 dark:text-slate-300">
            <label className="font-bold text-sm text-black mb-4 dark:text-slate-300 ">
              加碼贊助
            </label>
            （選擇）
          </div>

          <div className="flex rounded border border-neutral-200 focus-within:ring-1 mb-3">
            <div className="inline-flex items-center text-lg text-gray-500 rounded-l p-3 whitespace-nowrap ">
              NT $
            </div>
            <input
              className="w-full flex-1 text-lg pr-2 mb-0 rounded border-transparent dark:bg-slate-800"
              type="number"
              name="price"
              value={inputDonateValue}
              onChange={DonateChange}
              onKeyDown={EnterToDonate}
              onBlur={handleBlur}
              min={0}
            />
          </div>

          <div className="flex">
            <div className="mt-4 flex-auto">
              <label className="font-bold text-sm text-black mb-6 dark:text-slate-300">
                縣市
              </label>
              <select
                className="h-12 px-2 mb-0 w-full rounded border-gray-300 bg-zinc-100 dark:bg-slate-300 dark:text-slate-950"
                onChange={CityChange}
                value={selectedCity}
                required={true}
              >
                <option>-選擇-</option>
                {taiwan_districts.map((item) => (
                  <option key={item.name} value={item.name}>
                    {item.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="mt-4 flex-auto pl-4">
              <label className="font-bold text-sm text-black mb-6 dark:text-slate-300">
                鄉鎮市區
              </label>
              <select
                className="h-12 px-2 mb-0 w-full rounded border-gray-300 bg-zinc-100 dark:bg-slate-300 dark:text-slate-950"
                required={true}
              >
                <option>-選擇-</option>
                {districtsName}
              </select>
            </div>
          </div>
          <div className="flex mt-4">
            <div className="flex-auto">
              <label className="font-bold text-sm text-black mb-4 dark:text-slate-300">
                地址
              </label>
              <input
                required={true}
                autoComplete="street-address"
                className="my-2 h-9 text-base mb-4 w-full rounded border border-gray-300 focus:outline-none focus:ring-1 dark:bg-slate-800"
                type="text"
                name="order[address]"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </div>
            <div className="flex-auto pl-10">
              <label className="font-bold text-sm text-black mb-4 dark:text-slate-300">
                郵遞區號
              </label>
              <input
                required={true}
                autoComplete="postal-code"
                className="my-3 h-9 text-base mb-4 w-full rounded border border-gray-300 focus:outline-none focus:ring-1 dark:bg-slate-800"
                type="text"
                name="order[postcode]"
                value={postcode}
                onChange={(e) => setPostcode(e.target.value)}
              />
            </div>
          </div>
          <label className="font-bold text-sm text-black mb-4 dark:text-slate-300">
            收件人
          </label>
          <input
            required={true}
            placeholder="請輸入真實姓名，以利出貨作業進行"
            className="my-3 h-9 text-base w-full rounded border border-gray-300 focus:outline-none focus:ring-1 placeholder-gray-500 dark:bg-slate-800"
            type="text"
            name="order[recipient]"
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
          />
          <label className="font-bold text-sm text-black mb-4 dark:text-slate-300">
            連絡電話
          </label>
          <input
            required={true}
            placeholder="請填寫真實手機號碼，以利取貨或聯繫收貨"
            maxLength={20}
            minLength={8}
            pattern="[+]{0,1}[0-9]+"
            autoComplete="tel-national"
            className="my-2 h-9 text-base w-full rounded border border-gray-300 focus:outline-none focus:ring-1 placeholder-gray-500 dark:bg-slate-800"
            size={20}
            type="text"
            name="order[phone]"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
          <button
            className="block lg:inline-block font-bold border-2 mt-4 rounded px-16 py-2  hover:text-white hover:bg-sky-500"
            onClick={(e) => handleConfirm(e)}
          >
            立即預購
          </button>
          <button
            className="block lg:inline-block font-bold border-2 mt-4 rounded px-16 py-2  hover:text-white hover:bg-sky-500 ml-20"
            onClick={(e) => handleDemo(e)}
          >
            Demo
          </button>
          <button
            ref={submitButtonRef}
            type="submit"
            style={{ display: "none" }}
          />
        </form>

        {/* 隱藏的submit */}
        {/* 確認對話框 */}
        {isConfirming && (
          <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-4 rounded shadow-lg dark:bg-slate-400 w-96 h-36">
              <p className="font-black text-center text-2xl">
                將前往結帳頁面，確定進行購買嗎?
              </p>
              <div className="flex justify-center mt-2">
                <button
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-green-500 font-bold mr-5 text-base"
                  onClick={handleConfirmButtonClick}
                >
                  確定
                </button>
                <button
                  className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 font-bold text-base"
                  onClick={handleCancel}
                >
                  取消
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <>
      <Projectcard projectData={projectAndproductsData}></Projectcard>
      {/* ml-60 */}
      <div className="container my-8 px-4 mb-8 flex-col lg:flex-row">
        <div className="flex flex-col sm:flex-row mb-10 text-sm -mx-4">
          <div className="px-4 lg:w-1/3 mr-3">{selectedProduct}</div>
          {/* 彈出視窗 */}
          {showModal && (
            <div
              className="modal"
              style={{
                position: "fixed",
                zIndex: 1,
                left: 0,
                top: 0,
                width: "100%",
                height: "100%",
                overflow: "auto",
                backgroundColor: "rgba(0,0,0,0.4)",
              }}
            >
              <div
                className="modal-content"
                style={{
                  backgroundColor: "#fefefe",
                  margin: "15% auto",
                  padding: "20px",
                  border: "1px solid #888",
                  width: "80%",
                }}
              >
                <span className="close" onClick={() => setShowModal(false)}>
                  &times;
                </span>
                <p>{errorMessage}</p>
              </div>
            </div>
          )}
          {/* 輸入交易資料畫面 */}
          {payment}

          <div
            className={`flex px-4 lg:w-2/3 overflow-x-auto ${
              isHidden ? "hidden" : ""
            }`}
          >
            <div style={{ display: "flex", flexGrow: "1" }}>
              {/* MAP顯示加購商品 */}
              {poductlist}
            </div>
          </div>
        </div>
        <button
          className={`border-2 rounded p-4 text-left font-bold w-full lg:w-1/3 ${
            isHidden ? "hidden" : ""
          } hover:bg-sky-500`}
          type="button"
          onClick={ClickToHidden}
        >
          選擇付款方式
        </button>
      </div>
    </>
  );
}

export default Paypage;
