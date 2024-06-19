import { useState, useEffect } from "react";
import { getMemberStaff } from "@/services/members.service";
import { MemberDTO } from "@/types/index";
import "@/css/style.css";
import "@/css/backstageStyle.css";

const Staffs = () => {
  const [members, setMembers] = useState<MemberDTO[] | null>(null);
  //載入api
  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const fetchedMembers: MemberDTO[] = await getMemberStaff();
        setMembers(
          fetchedMembers.map((member) => ({
            ...member,
            isEdit: false,
          }))
        );
        //console.log('fetchedMembers:', fetchedMembers); // 確認資料是否成功加載
      } catch (error) {
        console.error("Error fetching members:", error);
      }
    };

    fetchMembers();
  }, []);
  const statusMap: Record<number, string> = {
    1: "專案發起者",
    2: "共同編輯者",
  };
  return (
    <>
      <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">
        <div className="col-span-full xl:col-span-6 bg-white dark:bg-slate-800 shadow-lg rounded-sm border border-slate-200 dark:border-slate-700">
          <header className="px-5 py-4 border-b border-slate-100 dark:border-slate-700">
            <h2 className="font-semibold text-slate-800 dark:text-slate-100">
              Staff名單
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
                      <div className="font-semibold text-left">姓名</div>
                    </th>
                    <th className="p-2 whitespace-nowrap">
                      <div className="font-semibold text-left">帳號</div>
                    </th>
                    <th className="p-2 whitespace-nowrap">
                      <div className="font-semibold text-left">Email</div>
                    </th>
                    <th className="p-2 whitespace-nowrap">
                      <div className="font-semibold text-left">電話</div>
                    </th>
                    <th className="p-2 whitespace-nowrap">
                      <div className="font-semibold text-center">職稱</div>
                    </th>
                  </tr>
                </thead>
                {/* Table body */}
                <tbody className="text-sm divide-y divide-slate-100 dark:divide-slate-700">
                  {members &&
                    members.map((member) => (
                      <tr
                        key={member.id}
                        className="hover:bg-gray-200 dark:hover:bg-slate-500"
                      >
                        <td className="p-2 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-10 h-10 shrink-0 mr-2 sm:mr-3">
                              <img
                                className="rounded-full w-10 h-10"
                                src={member.thumbnail}
                                loading="lazy"
                              />
                            </div>
                            <div className="font-medium text-slate-800 dark:text-slate-100">
                              {member.nickname}
                            </div>
                          </div>
                        </td>
                        <td className="p-2 whitespace-nowrap">
                          <div className="text-left">{member.username}</div>
                        </td>
                        <td className="p-2 whitespace-nowrap">
                          <div className="text-left font-medium text-green-500">
                            {member.email}
                          </div>
                        </td>
                        <td className="p-2 whitespace-nowrap">
                          <div className="text-left font-medium">
                            {member.phone}
                          </div>
                        </td>
                        <td className="p-2 whitespace-nowrap">
                          <div className="text-lg text-center">
                            {statusMap[member.groupDetail.authStatusId]}
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

export default Staffs;
