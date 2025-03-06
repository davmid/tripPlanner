import axios from 'axios';

const API_URL = 'http://localhost:3000/api/users';

export const getUsers = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    console.error("Błąd pobierania użytkowników:", error);
    return [];
  }
};
