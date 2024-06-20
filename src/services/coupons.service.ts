import axios from "axios";
const baseUrl = import.meta.env.VITE_API_URL;

export async function getCouponInfo() {
  try {
    const res = await axios.get(`${baseUrl}/Coupon`);
    return res.data;
  } catch (error) {
    console.error(error);
  }
}

export async function getCouponList() {
  const jwt = localStorage.getItem("token");
  try {
    const res = await axios.get(`${baseUrl}/Coupon/CouponList`, {
      headers: { Authorization: jwt },
    });
    return res.data;
  } catch (error) {
    console.error(error);
  }
}

export const getCoupons = (
  couponsId: string,
  projectId: number
): Promise<number | string> => {
  return fetch(`${baseUrl}/Coupon/${couponsId}/${projectId}`)
    .then((response) => {
      if (!response.ok) {
        console.log("204");
        return "204";
      }
      return response.json(); // 假設回應是JSON格式
    })
    .then((data) => {
      if (typeof data === "number") {
        return data; // 返回折扣趴數
      } else {
        throw new Error("Invalid response format");
      }
    })
    .catch((error) => {
      console.error("There was a problem with your fetch operation:", error);
      throw error;
    });
};

export const getCouponsUsedList = async (
  couponsId: number
): Promise<number> => {
  const jwt = localStorage.getItem("token");
  try {
    const res = await axios.get(`${baseUrl}/Coupon/UsedList/${couponsId}`, {
      headers: { Authorization: jwt },
    });
    return res.data;
  } catch (error) {
    console.error(error);
    return 0;
  }
};
