import api from './api';

export const loginUser = async (username: string, password: string) => {
  try {
    const response = await api.post('/signin', {
      username,
      password,
    });
    return response;
  } catch (error) {
    throw error;
  }
};