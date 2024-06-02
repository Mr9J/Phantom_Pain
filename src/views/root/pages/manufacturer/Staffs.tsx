import React, { useState, useEffect } from "react";
import { getMembers } from "@/services/members.service";
const baseUrl = import.meta.env.VITE_API_URL;
import "@/css/style.css";
import "@/css/backstageStyle.css";

import Image01 from '@/assets/admin_img/user-36-05.jpg';
import Image02 from '@/assets/admin_img/user-36-06.jpg';
import Image03 from '@/assets/admin_img/user-36-07.jpg';
import Image04 from '@/assets/admin_img/user-36-08.jpg';
import Image05 from '@/assets/admin_img/user-36-09.jpg';


const Staffs = () => {
  const [members, setMembers] = useState(null);
    //載入api
    useEffect(() => {
      const fetchMembers = async () => {
        try {
          const fetchedProjects = await getMembers();
          setMembers(
            fetchedProjects.map((member) => ({
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
  const customers = [
    {
      id: '0',
      image: Image01,
      name: 'Alex Shatov',
      email: 'alexshatov@gmail.com',
      location: '🇺🇸',
      spent: '$2,890.66',
    },
    {
      id: '1',
      image: Image02,
      name: 'Philip Harbach',
      email: 'philip.h@gmail.com',
      location: '🇩🇪',
      spent: '$2,767.04',
    },
    {
      id: '2',
      image: Image03,
      name: 'Mirko Fisuk',
      email: 'mirkofisuk@gmail.com',
      location: '🇫🇷',
      spent: '$2,996.00',
    },
    {
      id: '3',
      image: Image04,
      name: 'Olga Semklo',
      email: 'olga.s@cool.design',
      location: '🇮🇹',
      spent: '$1,220.66',
    },
    {
      id: '4',
      image: Image05,
      name: 'Burak Long',
      email: 'longburak@gmail.com',
      location: '🇬🇧',
      spent: '$1,890.66',
    },
  ];

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
              {
                members &&members.map((member) => (
                  <React.Fragment key={member.id}>
                    <tr key={member.id}>
                      <td className="p-2 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-10 h-10 shrink-0 mr-2 sm:mr-3">
                            <img className="rounded-full w-10 h-10" src={member.thumbnail} alt={member.username} loading="lazy"/>
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
                        {/* <div className="text-lg text-center">{member.location}</div> */}
                      </td>
                    </tr>
                  </React.Fragment>
                ))}
            </tbody>
          </table>

        </div>

      </div>
    </div>
    </div>
    </>
    )
};

export default Staffs;