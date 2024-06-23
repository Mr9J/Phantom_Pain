import React, { createContext, useContext, useState, useEffect ,ReactNode} from 'react';
import { useUserContext } from './AuthContext';

// 定義 Context 的類型
interface AppContextType {
  cartQuantity: number;
  fetchCartQuantity: () => Promise<void>;
}

// 建立 Context
const AppContext = createContext<AppContextType | undefined>(undefined);

// 自定義 hook，用於在组件中訪問 Context 的值
export const useCartContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
// 提供 Context 的 Provider 组件
interface CartProviderProps {
  children: ReactNode;
}

// 提供 Context 的 Provider 组件
export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
    const { user, checkAuthUser } = useUserContext();
  const [cartQuantity, setCartQuantity] = useState<number>(0);
  const baseUrl = import.meta.env.VITE_API_URL;// 
  const [isAuth, setIsAuth] = useState(true);


  
  const fetchCartQuantity = async () => {
    if(Number(user.id)!=0)
    try {
      const response = await fetch(`${baseUrl}/Cart/cartQuantity/${Number(user.id)}`);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(JSON.stringify(errorData));
      }
      const data = await response.json();
      setCartQuantity(data);
    } catch (error) {
      console.error('Error fetching cart quantity:', error);
    }
  };

  useEffect(() => {
    const authenticateUser = async () => {
      const res = await checkAuthUser();
      setIsAuth(res);
    };
    authenticateUser();
    if (isAuth) {
        fetchCartQuantity();
      }
  }, []);


  // Context 的值，包括狀態和方法
  const contextValue: AppContextType = {
    cartQuantity,
    fetchCartQuantity,
  };

  // 渲染 Provider，並傳遞 contextValue 作為值
  return <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>;
};
