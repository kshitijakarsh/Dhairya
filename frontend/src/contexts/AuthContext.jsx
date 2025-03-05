import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { API_BASE_URL, ENDPOINTS, STORAGE_KEYS, ROLE_MAPPINGS } from '../constants';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
      if (token) {
        const response = await axios.get(`${API_BASE_URL}${ENDPOINTS.VERIFY}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUser(response.data);
      }
    } catch (error) {
      localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      const response = await axios.post(`${API_BASE_URL}${ENDPOINTS.LOGIN}`, {
        email,
        password
      });
      const { token, user } = response.data;
      localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
      setUser(user);
      return user;
    } catch (error) {
      throw error.response?.data?.message || 'Login failed';
    }
  };

  const register = async ({ name, email, password, role }) => {
    try {
      const response = await axios.post(`${API_BASE_URL}${ENDPOINTS.REGISTER}`, {
        name,
        email,
        password,
        role: ROLE_MAPPINGS[role]
      });

      const { token, user } = response.data;
      localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
      setUser(user);
      return user;
    } catch (error) {
      throw error.response?.data?.message || 'Registration failed';
    }
  };

  const logout = () => {
    localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
}; 