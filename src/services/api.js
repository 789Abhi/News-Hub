import axios from 'axios';

const API_URL = 'https://jsonplaceholder.typicode.com';

export const fetchArticles = async (searchParams) => {
  const response = await axios.get(`${API_URL}/posts`, { params: searchParams });
  return response.data;
};

export const fetchUserPreferences = async () => {
  // Mock user preferences
  return {
    sources: ['TechCrunch', 'Wired'],
    categories: ['Technology', 'Science'],
    authors: ['John Doe', 'Jane Smith'],
  };
};

