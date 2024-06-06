import axios from "axios";

const baseUrl = import.meta.env.VITE_API_URL;

export const getProjects = async () => {
  try {
    const response = await fetch(`${baseUrl}/Project`);
    if (!response.ok) {
      throw new Error(
        `Failed to fetch projects: ${response.status} ${response.statusText}`
      );
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching projects:", error);
    throw error;
  }
};

export async function getAllProjects() {
  try {
    const res = await axios.get(`${baseUrl}/Project`);
    return res.data;
  } catch (error) {
    console.error(error);
  }
}

export async function getProjectCounts() {
  try {
    const res = await axios.get(`${baseUrl}/Project/Count`);
    return res.data;
  } catch (error) {
    console.error(error);
  }
}

export const getHomeProjects = async () => {
  try {
    const response = await fetch(`${baseUrl}/Home`);
    if (!response.ok) {
      throw new Error(`Failed to fetch projects: ${response.status} ${response.statusText}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching projects:', error);
    throw error; 
  }
};
export const getHomeCardPOP = async () => {
  try {
    const response = await fetch(`${baseUrl}/Home/POP`);
    if (!response.ok) {
      throw new Error(`Failed to fetch projects: ${response.status} ${response.statusText}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching projects:', error);
    throw error; 
  }
};