import { useNavigate } from "react-router-dom";
import { createContext, useContext, useEffect, useState } from "react";

import { CurrentUserProps } from "@/types";
import { getCurrentUser } from "@/services/auth.service";

export const INITIAL_USER = {
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
  user: CurrentUserProps;
  isLoading: boolean;
  setUser: React.Dispatch<React.SetStateAction<CurrentUserProps>>;
  isAuthenticated: boolean;
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
  checkAuthUser: () => Promise<boolean>;
};

const AuthContext = createContext<IContextType>(INITIAL_STATE);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const [user, setUser] = useState<CurrentUserProps>(INITIAL_USER);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const checkAuthUser = async () => {
    setIsLoading(true);
    try {
      const currentAccount: CurrentUserProps = await getCurrentUser();
      if (currentAccount) {
        setUser({
          username: currentAccount.username,
          email: currentAccount.email,
        });

        setIsAuthenticated(true);
        return true;
      }

      return false;
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }

    useEffect(() => {
      const cookieFallback = localStorage.getItem("token");
      if (
        cookieFallback === "[]" ||
        cookieFallback === null ||
        cookieFallback === undefined
      ) {
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

    return (
      <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
    );
  };
}

export const useUserContext = () => useContext(AuthContext);
