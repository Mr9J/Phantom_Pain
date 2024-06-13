import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // 引入 useNavigate
import Service from './Service';
import ServiceAdmin from './ServiceAdmin';
import { useUserContext } from '@/context/AuthContext'; // 假設這是你獲取當前登錄用戶上下文的地方

const ServiceRoute = () => {
  const { user, isLoading, isAuthenticated, checkAuthUser } = useUserContext();
  const navigate = useNavigate(); // 使用 useNavigate 來進行導航
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    const verifyUser = async () => {
      if (!isAuthenticated) {
        await checkAuthUser();
      }
      setCheckingAuth(false);
    };
    verifyUser();
  }, [isAuthenticated, checkAuthUser]);

  useEffect(() => {
    // 如果沒有獲取到使用者資料或未驗證，跳轉到登入頁面
    if (!checkingAuth && !isAuthenticated) {
      navigate('/sign-in'); // 跳轉到登入頁面
    }
  }, [checkingAuth, isAuthenticated, navigate]);

  // 顯示加載狀態
  if (isLoading || checkingAuth) {
    return <div>Loading...</div>;
  }

  // 如果没有獲取到使用者資料，顯示錯誤信息
  if (!user) {
    return <div>Error: No user data found</div>;
  }

  // 定義管理員用戶的 MemberID 列表
  const adminMemberIds = [1, 2, 3];

  // 根據使用者的 MemberID 顯示不同的組件
  // 將 user.id 轉換為數字並檢查是否在 adminMemberIds 列表中
  return adminMemberIds.includes(Number(user.id)) ? <ServiceAdmin /> : <Service />;
};

export default ServiceRoute;