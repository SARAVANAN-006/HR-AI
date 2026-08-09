import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

interface User {
  username: string;
  role: string;
  fullName: string;
  targetRole: string | null;
  targetCompanies: string | null;
  experienceLevel: string | null;
  preferredLanguage: string | null;
  readinessScore: number;
  isOnboarded: boolean;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  register: (username: string, password: string, fullName: string) => Promise<boolean>;
  onboard: (data: { targetRole: string; targetCompanies: string; experienceLevel: string; preferredLanguage: string }) => Promise<boolean>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Axios Base URL configuration pointing to backend Spring Boot
axios.defaults.baseURL = 'http://localhost:8080';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('kodexis_token'));
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      refreshUser().finally(() => setLoading(false));
    } else {
      delete axios.defaults.headers.common['Authorization'];
      setLoading(false);
    }
  }, [token]);

  const refreshUser = async () => {
    try {
      const response = await axios.get('/api/auth/me');
      setUser(response.data);
    } catch (error) {
      console.error('Failed to fetch user profiles:', error);
      logout();
    }
  };

  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      const response = await axios.post('/api/auth/login', { username, password });
      const { token: receivedToken, ...userData } = response.data;
      localStorage.setItem('kodexis_token', receivedToken);
      setToken(receivedToken);
      axios.defaults.headers.common['Authorization'] = `Bearer ${receivedToken}`;
      setUser(userData as User);
      return true;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const register = async (username: string, password: string, fullName: string): Promise<boolean> => {
    try {
      const response = await axios.post('/api/auth/register', { username, password, fullName });
      const { token: receivedToken, ...userData } = response.data;
      localStorage.setItem('kodexis_token', receivedToken);
      setToken(receivedToken);
      axios.defaults.headers.common['Authorization'] = `Bearer ${receivedToken}`;
      setUser(userData as User);
      return true;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  };

  const onboard = async (data: { targetRole: string; targetCompanies: string; experienceLevel: string; preferredLanguage: string }): Promise<boolean> => {
    try {
      await axios.post('/api/auth/onboard', data);
      await refreshUser();
      return true;
    } catch (error) {
      console.error('Onboarding failed:', error);
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('kodexis_token');
    setToken(null);
    setUser(null);
    delete axios.defaults.headers.common['Authorization'];
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, onboard, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
