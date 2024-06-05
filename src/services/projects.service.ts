const baseUrl = import.meta.env.VITE_API_URL;

export const getProjects = async () => {
  try {
    const response = await fetch(`${baseUrl}/Project`);
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