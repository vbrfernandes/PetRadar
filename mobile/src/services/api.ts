import axios from 'axios';
import { useAuthStore } from '../store/useAuthStore';

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://192.168.0.5:8000/api/v1';

export const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    // Obtém o token direto do estado da memória do Zustand
    const token = useAuthStore.getState().token; 
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Executa o logout no Zustand limpa estado e storage automaticamente
      useAuthStore.getState().logout();
    }
    return Promise.reject(error);
  }
);

export default api;