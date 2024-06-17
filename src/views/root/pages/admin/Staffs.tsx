import { useState, useEffect } from "react";
import { getMembers, getMemberCounts } from "@/services/members.service";
import "@/css/style.css";
import "@/css/backstageStyle.css";
import { MemberDTO, MemberCount } from "@/types/index";
import SearchBar from "@/components/admin/SearchBar";

const baseUrl = import.meta.env.VITE_API_URL;
type MemberContext = [number, string, string, number];
interface FormDataObject {
  [key: string]: string;
}

const Staffs: React.FC = () => {
  const [members, setMembers] = useState<MemberDTO[] | null>(null);
  const [memberCount, setMemberCount] = useState<MemberCount[]>([]);
  const [memberType, setmemberType] = useState<number>(1); //列表選擇
  const [memberStatus, setMemberStatus] = useState<number>(7); //會員狀態
  const [visibleBanMemberModal, setBanMemberModal] = useState(false);
  const [MemberContext, setMemberContext] = useState<MemberContext>([
    0,
    "",
    "",
    0,
  ]);
  const [formData, setFormData] = useState<FormDataObject>({});
  const [searchQuery, setSearchQuery] = useState<string>("");

  const filteredMembers =
    memberStatus > 0
      ? members?.filter((member) => member.statusId === memberStatus)
      : members || [];

  const filteredMembersKeyword =
    searchQuery.length > 0
      ? filteredMembers?.filter(
          (item) =>
            item.username.includes(searchQuery) ||
            item.nickname.includes(searchQuery) ||
            item.email.includes(searchQuery)
        )
      : filteredMembers;
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

  //Modal
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault(); // 阻止表單默認的提交行為
    const formData = new FormData(event.currentTarget); // 收集表單數據

    const jsonData: FormDataObject = {};
    formData.forEach((value, key) => {
      jsonData[key] = value as string;
    });
    setFormData(jsonData);

    const url = `${baseUrl}/member/${jsonData.id}`;
    const method = "PUT";
    //debug用
    //console.log("URL:", url);
    //console.log("Method:", method);
    //console.log("Data being sent:", jsonData);

    fetch(url, {
      method: method,
      headers: {
        "Content-Type": "application/json", // 指定 Content-Type 為 application/json
      },
      body: JSON.stringify(jsonData), // 轉換數據為 JSON 字符串並作為請求體
    })
      .then((response) => {
        if (!response.ok) {
          return response.text().then((text) => {
            throw new Error(text);
          });
        }
        return response.json();
      })
      .then((data) => {
        console.log("成功提交數據：", data);
        setBanMemberModal(false); // 確認表單
        window.location.reload();
      })
      .catch((error) => {
        console.error("提交數據時發生錯誤：", error);
      });
  };
  const handleSearch = (query: string) => {
    console.log("Searching for:", query);
    setSearchQuery(query);
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
            <div style={{ display: "flex" }}>
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
              <div style={{ marginLeft: "auto" }} className="pb-2">
                <SearchBar onSearch={handleSearch} />
              </div>
            </div>

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
                      <div className="font-semibold text-center">功能</div>
                    </th>
                  </tr>
                </thead>
                {/* Table body */}
                <tbody className="text-sm divide-y divide-slate-100 dark:divide-slate-700">
                  {members &&
                    filteredMembersKeyword &&
                    filteredMembersKeyword.map((member) => (
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
                          <div className="font-semibold text-center">
                            {Number(member.statusId) === 7 && (
                              <button
                                type="button"
                                onClick={() => {
                                  setBanMemberModal(!visibleBanMemberModal);
                                  setMemberContext([
                                    member.memberId,
                                    member.username,
                                    member.thumbnail,
                                    member.statusId,
                                  ]);
                                }}
                                className="text-slate-50 bg-ban hover:bg-rose-400 border border-gray-200 focus:ring-4 focus:outline-none focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:focus:ring-gray-600 dark:bg-ban dark:border-gray-700 dark:text-white dark:hover:bg-gray-700 me-2 mb-2"
                              >
                                <svg
                                  className="w-[20px] h-[20px] fill-[#ffffff] border-black"
                                  viewBox="0 0 512 512"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path d="M367.2 412.5L99.5 144.8C77.1 176.1 64 214.5 64 256c0 106 86 192 192 192c41.5 0 79.9-13.1 111.2-35.5zm45.3-45.3C434.9 335.9 448 297.5 448 256c0-106-86-192-192-192c-41.5 0-79.9 13.1-111.2 35.5L412.5 367.2zM0 256a256 256 0 1 1 512 0A256 256 0 1 1 0 256z"></path>
                                </svg>
                                <div className="text-base font-semibold">
                                  停權
                                </div>
                              </button>
                            )}
                            {Number(member.statusId) === 8 && (
                              <button
                                type="button"
                                onClick={() => {
                                  setBanMemberModal(!visibleBanMemberModal);
                                  setMemberContext([
                                    member.memberId,
                                    member.username,
                                    member.thumbnail,
                                    member.statusId,
                                  ]);
                                }}
                                className="text-slate-50 bg-green-600 hover:bg-rose-400 border border-gray-200 focus:ring-4 focus:outline-none focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:focus:ring-gray-600 dark:bg-green dark:border-gray-700 dark:text-white dark:hover:bg-gray-700 me-2 mb-2"
                              >
                                <svg
                                  className="w-[20px] h-[20px] fill-[#ffffff] border-black"
                                  viewBox="0 0 512 512"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path d="M386.3 160H336c-17.7 0-32 14.3-32 32s14.3 32 32 32H464c17.7 0 32-14.3 32-32V64c0-17.7-14.3-32-32-32s-32 14.3-32 32v51.2L414.4 97.6c-87.5-87.5-229.3-87.5-316.8 0s-87.5 229.3 0 316.8s229.3 87.5 316.8 0c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0c-62.5 62.5-163.8 62.5-226.3 0s-62.5-163.8 0-226.3s163.8-62.5 226.3 0L386.3 160z"></path>
                                </svg>
                                <div className="text-base font-semibold">
                                  解除停權
                                </div>
                              </button>
                            )}
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
      {
        // #region modal-----------------------------------------------------------------------------------
      }
      {visibleBanMemberModal && (
        <div
          id="popup-modal"
          tabIndex={-1}
          aria-hidden="true"
          className="fixed inset-0 flex justify-center items-center w-full h-[calc(100%-1rem)] max-h-full overflow-y-auto overflow-x-hidden bg-gray-800 bg-opacity-75"
        >
          <div className="relative p-4 w-full max-w-md max-h-full">
            <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
              <button
                type="button"
                onClick={() => setBanMemberModal(false)}
                className="absolute top-3 end-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                data-modal-hide="popup-modal"
              >
                <svg
                  className="w-3 h-3"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 14 14"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                  />
                </svg>
                <span className="sr-only">Close modal</span>
              </button>
              <form className="space-y-4" onSubmit={(e) => handleSubmit(e)}>
                <div className="p-4 md:p-5 text-center">
                  <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <div className="w-20 h-20 shrink-0 ">
                        <img
                          className="rounded-full w-20 h-20"
                          src={MemberContext[2]}
                          loading="lazy"
                        />
                      </div>
                    </div>
                    <p>{MemberContext[1]}</p>
                    {MemberContext[3] === 7 && <p>您確定將會員停權嗎？</p>}
                    {MemberContext[3] === 8 && <p>您確定將解除停權嗎？</p>}
                  </h3>
                  <input
                    type="hidden"
                    required
                    name="statusId"
                    {...(MemberContext[3] === 7 && { value: "8" })}
                    {...(MemberContext[3] === 8 && { value: "7" })}
                  />
                  <input type="hidden" name="id" value={MemberContext[0]} />
                  <input
                    type="hidden"
                    name="username"
                    value={MemberContext[1]}
                  />
                  <button
                    type="submit"
                    className="text-white bg-green-600 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-300 dark:focus:ring-green-800 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center"
                  >
                    確認
                  </button>
                  <button
                    type="button"
                    onClick={() => setBanMemberModal(false)}
                    className="py-2.5 px-5 ms-3 text-white bg-rose-600 hover:bg-rose-800 focus:ring-4 focus:outline-none focus:ring-rose-300 dark:focus:ring-rose-800 font-medium rounded-lg text-sm inline-flex items-center text-center"
                  >
                    取消
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
      {
        //#endregion
      }
    </>
  );
};

export default Staffs;
