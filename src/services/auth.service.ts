import { SignUpProps, SignInProps } from "@/types";
import axios from "axios";
import { ProjectPhotoProps } from "@/types";

const URL = import.meta.env.VITE_API_URL;

export async function signUp(data: SignUpProps) {
  return axios.post(`${URL}/Member/sign-up`, data);
}

export async function signIn(data: SignInProps) {
  return axios.post(`${URL}/Member/sign-in`, data);
}

export async function checkUserExist(username: string) {
  return axios.get(`${URL}/Member/check-username/${username}`);
}

export async function getCurrentUser() {
  axios.get(`${URL}/Member/current-user`).then((res) => {
    const result: ProjectPhotoProps = res.data;
    return result;
  });
}
