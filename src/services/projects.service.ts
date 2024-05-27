const baseUrl = import.meta.env.VITE_API_BASE_URL;
//const baseURL = 'https://localhost:7144'
export const getProjects = async () => {
  try {
    const response = await fetch(`${baseUrl}/api/Project`);
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