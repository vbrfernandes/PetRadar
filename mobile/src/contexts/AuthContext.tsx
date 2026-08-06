import React, { createContext, useState, useEffect, useCallback, useMemo, ReactNode, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../services/api';

const STORAGE_USER_KEY = '@PetRadar:user';
const STORAGE_TOKEN_KEY = '@PetRadar:token';

export interface User {
  id: string;
  email: string;
  nome: string;
}

interface AuthContextData {
  signed: boolean;
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Inicializa o estado lendo o storage e injetando o Bearer Token no Axios
  useEffect(() => {
    async function loadStorageData() {
      try {
        const [[, storageUser], [, storageToken]] = await AsyncStorage.multiGet([
          STORAGE_USER_KEY,
          STORAGE_TOKEN_KEY,
        ]);

        if (storageUser && storageToken) {
          api.defaults.headers.common['Authorization'] = `Bearer ${storageToken}`;
          setUser(JSON.parse(storageUser));
        }
      } catch (error) {
        console.error('Falha ao carregar credenciais locais:', error);
      } finally {
        setLoading(false);
      }
    }

    loadStorageData();
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    // Alinhado com o LoginSchema no FastAPI (espera o campo "senha")
    const response = await api.post('/auth/login', {
      email,
      senha: password,
    });

    const { access_token } = response.data;

    // Configura o token imediatamente para as chamadas subsequentes
    api.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;

    const minimalUser: User = {
      id: '',
      email,
      nome: '',
    };

    setUser(minimalUser);

    await AsyncStorage.multiSet([
      [STORAGE_USER_KEY, JSON.stringify(minimalUser)],
      [STORAGE_TOKEN_KEY, access_token],
    ]);
  }, []);

  const signOut = useCallback(async () => {
    // Apaga apenas os dados de autenticação mantendo outras preferências salvas
    delete api.defaults.headers.common['Authorization'];
    await AsyncStorage.multiRemove([STORAGE_USER_KEY, STORAGE_TOKEN_KEY]);
    setUser(null);
  }, []);

  const contextValue = useMemo(
    () => ({
      signed: !!user,
      user,
      loading,
      signIn,
      signOut,
    }),
    [user, loading, signIn, signOut]
  );

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
};

// Hook customizado para facilitar a utilização e garantir o Provider
export function useAuth(): AuthContextData {
  const context = useContext(AuthContext);

  if (!context || Object.keys(context).length === 0) {
    throw new Error('useAuth deve ser utilizado dentro de um AuthProvider');
  }

  return context;
}