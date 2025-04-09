import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const api = axios.create({
  baseURL: 'http://10.0.2.2:3500/api/', 
});

// Request Interceptor: Attach token
api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('jsonwebtoken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Handle token errors
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response) {
      console.error('Response error:', error.response.data?.error);
      const err = error.response.data?.error;

      if (
        err === 'Invalid token.' ||
        err === 'Access denied. No token provided.'
      ) {
        await AsyncStorage.removeItem('jsonwebtoken');
        // optionally navigate to login screen
      }
    } else if (error.request) {
      console.error('No response received:', error.request);
    } else {
      console.error('Error setting up request:', error.message);
    }

    return Promise.reject(error);
  }
);

export default api;
