import axios from "axios";

const baseUrl = import.meta.env.VITE_API_URL;


export const getProjectfromProductId = (id:number,memberId: number) => {
  return fetch(`${baseUrl}/Project/${id}/${memberId}`)
      .then(response =>{
          console.log(response)
          if(!response.ok){
              throw new Error('Network response was not ok');
          }
          return response.json();
      })
      .then(data => {
          // 在這裡處理從 API 返回的數據
          return data;
      })
      .catch(error => {
          console.error('There was a problem with your fetch operation:', error);
          throw error; // 將錯誤向外傳遞
      });

}




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
export async function getUserProject() {
  const jwt = localStorage.getItem("token")
  try {
    const res = await axios.get(`${baseUrl}/Project/userProject`, {
      headers: { Authorization: jwt },
    });
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

export async function getUserProjectCounts() {
  const jwt = localStorage.getItem("token")
  try {
    const res = await axios.get(`${baseUrl}/Project/UserProject/Count`, {
      headers: { Authorization: jwt },
    });
    return res.data;
  } catch (error) {
    console.error(error);
  }
}

export const getHomeProjects = async () => {
  try {
    const response = await fetch(`${baseUrl}/Home`);
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
export const getHomeCardPOP = async () => {
  try {
    const response = await fetch(`${baseUrl}/Home/POP`);
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
export const getHomeCardDayLeft = async () => {
  try {
    const response = await fetch(`${baseUrl}/Home/DayLeft`);
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
export async function getProjectType() {
  try {
    const res = await axios.get(`${baseUrl}/Home/ProjectType`);
    return res.data;
  } catch (error) {
    console.error(error);
  }
}
export async function getSearching<T>(
  keyword: string,
  page: number,
  type: number,
  orderby: string
): Promise<T> {
  try {
    const res = await axios.get(`${baseUrl}/Home/Searching`, {
      params: {
        keyword: keyword,
        page: page,
        type: type,
        orderby: orderby,
      },
    });
    return res.data as T;
  } catch (error) {
    console.error(error);
    throw error; // Rethrow the error to handle it elsewhere
  }
}
