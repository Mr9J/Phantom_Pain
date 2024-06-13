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

  console.log(productsData);
  return (
    <>
      {productsData.map((item: typeProduct) => (
        <div
          key={item.productId}
          style={{ width: "380px" }}
          className="mx-1 cursor-pointer"
          onClick={() =>
            navigate(`/payPage?project=${projectId}&product=${item.productId}`)
          }
        >
          {/* 點擊商品後 href顯示加購及結帳  */}
          {/* <a className="p-4 border-2 border-inherit rounded mb-8 block" href="/paypage"> */}
          <div className="p-4 border-2 border-inherit rounded mb-8 block">
            <img src={`${item.productThumbnail}`} alt="Description" />
            <div className="text-gray-600 font-bold mt-4 mb-2 dark:text-white">
              {item.productName}
            </div>
            <div className="text-black font-bold text-xl items-center dark:text-white">
              NT$ {item.productPrice.toLocaleString()}
              <span className="inline-block text-xs font-bold text-black bg-yellow-300 leading-relaxed px-2 ml-2 rounded-sm">
                帶入幾折
              </span>
              <p className="w-full text-gray-500 font-normal text-xs">
                預定售價
                <span className="line-through">帶入原價</span>
                {/* 這裡要計算打折後省多少還未帶入數 */}
                ，現省 NT$ 6,100
              </p>
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
      ))}
    </>
  );
}

export default ProductCards;
