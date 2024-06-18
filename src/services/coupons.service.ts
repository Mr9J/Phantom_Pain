import axios from "axios";
const baseUrl = import.meta.env.VITE_API_URL;

export async function getCouponList() {
    const jwt = localStorage.getItem("token")
    try {
      const res = await axios.get(`${baseUrl}/Coupon/couponList`, {
        headers: { Authorization: jwt },
      });
      return res.data;
    } catch (error) {
      console.error(error);
    }
  }