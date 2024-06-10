import { CurrentUserDTO, OuterSignIn, SignInDTO, SignUpDTO } from "@/types";
import axios from "axios";
import { Network } from "lucide-react";

const URL = import.meta.env.VITE_API_URL;

export async function signUp(user: SignUpDTO) {
  try {
    const res = await axios.post(`${URL}/Member/sign-up`, user);

    if (res.status !== 200) throw Error;

    return res.data;
  } catch (error) {
    console.error(error);
    if (error.response.data === "註冊資料格式錯誤") {
      return "註冊資料格式錯誤";
    }
    if (error.response.data === "使用者已存在") {
      return "使用者已存在";
    }
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
    if (error.response.data === "帳號已被停權") {
      return "帳號已被停權";
    } else if (error.response.data === "帳號或密碼錯誤") {
      return "帳號或密碼錯誤";
    }
  }
}

export async function signInWithOthers(user: OuterSignIn) {
  try {
    const res = await axios.post(`${URL}/Member/sign-in-with-others`, user);

    if (res.status !== 200) throw Error;

    localStorage.setItem("token", res.data);

    return res.data;
  } catch (error) {
    console.error(error);
    if (error.response.data === "錯誤，請聯絡客服") {
      return "錯誤，請聯絡客服";
    }
    if (error.response.data === "帳號已被停權") {
      return "帳號已被停權";
    }
  }
}

export async function getCurrentUser() {
  try {
    const jwt = localStorage.getItem("token");

    if (!jwt) throw Error;

    const res = await axios.get(`${URL}/Member/get-current-user`, {
      headers: { Authorization: jwt },
    });

    const currentUser: CurrentUserDTO = res.data;

    if (!currentUser) throw Error;

    return currentUser;
  } catch (error) {
    console.error(error);
    return null;
  }
}

export function signOutNative() {
  try {
    localStorage.removeItem("token");
  } catch (error) {
    console.log(error);
  }
}

export async function verifyEmail(username: string, Eid: string) {
  try {
    const res = await axios.get(
      `${URL}/Verify/verify-email/${username}/${Eid}`
    );

    if (res.status !== 200) throw Error;

    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
}

export async function resetPassword(password: string, jwt: string) {
  try {
    const res = await axios.post(
      `${URL}/Member/change-password`,
      { password },
      { params: { password }, headers: { Authorization: "Bearer " + jwt } }
    );

    if (res.status !== 200) throw Error;

    return res.data;
  } catch (error) {
    console.error(error);
  }
}

export async function sendResetEmail(email: string) {
  try {
    const res = await axios.post(`${URL}/Member/reset-password`, email, {
      params: { email },
    });

    if (res.status !== 200) throw Error;

    return res.data;
  } catch (error) {
    console.error(error);
  }
}
