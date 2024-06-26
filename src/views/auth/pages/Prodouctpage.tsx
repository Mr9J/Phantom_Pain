// import './App.css';
import "@/css/productcard.css";
// import PropTypes from 'prop-types';
import { useState, useEffect, MouseEvent } from "react";
// import { getProject } from './api/Project.js';
import { getProjectfromProductId } from "@/services/projects.service";
import { addToCart } from "@/services/Cart.service";
// import { ArrowBack, ArrowForward } from '@mui/icons-material';
import Projectcard from "@/components/ProjectCard/projectcard.jsx";
import { useNavigate, useParams } from "react-router-dom";
import { useUserContext } from "@/context/AuthContext";
import Footer from "@/components/section/Footer";
import { useCartContext } from "@/context/CartContext";

// import { data } from 'autoprefixer';
//寫死的參數

const testmemberId = 6;

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

interface ProductsComponentProps {
  productsData: ProjectCardDTO[] | null;
  getSelectProductId: (productId: number) => void;
  setPopupVisible: (isVisible: boolean) => void;
  pid: string;
}

function ProductsComponent({
  productsData,
  getSelectProductId,
  setPopupVisible,
  pid,
}: ProductsComponentProps) {
  const { user } = useUserContext();
  //購物車數量顯示
  const { fetchCartQuantity } = useCartContext();
  const [productCounts, setProductCounts] = useState<{ [key: string]: number }>(
    {}
  );
  if (!productsData) return null;

  const handleDecrease = (e: MouseEvent, productId: number) => {
    e.stopPropagation();
    e.preventDefault();
    if (productCounts[productId] == undefined) return;
    const updatedCount = Math.max(productCounts[productId] - 1, 0);
    setProductCounts((prevCounts) => ({
      ...prevCounts,
      [productId]: updatedCount,
    }));
  };

  const handleIncrease = (e: MouseEvent, productId: number) => {
    e.stopPropagation();
    e.preventDefault();
    const updatedCount = (productCounts[productId] || 0) + 1;
    setProductCounts((prevCounts) => ({
      ...prevCounts,
      [productId]: updatedCount,
    }));
  };

  const ClickaddToCart = async (e: MouseEvent, productId: number) => {
    // console.log(productCounts[productId]);
    //e.stopPropagation 阻止事件向上傳播到外部 click 事件上
    e.stopPropagation();

    await addToCart(
      productId,
      productCounts[productId],
      Number(pid),
      Number(user.id)
    );
    fetchCartQuantity();
    await setPopupVisible(true);
    //購物車數量顯示
  };

  const listitem =
    productsData &&
    productsData.map((item) => (
      <div key={item.projectId} style={{ display: "flex", flexGrow: "1" }}>
        {item.products &&
          item.products.map((pjitem) => (
            <div
              key={pjitem.productId}
              style={{ width: "380px" }}
              className="mx-1 cursor-pointer"
            >
              {/* 點擊商品後 href顯示加購及結帳  */}
              {/* <a className="p-4 border-2 border-inherit rounded mb-8 block" href="/paypage"> */}
              <div
                className="p-4 border-2 border-inherit rounded mb-8 block"
                onClick={() => getSelectProductId(pjitem.productId)}
              >
                <img
                  //  src商品圖片

                  src={`${pjitem.thumbnail}`}
                  alt="Description"
                />
                <div className="text-gray-600 font-extrabold font-mono text-base mt-4 mb-2 dark:text-white">
                  {pjitem.productName}
                </div>
                <div className="text-black font-bold items-center dark:text-white text-2xl">
                  NT${pjitem.productPrice.toLocaleString()}
                  {/* <span className="inline-block text-xs font-bold text-black bg-yellow-300 leading-relaxed px-2 ml-2 rounded-sm">
                    帶入幾折
                  </span>
                  <p className="w-full text-gray-500 font-normal text-xs">
                    預定售價
                    <span className="line-through">帶入原價</span>
                    ，現省 NT$ 6,100
                  </p> */}
                </div>

                <div className="text-xs my-2">
                  <span className="text-xs text-white px-2 py-1 bg-rose-700 font-bold inline-block">
                    剩餘 {pjitem.currentStock} 份
                  </span>
                  <span className="text-black px-2 py-1 bg-zinc-100 inline-block">
                    已被贊助
                    <span className="font-bold">
                      {pjitem.initialStock - pjitem.currentStock}
                    </span>
                    / {pjitem.initialStock} 次
                  </span>
                </div>

                <div className="overflow-y-auto break-all">
                  {/* <div className="text-black text-sm flex flex-col space-y-4 leading-relaxed"> */}
                  <div className="text-black text-sm space-y-4 leading-8 dark:text-white">
                    {/* 加入商品敘述 */}
                    <p className="font-sans">{pjitem.productDescription}</p>
                  </div>

                  <div
                    className="text-center text-xs text-gray-600 pt-4 mt-4 border-t"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {/* 不要刪 */}
                    <button
                      className="px-3 py-2 mr-1 bg-gray-200 rounded cursor-pointer font-black hover:bg-slate-300"
                      onClick={(e) => handleDecrease(e, pjitem.productId)}
                    >
                      -
                    </button>
                    <span className="font-black dark:text-white">
                      {productCounts[pjitem.productId] || 0}
                    </span>
                    <button
                      className="px-3 py-2 ml-1 bg-gray-200 rounded font-black hover:bg-slate-300"
                      onClick={(e) =>
                        productCounts[pjitem.productId] == pjitem.currentStock
                          ? ""
                          : handleIncrease(e, pjitem.productId)
                      }
                    >
                      +
                    </button>
                    {productCounts[pjitem.productId] === undefined ||
                    productCounts[pjitem.productId] === 0 ? (
                      <button
                        className="ml-7 h-10 rounded-full font-bold text-xs py-1 px-2 text-center text-neutral-300 leading-none opacity-50 cursor-not-allowed bg-slate-500"
                        disabled
                        onClick={(e) => e.stopPropagation()}
                      >
                        加入購物車
                      </button>
                    ) : (
                      <button
                        className={`ml-7 h-10 rounded-full font-bold text-xs py-1 px-2 text-center  bg-orange-600 text-neutral-300 leading-none hover:bg-orange-900 ${
                          productCounts[pjitem.productId] === 0
                            ? "opacity-50 cursor-not-allowed pointer-events-none bg-slate-500"
                            : ""
                        }`}
                        onClick={(e) => ClickaddToCart(e, pjitem.productId)}
                      >
                        加入購物車
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
      </div>
    ));

  return <>{listitem}</>;
}

function Productpage() {
  const { pid } = useParams();
  const navigate = useNavigate();
  const { user } = useUserContext();

  const ClickProductToPaypage = (productId: number) => {
    // 點擊按鈕後導航到其他路由
    // console.log(productId);
    navigate(
      `/Paypage?project=${pid}&product=${productId}&fromCartPage=${false}`
    );
  };

  //後面寫空陣列表示只渲染一次
  const [projectAndproductsData, setProjectData] = useState(null);
  const [isPopupVisible, setPopupVisible] = useState(false);

  useEffect(() => {
    if (isPopupVisible) {
      const timer = setTimeout(() => {
        setPopupVisible(false); //彈出提示 2秒後關閉
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [isPopupVisible]);

  useEffect(() => {
    if (Number(user.id) != 0)
      getProjectfromProductId(Number(pid), Number(user.id))
        .then((data) => {
          setProjectData(data);
        })
        .catch((error) => {
          console.error("Error fetching project data:", error);
        });
  }, [user, pid]);

  // useEffect(() => {
  //   getProjectfromProductId(Number(pid), testmemberId)
  //     .then((data) => {
  //       setProjectData(data);
  //     })
  //     .catch((error) => {
  //       console.error("Error fetching project data:", error);
  //     });
  // }, []);

  // console.log(projectAndproductsData);

  return (
    <>
      {isPopupVisible && (
        <div className="fixed -left-32 sm:left-0 w-full h-full flex items-center justify-center bg-gray-700 bg-opacity-25 z-50">
          <div className="bg-slate-100 p-4 rounded shadow-md w-48 h-30 text-center text-lime-500 font-extrabold text-2xl">
            加入購物車成功!
          </div>
        </div>
      )}
      <Projectcard projectData={projectAndproductsData}></Projectcard>
      {/* 原本是my-60 */}
      <div className="container my-8 px-4 mb-8">
        {/* 這邊有hidden */}
        <div className="h-10 text-center text-xs rounded bg-zinc-100 p-2 font-bold tracking-widest dark:bg-slate-700 dark:text-white">
          {/* material-icons*/}
          <span className="material-icons font-bold"></span>
          <p className="text-sm px-0 py-0 font-mono">左右捲動看看更多選項</p>
          <span className="material-icons"></span>
        </div>

        {/* scrollbar-top */}
        <div className="flex overflow-x-auto scrollbar-top">
          {/* 下面的div是每欄商品產生 */}

          <ProductsComponent
            productsData={projectAndproductsData}
            getSelectProductId={ClickProductToPaypage}
            setPopupVisible={setPopupVisible}
            pid={pid}
          ></ProductsComponent>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default Productpage;
