import { useAuthStore } from '@/store/auth';
import axios, { AxiosInstance } from 'axios';

const api: AxiosInstance = axios.create({
  baseURL: 'http://localhost:3002',
});

api.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().state.token;
    config.headers = config.headers ?? {}

    const publicRoutes = ['/login', '/register', '/home', '/subjects'].includes(window.location.pathname);

    if (!publicRoutes && token) {
      config.headers.Authorization = `Bearer ${token}`;
    } 

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;