import { SignUpProps, SignInProps } from "@/types";
import axios from "axios";

const URL = import.meta.env.VITE_API_URL;

export async function signUp(data: SignUpProps) {
  return axios.post(`${URL}/Member/sign-up`, data);
}

export async function signIn(data: SignInProps) {
  return axios.post(`${URL}/Member/sign-in`, data);
}
