import React, { useState, useEffect } from 'react';
import Service from './Service';
import ServiceAdmin from './ServiceAdmin';
import { UserType } from '@/components/service/types';// 引入類型

const ServiceRoute = () => {
  const [user, setUser] = useState<UserType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 使用假數據模擬 API 請求
    const fetchUserData = async () => {
      try {
       

        // 假數據
        const response = {
          data: {
            MemberID: 1,
            AdminID: null, // 修改為 1 來測試客服端界面
          },
        };
        setUser(response.data); // 設置使用者資料
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false); // 設置加載狀態為 false
      }
    };

    fetchUserData();
  }, []);

  // 顯示加載狀態
  if (loading) {
    return <div>Loading...</div>;
  }

  // 如果沒有獲取到使用者資料，顯示錯誤信息
  if (!user) {
    return <div>Error: No user data found</div>;
  }

  // 根據使用者的 AdminID 顯示不同的組件
  return user.AdminID ? <ServiceAdmin /> : <Service />;
};

export default ServiceRoute;