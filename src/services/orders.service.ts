const baseUrl = import.meta.env.VITE_API_URL;


// export const createOrder = (orderData: object) => {
//   return fetch(`${baseUrl}/Order/CreateOrder`, {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json'
//     },
//     body: JSON.stringify(orderData)
//   })
//   .then(response => {
//     if (!response.ok) {
//       throw new Error('Network response was not ok');
//     }
//     // 解析 JSON 响应
//     return response.json();
//   })
//   .then(data => {
//     // 检查是否存在重定向 URL
//     const redirectUrl = data.redirectUrl;
//     if (redirectUrl) {
//       // 重定向到支付页面
//       window.location.href = redirectUrl;
//     } else {
//       throw new Error('Redirect URL is empty');
//     }
//   })
//   .catch(error => {
//     console.error('There was a problem with your fetch operation:', error);
//     throw error;
//   });
// };
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