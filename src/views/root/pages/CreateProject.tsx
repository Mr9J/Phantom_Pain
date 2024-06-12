import { useUserContext } from "@/context/AuthContext";
import { useEffect, useState } from "react";

function CreateProject() {

     //isAuthenticated: 是否已經登入
  //user: 登入的使用者資料
  const { user, isAuthenticated } = useUserContext();
  const [isAuth, setIsAuth] = useState(false);

  //頁面載入時檢查使用者是否已經登入，如果只是要取得使用者資料，可以不用檢查
  //isAuth時時判斷是否已經登入
  //依需求使用navigate導向特定頁面，或是history.back()返回上一頁
  useEffect(() => {
      setIsAuth(isAuthenticated);
  }, [isAuthenticated]);
  
  return (
    <div className="container mx-auto px-4 md:px-0">
      <div className="text-center">
        <h2 className="text-2xl font-bold my-16 inline-block after:h-1 after:block after:bg-secondary after:rounded after:mt-1">
          <span>群眾集資</span>
          提案
        </h2>
      </div>
        {/* 保護區 */}
        <div className="px-4 border border-gray-300 mb-16 rounded">


            
        </div>

      {/* 保護區 */}
    </div>
  );
}

export default CreateProject;
