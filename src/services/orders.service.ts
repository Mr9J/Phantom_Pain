const baseUrl = import.meta.env.VITE_API_URL;

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