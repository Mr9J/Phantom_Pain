import axios from "axios";

const baseUrl = import.meta.env.VITE_API_URL;

export async function getMembers() {
  try {
    const res = await axios.get(`${baseUrl}/Member`);
    return res.data;
  } catch (error) {
    console.error(error);
  }
}

export async function getMemberStaff() {
  const jwt = localStorage.getItem("token")
  try {
    const res = await axios.get(`${baseUrl}/Member/GetStaff`, {
      headers: { Authorization: jwt },
    });
    return res.data;
  } catch (error) {
    console.error(error);
  }
}

export async function getMemberCounts() {
  try {
    const res = await axios.get(`${baseUrl}/Member/Count`);
    return res.data;
  } catch (error) {
    console.error(error);
  }
}