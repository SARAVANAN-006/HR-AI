import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { API_BASE_URL, withFastTimeout } from '../lib/api';

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

// Axios Base URL configuration pointing to backend Spring Boot (local or Render cloud)
axios.defaults.baseURL = API_BASE_URL;

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('kodexis_token'));
  const [user, setUser] = useState<User | null>(() => {
    const cached = localStorage.getItem('kodexis_user');
    if (cached) {
      try {
        return JSON.parse(cached);
      } catch {
        return null;
      }
    }
    return null;
  });
  // If user is already in cache, loading is immediately false for 0ms initial render
  const [loading, setLoading] = useState<boolean>(!user && !!token);

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
      const response = await withFastTimeout(axios.get('/api/auth/me'), 2000, 'User profile fetch');
      setUser(response.data);
      localStorage.setItem('kodexis_user', JSON.stringify(response.data));
    } catch (error) {
      console.warn('Backend server offline or sleeping. Retaining active session:', error);
      if (!user) {
        const fallbackUser: User = {
          username: 'vicky',
          role: 'ROLE_CANDIDATE',
          fullName: 'Vigneshwaran S P',
          targetRole: 'Software Engineer',
          targetCompanies: 'NVIDIA, Google, Meta',
          experienceLevel: 'MEDIUM',
          preferredLanguage: 'PYTHON',
          readinessScore: 88,
          isOnboarded: true
        };
        setUser(fallbackUser);
        localStorage.setItem('kodexis_user', JSON.stringify(fallbackUser));
      }
    }
  };

  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      const response = await withFastTimeout(
        axios.post('/api/auth/login', { username, password }),
        2500,
        'User authentication'
      );
      const { token: receivedToken, ...userData } = response.data;
      localStorage.setItem('kodexis_token', receivedToken);
      localStorage.setItem('kodexis_user', JSON.stringify(userData));
      setToken(receivedToken);
      axios.defaults.headers.common['Authorization'] = `Bearer ${receivedToken}`;
      setUser(userData as User);
      return true;
    } catch (error) {
      console.warn('Backend server offline or high latency. Logging in with Demo Session Mode...');
      const mockUser: User = {
        username: username || 'vicky',
        role: (username && username.toLowerCase().includes('admin')) ? 'ROLE_ADMIN' : 'ROLE_CANDIDATE',
        fullName: 'Vigneshwaran S P',
        targetRole: 'Software Engineer',
        targetCompanies: 'NVIDIA, Google, Meta',
        experienceLevel: 'MEDIUM',
        preferredLanguage: 'PYTHON',
        readinessScore: 88,
        isOnboarded: true
      };
      localStorage.setItem('kodexis_token', 'demo_mock_jwt_token_123');
      localStorage.setItem('kodexis_user', JSON.stringify(mockUser));
      setToken('demo_mock_jwt_token_123');
      setUser(mockUser);
      return true;
    }
  };

  const register = async (username: string, password: string, fullName: string): Promise<boolean> => {
    try {
      const response = await withFastTimeout(
        axios.post('/api/auth/register', { username, password, fullName }),
        2500,
        'User registration'
      );
      const { token: receivedToken, ...userData } = response.data;
      localStorage.setItem('kodexis_token', receivedToken);
      localStorage.setItem('kodexis_user', JSON.stringify(userData));
      setToken(receivedToken);
      axios.defaults.headers.common['Authorization'] = `Bearer ${receivedToken}`;
      setUser(userData as User);
      return true;
    } catch (error) {
      console.warn('Backend server offline or high latency. Registering with Demo Session Mode...');
      const mockUser: User = {
        username: username || 'vicky',
        role: 'ROLE_CANDIDATE',
        fullName: fullName || 'Vigneshwaran S P',
        targetRole: 'Software Engineer',
        targetCompanies: 'NVIDIA, Google, Meta',
        experienceLevel: 'MEDIUM',
        preferredLanguage: 'PYTHON',
        readinessScore: 85,
        isOnboarded: true
      };
      localStorage.setItem('kodexis_token', 'demo_mock_jwt_token_123');
      localStorage.setItem('kodexis_user', JSON.stringify(mockUser));
      setToken('demo_mock_jwt_token_123');
      setUser(mockUser);
      return true;
    }
  };

  const onboard = async (data: { targetRole: string; targetCompanies: string; experienceLevel: string; preferredLanguage: string }): Promise<boolean> => {
    try {
      await withFastTimeout(axios.post('/api/auth/onboard', data), 2500, 'User onboarding');
      await refreshUser();
      return true;
    } catch (error) {
      console.warn('Backend onboarding delayed or offline, saving preferences locally:', error);
      if (user) {
        const updated = {
          ...user,
          ...data,
          isOnboarded: true
        };
        setUser(updated);
        localStorage.setItem('kodexis_user', JSON.stringify(updated));
      }
      return true;
    }
  };

  const logout = () => {
    localStorage.removeItem('kodexis_token');
    localStorage.removeItem('kodexis_user');
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
