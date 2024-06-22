import { S3 } from "@/config/R2";
import {
  CurrentUserDTO,
  IUpdateBanner,
  IUpdateUserProfile,
  OuterSignIn,
  SignInDTO,
  SignUpDTO,
  UpdateUserProfile,
} from "@/types";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import axios from "axios";

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
    if (error.response.data === "Email已被使用") {
      return "Email已被使用";
    }
  }
}

export async function signIn(user: SignInDTO) {
  try {
    const res = await axios.post(`${URL}/Member/sign-in`, user);

    if (res.status !== 200) throw Error;

    localStorage.setItem("token", res.data.jwt);

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

export async function changeEmail(email: string) {
  try {
    const jwt = localStorage.getItem("token");

    if (!jwt) throw Error;

    const res = await axios.post(
      `${URL}/Verify/change-email`,
      { email },
      { params: { email }, headers: { Authorization: jwt } }
    );

    if (res.status !== 200) throw Error;

    return res.data;
  } catch (error) {
    console.error(error);
  }
}

export async function resendEmail() {
  try {
    const jwt = localStorage.getItem("token");

    if (!jwt) throw Error;

    const res = await axios.get(`${URL}/Verify/resend-email`, {
      headers: { Authorization: jwt },
    });

    if (res.status !== 200) throw Error;

    return res.data;
  } catch (error) {
    console.error(error);
  }
}

export async function checkAdmin() {
  try {
    const jwt = localStorage.getItem("token");
    if (!jwt) throw Error;

    const res = await axios.get(`${URL}/Member/check-admin`, {
      headers: { Authorization: jwt },
    });

    if (res.status !== 200) throw Error;

    return res.data;
  } catch (error) {
    console.error(error);
  }
}

export async function getMemberById(id: string) {
  try {
    const res = await axios.get(`${URL}/Member/get-member-by-id/${id}`);

    if (res.status !== 200) throw Error;

    return res.data;
  } catch (error) {
    console.error(error);
  }
}

export async function getMemberSponsored(id: string) {
  try {
    const jwt = localStorage.getItem("token");

    if (!jwt) throw Error;

    const res = await axios.get(`${URL}/Member/get-member-sponsored/${id}`, {
      headers: { Authorization: jwt },
    });

    if (res.status !== 200) throw Error;

    return res.data;
  } catch (error) {
    console.error(error);
  }
}

export async function getMemberProfile(id: string) {
  try {
    const jwt = localStorage.getItem("token");

    if (!jwt) throw Error;

    const res = await axios.get(`${URL}/Member/get-member-profile/${id}`, {
      headers: { Authorization: jwt },
    });

    if (res.status !== 200) throw Error;

    return res.data;
  } catch (error) {
    console.error(error);
  }
}

export async function updateMemberProfile(profile: IUpdateUserProfile) {
  const isNewImg = profile.thumbnail.length > 0;
  try {
    const jwt = localStorage.getItem("token");

    if (!jwt) throw Error;

    const newProfile: UpdateUserProfile = {
      nickname: profile.nickname,
      username: profile.username,
      thumbnail: isNewImg
        ? `https://cdn.mumumsit158.com/Members/MemberID-${
            profile.id
          }-${Date.now()}-ThumbNail.jpg`
        : "",
      email: profile.email,
      password: profile.password,
      confirmPassword: profile.confirmPassword,
      address: profile.address,
      memberIntroduction: profile.memberIntroduction,
      phone: profile.phone,
      id: profile.id,
    };

    if (isNewImg) {
      await S3.send(
        new PutObjectCommand({
          Bucket: "mumu",
          Key: `Members/MemberID-${profile.id}-${Date.now()}-ThumbNail.jpg`,
          Body: profile.thumbnail[0],
          ContentType: "image/jpeg",
        })
      );
    }

    const res = await axios.patch(
      `${URL}/Member/update-member-profile`,
      newProfile,
      { headers: { Authorization: jwt } }
    );

    if (res.status !== 200) throw Error;

    return res.data;
  } catch (error) {
    console.error(error);
  }
}

export async function updateBanner(x: IUpdateBanner) {
  try {
    const jwt = localStorage.getItem("token");

    if (!jwt) throw Error;

    const imgId = Date.now() + x.userId;

    const res = await S3.send(
      new PutObjectCommand({
        Bucket: "mumu",
        Key: `Members/MemberID-${x.userId}-Banner-${imgId}.jpg`,
        Body: x.file[0],
        ContentType: "image/jpeg",
      })
    );

    if (res.$metadata.httpStatusCode !== 200) throw Error;

    const newProfile = {
      banner: `https://cdn.mumumsit158.com/Members/MemberID-${x.userId}-Banner-${imgId}.jpg`,
      id: x.userId,
    };

    const res2 = await axios.patch(
      `${URL}/Member/update-member-banner`,
      newProfile,
      { params: newProfile, headers: { Authorization: jwt } }
    );

    if (res2.status !== 200) throw Error;

    return res2.data;
  } catch (error) {
    console.error(error);
  }
}
