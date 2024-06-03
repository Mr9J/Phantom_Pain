import React, { useState, useEffect } from "react";
import { getOrderProjects } from "@/services/orders.service";
const baseUrl = import.meta.env.VITE_API_BASE_URL;
import "@/css/style.css";
import "@/css/backstageStyle.css";

const Orders = () => {
  const [orderProjects, setOrderProjects] = useState(null);
  const [orderType, setorderType] = useState(1);
  //載入api
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const fetchedOrderProjects = await getOrderProjects();
        setOrderProjects(
          fetchedOrderProjects.map((orderProject) => ({
            ...orderProject,
            isEdit: false,
          }))
        );
        //console.log('fetchedOrderProjectLists:', fetchedOrderProjectLists); // 確認資料是否成功加載
      } catch (error) {
        console.error("Error fetching orderProjects:", error);
      }
    };

    fetchOrders();
  }, []);
  return (
    <>
      <div>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:max-w-none ">
            <h2 className="text-4xl font-bold">專案列表</h2>
            <div className="pt-3">
              {orderType === 1 ? (
                <button
                  type="button"
                  className="text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700"
                >
                  全部
                </button>
              ) : (
                <button
                  type="button"
                  className="text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700"
                  onClick={() => {
                    setorderType(1);
                  }}
                >
                  全部
                </button>
              )}
              {orderType === 2 ? (
                <button
                  type="button"
                  className="text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700"
                >
                  進行中
                </button>
              ) : (
                <button
                  type="button"
                  className="text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700"
                  onClick={() => {
                    setorderType(2);
                  }}
                >
                  進行中
                </button>
              )}
              {orderType === 3 ? (
                <button
                  type="button"
                  className="text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700"
                >
                  已下架
                </button>
              ) : (
                <button
                  type="button"
                  className="text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700"
                  onClick={() => {
                    setorderType(3);
                  }}
                >
                  已下架
                </button>
              )}
            </div>
            <div className="mt-6 space-y-12 lg:grid lg:grid-cols-3 lg:gap-x-6 lg:space-y-0">
              {orderProjects &&
                orderProjects.map((item) => (
                  <div key={item.projectId} className="group relative p-3">
                    <a href={item.projectId}>
                    <div className="relative h-80 w-full overflow-hidden rounded-t-lg sm:aspect-h-1 sm:aspect-w-2 lg:aspect-h-1 lg:aspect-w-1 group-hover:opacity-75 sm:h-64">
                      <img
                        src={item.thumbnail}
                        alt={item.imageAlt}
                        className="h-full w-full object-cover object-center"
                      />
                    </div>
                    <h3 className="mt-6 text-sm">
                        <div style={{ height: 48 }}>
                          <p className="text-base font-semibold line-clamp line-clamp-2">
                            {item.projectName}
                          </p>
                        </div>
                    </h3>
                    <div className="flex items-center justify-end">
                      <p className="text-base font-semibold mr-4">
                        訂單數量: {item.orderCount}
                      </p>
                      <p className="text-base font-semibold">
                        贊助人次: {item.sponsorCount}
                      </p>
                    </div>
                    </a>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Orders;
