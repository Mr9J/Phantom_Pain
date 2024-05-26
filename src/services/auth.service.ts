import { CurrentUserDTO, SignInDTO, SignUpDTO } from "@/types";
import axios from "axios";

const URL = import.meta.env.VITE_API_URL;

export async function signUp(user: SignUpDTO) {
  try {
    const res = await axios.post(`${URL}/Member/sign-up`, user);

    if (res.status !== 200) throw Error;

    return res.data;
  } catch (error) {
    console.log(error);
    return error;
  }
}

export async function signIn(user: SignInDTO) {
  try {
    const res = await axios.post(`${URL}/Member/sign-in`, user);

    if (res.status !== 200) throw Error;

    localStorage.setItem("token", res.data);

    return res.data;
  } catch (error) {
    console.error(error);
  }
}

export async function checkUserExist(username: string) {
  return axios.get(`${URL}/Member/check-username/${username}`);
}

export async function getCurrentUser() {
  try {
    const jwt = localStorage.getItem("token");
    const res = await axios.post(
      `${URL}/Member/get-current-user`,
      { jwt },
      { params: { jwt }, headers: { Authorization: jwt } }
    );

    const currentUser: CurrentUserDTO = res.data;

    if (!currentUser) throw Error;

    return currentUser;
  } catch (error) {
    console.error(error);
    return null;
  }
}
