import { useAuthStore } from '@/store/auth';
import axios from 'axios';

const api = axios.create({
  baseURL: "http://localhost:3002",
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().state.token;


    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;