import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL || 'http://localhost:8080',
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (!error.response) {
      return Promise.reject("Network error - server is unreachable");
    }
    
    const status = error.response.status;
    if (status === 401 || status === 403) {
      return Promise.reject("Unauthorized access - please log in again");
    }
    
    if (status === 404) {
      return Promise.reject("404 - Resource not found");
    }

    if (status >= 400 && status < 500) {
      return Promise.reject(error.response.data?.message || "Invalid API request");
    }

    return Promise.reject(error.response.data?.message || "Something went wrong on the server");
  }
);

export default api;
