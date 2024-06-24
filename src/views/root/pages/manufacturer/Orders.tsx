import { useState, useEffect } from "react";
import { getUserOrderProjects } from "@/services/orders.service";
import { getUserProjectCounts } from "@/services/projects.service";
import { OrderProject } from "@/types/index";
import "@/css/style.css";
import "@/css/backstageStyle.css";

const Orders = () => {
  const [orderProjects, setOrderProjects] = useState<OrderProject[] | null>(
    null
  );
  const [orderType, setorderType] = useState(1);
  const [projectCount, setProjectCount] = useState<ProjectCount[]>([]);
  const [projectStatus, setProjectStatus] = useState(-1);

  const filteredProjects =
    orderProjects && projectStatus > 0
      ? orderProjects.filter((item) => item.statusId === projectStatus)
      : orderProjects || [];

  type ProjectCount = number[];
  //載入api
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const fetchedOrderProjects: OrderProject[] =
          await getUserOrderProjects();
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
  //data
  useEffect(() => {
    const fetchProjectCount = async () => {
      try {
        const fetchedProjectCount = await getUserProjectCounts();
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        fetchedProjectCount.map((item: any) => ({
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
                  全部({Number(projectCount[0])-Number(projectCount[3])})
                </button>
              ) : (
                <button
                  type="button"
                  className="text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700"
                  onClick={() => {
                    setorderType(1);
                    setProjectStatus(-1);
                  }}
                >
                  全部({Number(projectCount[0])-Number(projectCount[3])})
                </button>
              )}
              {orderType === 2 ? (
                <button
                  type="button"
                  className="text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700"
                >
                  進行中({projectCount[1]})
                </button>
              ) : (
                <button
                  type="button"
                  className="text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700"
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
                  className="text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700"
                >
                  已下架({projectCount[2]})
                </button>
              ) : (
                <button
                  type="button"
                  className="text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700"
                  onClick={() => {
                    setorderType(3);
                    setProjectStatus(2);
                  }}
                >
                  已下架({projectCount[2]})
                </button>
              )}
            </div>
            <div className="mt-6 space-y-12 lg:grid lg:grid-cols-3 lg:gap-x-6 lg:space-y-0">
              {orderProjects &&
                filteredProjects.map((item) => (
                  <div key={item.projectId} className="group relative p-3">
                    <a href={`order/${item.projectId}`}>
                      <div className="relative h-80 w-full overflow-hidden rounded-t-lg sm:aspect-h-1 sm:aspect-w-2 lg:aspect-h-1 lg:aspect-w-1 group-hover:opacity-75 sm:h-64">
                        <img
                          src={item.thumbnail}
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
