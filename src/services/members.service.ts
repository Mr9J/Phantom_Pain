const baseUrl = import.meta.env.VITE_API_URL;

export const getMembers = async () => {
  try {
    const response = await fetch(`${baseUrl}/Member`);
    if (!response.ok) {
      throw new Error(`Failed to fetch members: ${response.status} ${response.statusText}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching members:', error);
    throw error; 
  }
};