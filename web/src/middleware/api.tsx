import { useAuthStore } from '@/store/auth';
import axios, { AxiosInstance } from 'axios';

const api: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL,
});

api.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token;
    config.headers = config.headers ?? {}

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
