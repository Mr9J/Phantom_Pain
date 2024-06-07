import { useState, useEffect } from "react";
import { getMembers, getMemberCounts } from "@/services/members.service";
import "@/css/style.css";
import "@/css/backstageStyle.css";
import { MemberDTO, MemberCount } from "@/types/index";

const Staffs: React.FC = () => {
  const [members, setMembers] = useState<MemberDTO[] | null>(null);
  const [memberCount, setMemberCount] = useState<MemberCount[]>([]);
  const [memberType, setmemberType] = useState<number>(1);
  const [memberStatus, setMemberStatus] = useState<number>(7);

  const filteredMember =
  memberStatus > 0
    ? members?.filter((member) => member.statusId === memberStatus) 
    : members || [];

  //載入api
  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const fetchedMembers: MemberDTO[] = await getMembers();
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
  //會員狀態篩選
  useEffect(() => {
    const fetchMemberCount = async () => {
      try {
        const fetchedMemberCount: MemberCount[] = await getMemberCounts();
        setMemberCount(fetchedMemberCount);
        //console.log('fetchedMemberCount:', fetchedMemberCount); // 確認資料是否成功加載
      } catch (error) {
        console.error("Error fetching memberCount:", error);
      }
    };
    fetchMemberCount();
  }, []);

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
            {memberType === 1 ? (
              <button
                type="button"
                className="text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-base px-7 py-3 me-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700"
              >
                一般會員({memberCount[0]})
              </button>
            ) : (
              <button
                type="button"
                className="text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-base px-7 py-3 me-2 mb-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700"
                onClick={() => {
                  setmemberType(1);
                  setMemberStatus(7);
                }}
              >
                一般會員({memberCount[0]})
              </button>
            )}
            {memberType === 2 ? (
              <button
                type="button"
                className="text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-base px-7 py-3 me-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700"
              >
                停權中({memberCount[1]})
              </button>
            ) : (
              <button
                type="button"
                className="text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-base px-7 py-3 me-2 mb-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700"
                onClick={() => {
                  setmemberType(2);
                  setMemberStatus(8);
                }}
              >
                停權中({memberCount[1]})
              </button>
            )}

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
                  {members && filteredMember &&filteredMember.map((member) => (
                      <tr key={member.id}>
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
                          <div className="text-lg text-center">專案發起人</div>
                          {/* <div className="text-lg text-center">{member.location}</div> */}
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
