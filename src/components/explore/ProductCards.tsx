import { useNavigate } from "react-router-dom";
import { typeProductCards, typeProduct } from "./types";
// 輸入商品陣列

function ProductCards({
  productsData,
  projectId,
}: {
  productsData: typeProductCards;
  projectId: number;
}) {
  const navigate = useNavigate();
  if (!productsData) return null;

  return (
    <>
      {productsData.map(
        (item: typeProduct) =>
          // 下架中的專案不顯示
          item.status !== 2 && (
            <div
              key={item.productId}
              style={{ width: "380px", position: "relative" }}
              // 庫存為0的商品不能點擊
              className={
                item.currentStock === 0
                  ? "mx-1 cursor-not-allowed rounded "
                  : "mx-1 cursor-pointer rounded "
              }
              onClick={
                item.currentStock === 0
                  ? () => alert("商品已售完，請選擇其他商品")
                  : () =>
                      navigate(
                        `/payPage?project=${projectId}&product=${item.productId}`
                      )
              }
            >
              {/* 新增遮罩層 */}
              {item.currentStock === 0 && (
                <div
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    backgroundColor: "rgba(0, 0, 0, 0.35)", // 調整這裡的數值來改變遮罩的顏色和透明度
                  }}
                  className="rounded-lg"
                ></div>
              )}
              {/* 點擊商品後 href顯示加購及結帳  */}
              {/* <a className="p-4 border-2 border-inherit rounded mb-8 block" href="/paypage"> */}
              <div className="p-4 border-2 border-inherit rounded-lg mb-8 block">
                <img src={`${item.productThumbnail}`} alt="Description" />
                <div className="text-gray-600 font-bold mt-4 mb-2 dark:text-white">
                  {item.productName}
                </div>
                <div className="text-black font-bold text-xl items-center dark:text-white">
                  NT$ {item.productPrice.toLocaleString()}
                </div>

                <div className="text-xs my-2">
                  <span className="text-xs text-white px-2 py-1 bg-rose-700 font-bold inline-block">
                    剩餘 {item.currentStock} 份
                  </span>
                  <span className="text-black px-2 py-1 bg-zinc-100 inline-block">
                    已被贊助
                    <strong className="mx-1">
                      {item.initialStock - item.currentStock}
                    </strong>
                    / {item.initialStock} 次
                  </span>
                </div>

                <div className="overflow-y-auto break-all">
                  {/* <div className="text-black text-sm flex flex-col space-y-4 leading-relaxed"> */}
                  <div className="text-black text-sm space-y-4 leading-8 dark:text-white">
                    {/* 加入商品敘述 */}
                    <p>{item.productDescription}</p>
                  </div>
                </div>
              </div>
            </div>
          )
      )}
    </>
  );
}

export default ProductCards;
