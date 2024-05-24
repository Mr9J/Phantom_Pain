import React from "react";

export type SignUpProps = {
  nickname: string;
  username: string;
  email: string;
  password: string;
};

export type SignInProps = {
  username: string;
  password: string;
};

export type ProjectPhotoProps = {
  id: number;
  photographer: string;
  photographer_id: number;
  photographer_url: string;
  imgSrc: string;
};

export type ICurrentUser = {
  id: string;
  username: string;
  email: string;
};

export type IContextType = {
  user: ICurrentUser;
  isLoading: boolean;
  setUser: React.Dispatch<React.SetStateAction<ICurrentUser>>;
  isAuthenticated: boolean;
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
  checkAuthUser: () => Promise<boolean>;
};
