import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import numeral from "numeral";
import axios from "axios";
import { Order } from "@/types/index";
import "@/css/style.css";
import "@/css/backstageStyle.css";

const baseUrl = import.meta.env.VITE_API_URL;

interface OrderListProps {
  projectId: number;
}

const OrderList: React.FC<OrderListProps> = () => {
  const [orderList, setOrderList] = useState<Order[] | null>(null);
  const { projectId } = useParams();

  //載入api
  const getOrderList = async (projectId: number) => {
    try {
      const response = await axios.get(`${baseUrl}/Order/Project/${projectId}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching orderProjects:", error);
      throw error;
    }
  };

  if (projectId !== undefined && !isNaN(Number(projectId))) {
    getOrderList(Number(projectId));
  }

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const fetchedOrderProjects = await getOrderList(Number(projectId));
        setOrderList(
          fetchedOrderProjects.map((order: Order) => ({
            ...order,
            isEdit: false,
          }))
        );
        //console.log('fetchedOrderProjectLists:', fetchedOrderProjectLists); // 確認資料是否成功加載
      } catch (error) {
        console.error("Error fetching orderList:", error);
      }
    };

    fetchOrders();
  }, [projectId]);

  return (
    <>
      <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">
        <div className="col-span-full xl:col-span-6 bg-white dark:bg-slate-800 shadow-lg rounded-sm border border-slate-200 dark:border-slate-700">
          <header className="px-5 py-4 border-b border-slate-100 dark:border-slate-700">
            <h2 className="font-semibold text-slate-800 dark:text-slate-100">
              贊助清單
            </h2>
          </header>
          <div className="p-3">
            {/* Table */}
            <div className="overflow-x-auto">
              <table className="table-auto w-full">
                {/* Table header */}
                <thead className="text-xs font-semibold uppercase text-slate-400 dark:text-slate-500 bg-slate-50 dark:bg-slate-700 dark:bg-opacity-50">
                  <tr>
                    <th className="p-2 whitespace-nowrap">
                      <div className="font-semibold text-left">訂單編號</div>
                    </th>
                    <th className="p-2 whitespace-nowrap">
                      <div className="font-semibold text-left">贊助人</div>
                    </th>
                    <th className="p-2 whitespace-nowrap">
                      <div className="font-semibold text-left">贊助方案</div>
                    </th>
                    <th className="p-2 whitespace-nowrap">
                      <div className="font-semibold text-left">贊助日期</div>
                    </th>
                    <th className="p-2 whitespace-nowrap">
                      <div className="font-semibold text-left">Price</div>
                    </th>
                    <th className="p-2 whitespace-nowrap">
                      <div className="font-semibold text-center">Donate</div>
                    </th>
                  </tr>
                </thead>
                {/* Table body */}
                <tbody className="text-sm divide-y divide-slate-100 dark:divide-slate-700">
                  {orderList &&
                    orderList.map((item) => (
                      <tr
                        key={item.orderId}
                        className="hover:bg-gray-200 dark:hover:bg-slate-500"
                      >
                        <td className="p-2 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="font-medium text-slate-800 dark:text-slate-100">
                              {item.orderId}
                            </div>
                          </div>
                        </td>
                        <td className="p-2 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-10 h-10 shrink-0 mr-2 sm:mr-3">
                              <img
                                className="rounded-full w-10 h-10"
                                src={item.member.thumbnail}
                                loading="lazy"
                              />
                            </div>
                            <div className="text-left">
                              {item.member.username}
                            </div>
                          </div>
                        </td>
                        <td className="p-2 whitespace-nowrap">
                          <div className="text-left font-medium">
                            {item.orderDetails.projectName} X{" "}
                            {item.orderDetails.count}
                          </div>
                        </td>
                        <td className="p-2 whitespace-nowrap">
                          <div className="text-left font-medium text-green-500">
                            {item.orderDate}
                          </div>
                        </td>
                        <td className="p-2 whitespace-nowrap">
                          <div className="text-left font-medium">
                            {numeral(item.orderDetails.price).format("0,0")}
                          </div>
                        </td>
                        <td className="p-2 whitespace-nowrap">
                          <div className="text-center font-medium">
                            {numeral(item.donate).format("0,0")}
                          </div>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default OrderList;
