import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import api from '../api/axios';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem('vimasho_user');
    if (stored) {
      setUser(JSON.parse(stored));
    }
    setLoading(false);
  }, []);

  const persist = (userData) => {
    localStorage.setItem('vimasho_user', JSON.stringify(userData));
    setUser(userData);
  };

  const login = useCallback(async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password });
    persist(data);
    return data;
  }, []);

  const register = useCallback(async (name, email, password, phone) => {
    const { data } = await api.post('/auth/register', { name, email, password, phone });
    persist(data);
    return data;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('vimasho_user');
    setUser(null);
  }, []);

  const updateProfile = useCallback(async (payload) => {
    const { data } = await api.put('/auth/me', payload);
    persist(data);
    return data;
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
