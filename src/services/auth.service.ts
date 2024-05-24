import { INewUser } from "@/types";
import axios from "axios";

const URL = import.meta.env.VITE_API_URL;

export async function signUp(data: INewUser) {
  return axios.post(`${URL}/Member/sign-up`, data);
}

type SignInProps = {
  username: string;
  password: string;
};

export async function signIn({ username, password }: SignInProps) {
  // return axios.post(`${URL}/Member/sign-in`, { username, password });

  return axios.post(`${URL}/Member/sign-in`, { username, password });
}

export async function checkUserExist(username: string) {
  return axios.get(`${URL}/Member/check-username/${username}`);
}

export async function getCurrentUser() {
  const jwt = localStorage.getItem("token");
  return axios.post(
    `${URL}/Member/get-current-user`,
    { jwt },
    { params: { jwt }, headers: { Authorization: jwt } }
  );
}
