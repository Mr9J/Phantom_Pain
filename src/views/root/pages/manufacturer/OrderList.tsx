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
<div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">
<div className="col-span-full xl:col-span-6 bg-white dark:bg-slate-800 shadow-lg rounded-sm border border-slate-200 dark:border-slate-700">
      <header className="px-5 py-4 border-b border-slate-100 dark:border-slate-700">
        <h2 className="font-semibold text-slate-800 dark:text-slate-100">Staff名單</h2>
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
                  <div className="font-semibold text-left">贊助日期</div>
                </th>
                <th className="p-2 whitespace-nowrap">
                  <div className="font-semibold text-left">Donate</div>
                </th>
              </tr>
            </thead>
            {/* Table body */}
            {/* <tbody className="text-sm divide-y divide-slate-100 dark:divide-slate-700">
              {
                members &&members.map((member) => (
                    <tr key={member.id}>
                      <td className="p-2 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-10 h-10 shrink-0 mr-2 sm:mr-3">
                            <img className="rounded-full w-10 h-10" src={member.thumbnail} loading="lazy"/>
                          </div>
                          <div className="font-medium text-slate-800 dark:text-slate-100">{member.nickname}</div>
                        </div>
                      </td>
                      <td className="p-2 whitespace-nowrap">
                        <div className="text-left">{member.username}</div>
                      </td>
                      <td className="p-2 whitespace-nowrap">
                        <div className="text-left font-medium text-green-500">{member.email}</div>
                      </td>
                      <td className="p-2 whitespace-nowrap">
                        <div className="text-left font-medium">{member.phone}</div>
                      </td>
                      <td className="p-2 whitespace-nowrap">
                        <div className="text-lg text-center">專案發起人</div>
                      </td>
                    </tr>
                ))}
            </tbody> */}
          </table>

        </div>

      </div>
    </div>
    </div>
    </>
  );
};

export default Orders;
