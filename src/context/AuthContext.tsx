import { createContext, useContext, useEffect, useState } from "react";
import { CurrentUserDTO } from "@/types";
import { getCurrentUser } from "@/services/auth.service";

const INITIAL_USER = {
  id: "",
  username: "",
  email: "",
  nickname: "",
  thumbnail: "",
};

const INITIAL_STATE = {
  user: INITIAL_USER,
  isLoading: false,
  isAuthenticated: false,
  setUser: () => {},
  setIsAuthenticated: () => {},
  checkAuthUser: async () => false as boolean,
};

type IContextType = {
  user: CurrentUserDTO;
  isLoading: boolean;
  setUser: React.Dispatch<React.SetStateAction<CurrentUserDTO>>;
  isAuthenticated: boolean;
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
  checkAuthUser: () => Promise<boolean>;
};

const AuthContext = createContext<IContextType>(INITIAL_STATE);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<CurrentUserDTO>(INITIAL_USER);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const checkAuthUser = async () => {
    setIsLoading(true);
    try {
      const currentUser = await getCurrentUser();
      if (currentUser) {
        setUser({
          id: currentUser.id,
          username: currentUser.username,
          email: currentUser.email,
          nickname: currentUser.nickname,
          thumbnail: currentUser.thumbnail,
        });

        setIsAuthenticated(true);

        return true;
      }

      return false;
    } catch (error) {
      console.error(error);

      return false;
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token === "[]" || token === null || token === undefined) {
      return;
    }

    checkAuthUser().then((res) => {
      setIsAuthenticated(res);
    });
  }, []);

  const value = {
    user,
    setUser,
    isLoading,
    isAuthenticated,
    setIsAuthenticated,
    checkAuthUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useUserContext = () => useContext(AuthContext);
