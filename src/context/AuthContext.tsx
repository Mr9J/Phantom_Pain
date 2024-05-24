import React from "react";
import { createContext, useContext, useEffect, useState } from "react";
import { ICurrentUser } from "@/types";
import { getCurrentUser } from "@/services/auth.service";
import { useNavigate } from "react-router-dom";

const INITIAL_USER = {
  id: "",
  username: "",
  email: "",
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
  user: ICurrentUser;
  isLoading: boolean;
  setUser: React.Dispatch<React.SetStateAction<ICurrentUser>>;
  isAuthenticated: boolean;
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
  checkAuthUser: () => Promise<boolean>;
};

const AuthContext = createContext<IContextType>(INITIAL_STATE);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const [user, setUser] = useState<ICurrentUser>(INITIAL_USER);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const checkAuthUser = async () => {
    setIsLoading(true);
    try {
      const currentAccount = await getCurrentUser();
      if (currentAccount) {
        setUser({
          id: currentAccount.data.id,
          username: currentAccount.data.username,
          email: currentAccount.data.email,
        });
        setIsAuthenticated(true);
        return true;
      }
      return false;
    } catch (error) {
      console.error(error);
      return false;
    } finally {
      console.log("finally");
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token === "[]" || token === null || token === undefined) {
      navigate("/sign-in");
    }

    checkAuthUser();
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
