import axios from "axios";
const api = axios.create({
  baseURL: `http://localhost:3500/api/`,
});
api.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem("jsonwebtoken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
api.interceptors.response.use(  
  (response) => response,
  (error) => {
    if (error.response) {
      console.error("Response error:", error.response.data.error );
      if((error.response.data.error === 'Invalid token.')|| (error.response.data.error === "Access denied. No token provided.")){
        sessionStorage.removeItem("jsonwebtoken");
        window.location.href = "/";
      }
    } else if (error.request) {
      console.error("No response received:", error.request);
    } else {
      console.error("Error setting up request:", error.message);
    }
    return Promise.reject(error);
  }
);

export default api;
