import axios from "axios";
const baseUrl = import.meta.env.VITE_API_URL;

export const checkProductInventory = async (productdata: object): Promise<string> => {
  const response = await fetch(`${baseUrl}/Order/CheckProductInventory`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(productdata)
  });

  const text = await response.text(); 
  return text;
};

export const createOrder = (orderData:object) => {
  return fetch(`${baseUrl}/Order/CreateOrder`, {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify(orderData)
      })
      .then(response => {
          if (!response.ok) {
              throw new Error('Network response was not ok');
          }
          // 无需接收数据，直接返回成功
          return console.log("成功");
      })
      .catch(error => {
          console.error('There was a problem with your fetch operation:', error);
          throw error;
      });
};


export const getOrders = async () => {
  try {
    const response = await fetch(`${baseUrl}/Order`);
    if (!response.ok) {
      throw new Error(`Failed to fetch orders: ${response.status} ${response.statusText}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching orders:', error);
    throw error; 
  }
};
export const getOrderProjects = async () => {
  try {
    const response = await fetch(`${baseUrl}/Order/list`);
    if (!response.ok) {
      throw new Error(`Failed to fetch orderProjects: ${response.status} ${response.statusText}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching orderProjects:', error);
    throw error; 
  }
};
export async function  getUserOrderProjects() {
  const jwt = localStorage.getItem("token")
  try {
    const res = await axios.get(`${baseUrl}/Order/UserOrder/list`, {
      headers: { Authorization: jwt },
    });
    return res.data;
  } catch (error) {
    console.error(error); 
  }
}