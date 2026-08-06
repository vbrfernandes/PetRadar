import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Lê variável do ambiente Expo (SDK 49+) evitando hardcode no repositório
const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://10.0.2.2:8000/api/v1';

const api = axios.create({
  baseURL: API_URL,
  timeout: 10000, // Previne requisições infinitas em redes instáveis
});

api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('@PetRadar:token');
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
    // Trata expiração do token JWT centralizadamente
    if (error.response?.status === 401) {
      await AsyncStorage.multiRemove(['@PetRadar:token', '@PetRadar:user']);
      // A mudança no AsyncStorage ou um evento no AuthContext deve forçar a desautenticação
    }
    return Promise.reject(error);
  }
);

export default api;