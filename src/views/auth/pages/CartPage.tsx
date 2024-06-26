import { useEffect, useLayoutEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getLoadCartPage,
  deleteProductFromCart,
  putProductFromCart,
} from "@/services/Cart.service";
import { useUserContext } from "@/context/AuthContext";
import { useCartContext } from "@/context/CartContext";
import Footer from "@/components/section/Footer";

interface CartDetailDTO {
  projectId: number;
  projectName?: string | null;
  thumbnail?: string | null;
  products?: ProductDataInCartDTO[] | null;
}

interface ProductDataInCartDTO {
  thumbnail?: string | null;
  productId: number;
  productName?: string | null;
  productPrice: number;
  currentStock: number;
  count?: number | null;
  isVisible: boolean;
}

function CartPage() {
  const { user } = useUserContext();
  const [memberCartData, setMemberCartData] = useState<CartDetailDTO[]>();
  const navigate = useNavigate();
  const { fetchCartQuantity } = useCartContext();

  useEffect(() => {
    fetchShoppingCart();
  }, [user]);

  //   useLayoutEffect(() => {
  //     fetchShoppingCart();
  //   }, []);

  const goToPayPage = (
    projectId: number,
    productId: number,
    fromCartPage: boolean
  ) => {
    navigate(
      `/Paypage?project=${projectId}&product=${productId}&fromCartPage=${fromCartPage}`
    );
  };

  const fetchShoppingCart = async () => {
    try {
      const data = await getLoadCartPage(Number(user.id));
      setMemberCartData(data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleIncrement = async (
    projectId: number,
    productId: number,
    increment: string
  ) => {
    try {
      await putProductFromCart(productId, Number(user.id), increment);
      await fetchShoppingCart();
    } catch (error) {
      console.error(error);
    }
    console.log(`projectId:${projectId}productId:${productId}`);

    // 发送增加数量的请求
  };

  const handleDecrement = async (
    projectId: number,
    productId: number,
    decrement: string
  ) => {
    try {
      await putProductFromCart(productId, Number(user.id), decrement);
      await fetchShoppingCart();
    } catch (error) {
      console.error(error);
    }
    console.log(`projectId:${projectId}productId:${productId}`);
  };

  const handleDeleteProduct = async (productId: number) => {
    try {
      await deleteProductFromCart(productId, Number(user.id));
      await fetchShoppingCart();
      await fetchCartQuantity();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      {/* {!isAuth && <Navigate to="/sign-in" />} */}
      <div className="container px-4 mb-8">
        <div className="flex flex-col-reverse lgl:flex-row gap-5">
          <div className="w-[92%] lgl:w-[74%] flex flex-col gap-6  lgl:my-10 mx-auto lgl:ml-5">
            <div className="w-full  bg-white py-7 px-5 dark:bg-slate-800">
              <h1 className="text-4xl font-semibold mb-1">Mumu 購物車</h1>
              <hr />
              <div className="bg-white h-20 dark:bg-slate-900"></div>
              {memberCartData?.length === 0 ? (
                <div className="max-w-4xl mx-auto px-10 py-4 bg-white rounded-lg shadow-lg dark:bg-slate-500">
                  <div className="flex flex-col items-center justify-center py-12">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      className="h-24 w-24 text-gray-400 mb-4"
                    >
                      <path d="M4.00488 16V4H2.00488V2H5.00488C5.55717 2 6.00488 2.44772 6.00488 3V15H18.4433L20.4433 7H8.00488V5H21.7241C22.2764 5 22.7241 5.44772 22.7241 6C22.7241 6.08176 22.7141 6.16322 22.6942 6.24254L20.1942 16.2425C20.083 16.6877 19.683 17 19.2241 17H5.00488C4.4526 17 4.00488 16.5523 4.00488 16ZM6.00488 23C4.90031 23 4.00488 22.1046 4.00488 21C4.00488 19.8954 4.90031 19 6.00488 19C7.10945 19 8.00488 19.8954 8.00488 21C8.00488 22.1046 7.10945 23 6.00488 23ZM18.0049 23C16.9003 23 16.0049 22.1046 16.0049 21C16.0049 19.8954 16.9003 19 18.0049 19C19.1095 19 20.0049 19.8954 20.0049 21C20.0049 22.1046 19.1095 23 18.0049 23Z" />
                    </svg>
                    <p className="text-gray-600 font-semibold mb-4 dark:text-slate-200 text-3xl">
                      你的購物車是空的.
                    </p>
                  </div>
                </div>
              ) : (
                <>
                  {memberCartData &&
                    memberCartData.map((item) => {
                      let totalAmount = 0;
                      return (
                        <div key={item.projectId} className="w-full">
                          <div className="p-0.5 dark:bg-slate-600 bg-yellow-50 h-28 rounded-md">
                            <div className="border-spacing-8 mx-7 my-6">
                              <img
                                className="mx-4 rounded-full float-start w-24"
                                src={item.thumbnail?.toString()}
                                alt="projectImage"
                              />
                              <a
                                href={`/project/${item.projectId}`}
                                className="line-clamp-2 sm:line-clamp-none"
                              >
                                {item.projectName}
                              </a>
                            </div>
                            <br></br>
                          </div>
                          {item.products &&
                            item.products.map((product) => {
                              totalAmount +=
                                product.productPrice * Number(product.count);
                              return (
                                <div
                                  key={product.productId}
                                  className="h-60 sm:h-auto border-b-[2px] border-b-gray-100 p-4 flex flex-col sm:flex-row gap-5 bg-slate-100 rounded-lg my-1 dark:bg-slate-700"
                                >
                                  <div className="float-left w-64">
                                    <img
                                      className="mx-auto"
                                      src={product.thumbnail?.toString()}
                                      alt="productImage"
                                    />
                                  </div>
                                  <div className="w-4/5 flex flex-col -mt-5">
                                    <br />
                                    <h2 className="text-[18px] sm:text-[25px] font-medium -mt-2">
                                      {product.productName}
                                    </h2>
                                    <div className="flex items-center">
                                      {product.count! >=
                                      product.currentStock ? (
                                        <span className="text-orange-800 font-semibold text-[16px] flex-2 mr-5">
                                          到達商品庫存上限 剩餘:
                                          {product.currentStock}份
                                        </span>
                                      ) : (
                                        <span className="text-green-600 font-semibold text-[16px] flex-2 mr-5">
                                          有存貨 剩餘:{product.currentStock}份
                                        </span>
                                      )}

                                      <div className="flex items-center justify-center space-x-2 mb-1">
                                        {Number(product.count) === 1 ? (
                                          <button
                                            className={`px-4 py-2 bg-gray-200 rounded cursor-pointer font-black hover:bg-slate-300 dark:bg-slate-600 dark:hover:bg-slate-500`}
                                          >
                                            -
                                          </button>
                                        ) : (
                                          <button
                                            className={`px-4 py-2 bg-gray-200 rounded cursor-pointer font-black hover:bg-slate-300 dark:bg-slate-600 dark:hover:bg-slate-500`}
                                            onClick={() =>
                                              handleDecrement(
                                                item.projectId,
                                                product.productId,
                                                "Decrement"
                                              )
                                            }
                                          >
                                            -
                                          </button>
                                        )}
                                        <span className="font-bold">
                                          {product.count}
                                        </span>
                                        <button
                                          className={`px-4 py-2 bg-gray-200 rounded cursor-pointer font-black hover:bg-slate-300 dark:bg-slate-600 dark:hover:bg-slate-500`}
                                          onClick={() =>
                                            product.count ==
                                            product.currentStock
                                              ? ""
                                              : handleIncrement(
                                                  item.projectId,
                                                  product.productId,
                                                  "Increment"
                                                )
                                          }
                                        >
                                          +
                                        </button>
                                      </div>
                                      <div className="grow h-14"></div>
                                      <div className="flex flex-row justify-between mt-2">
                                        <span className="float-end mx-6 my-0">
                                          NT${" "}
                                          {(
                                            product.productPrice *
                                            Number(product.count)
                                          ).toLocaleString()}
                                        </span>

                                        <button
                                          className="text-blue-500"
                                          onClick={() =>
                                            handleDeleteProduct(
                                              product.productId
                                            )
                                          }
                                        >
                                          刪除
                                        </button>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              );
                            })}

                          <div className="mb-20 mt-6">
                            <button
                              className="float-end bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded dark:bg-slate-700 dark:text-blue-400 dark:hover:bg-slate-600"
                              onClick={() =>
                                goToPayPage(
                                  item.projectId,
                                  Number(
                                    item.products && item.products[0].productId
                                  ),
                                  true
                                )
                              }
                            >
                              前往結帳
                            </button>
                            <span className="font-bold float-end mt-4 mr-5">
                              總價 NT$ {totalAmount.toLocaleString()}
                            </span>
                          </div>
                          <hr className="my-4 border-white" />
                        </div>
                      );
                    })}
                </>
              )}
            </div>
            <div className="w-full hidden mdl:block bg-white h-16"></div>
            <div className="xs:block mdl:hidden"></div>
          </div>
        </div>
      </div>
      <Footer></Footer>
    </>
  );
}

export default CartPage;
