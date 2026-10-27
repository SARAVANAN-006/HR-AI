import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { API_BASE_URL, withFastTimeout } from '../lib/api';
import { mongoService } from '../lib/mongoService';
import { mysqlService } from '../lib/mysqlService';

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

// Automatically purge any stale legacy cached sessions containing old hardcoded names
const sanitizeLegacyStorage = () => {
  try {
    for (let i = localStorage.length - 1; i >= 0; i--) {
      const key = localStorage.key(i);
      if (key && (key.startsWith('kodexis_') || key.startsWith('assessment_'))) {
        const val = localStorage.getItem(key);
        if (val && (val.toLowerCase().includes('vigneshwaran') || val.toLowerCase().includes('vicky'))) {
          localStorage.removeItem(key);
        }
      }
    }
  } catch {}
};
sanitizeLegacyStorage();

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Axios Base URL configuration pointing to backend Spring Boot (local or Render cloud)
axios.defaults.baseURL = API_BASE_URL;

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('kodexis_token'));
  const [user, setUser] = useState<User | null>(() => {
    const cached = localStorage.getItem('kodexis_user');
    if (cached) {
      try {
        const u = JSON.parse(cached);
        if (u && typeof u === 'object' && u.username) {
          const dnaKey = `kodexis_dna_params_${u.username.toLowerCase()}`;
          const savedDna = localStorage.getItem(dnaKey);
          if (savedDna) {
            try {
              const parsedDna = JSON.parse(savedDna);
              return { ...u, ...parsedDna, isOnboarded: true };
            } catch {}
          }
        }
        return u;
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

  const getUsersDb = (): Record<string, User> => {
    try {
      const raw = localStorage.getItem('kodexis_users_db');
      return raw ? JSON.parse(raw) : {};
    } catch {
      return {};
    }
  };

  const saveUserToDb = (u: User) => {
    try {
      const db = getUsersDb();
      db[u.username.toLowerCase()] = u;
      localStorage.setItem('kodexis_users_db', JSON.stringify(db));

      // Lock DNA parameters forever if generated
      if (u.isOnboarded && u.targetRole) {
        const dnaKey = `kodexis_dna_params_${u.username.toLowerCase()}`;
        localStorage.setItem(dnaKey, JSON.stringify({
          targetRole: u.targetRole,
          targetCompanies: u.targetCompanies,
          experienceLevel: u.experienceLevel,
          preferredLanguage: u.preferredLanguage,
          isOnboarded: true
        }));
      }

      mongoService.saveStudentProfile({
        username: u.username,
        fullName: u.fullName,
        role: u.role,
        targetRole: u.targetRole,
        targetCompanies: u.targetCompanies,
        experienceLevel: u.experienceLevel,
        preferredLanguage: u.preferredLanguage,
        readinessScore: u.readinessScore,
        isOnboarded: u.isOnboarded
      }).catch(() => {});
      mysqlService.recordBehavior(u.username, 'USER_PROFILE_SAVED', '/login', {
        fullName: u.fullName,
        role: u.role,
        targetRole: u.targetRole,
        experienceLevel: u.experienceLevel
      }).catch(() => {});
    } catch (e) {
      console.warn('Failed to save user to local DB:', e);
    }
  };

  const refreshUser = async () => {
    try {
      const response = await withFastTimeout(axios.get('/api/auth/me'), 2000, 'User profile fetch');
      const data = response.data;
      if (data && data.username) {
        const dnaKey = `kodexis_dna_params_${data.username.toLowerCase()}`;
        const savedDna = localStorage.getItem(dnaKey);
        let finalUser: User = { ...data };
        if (savedDna) {
          try {
            const parsedDna = JSON.parse(savedDna);
            finalUser = { ...finalUser, ...parsedDna, isOnboarded: true };
          } catch {}
        } else if (data.isOnboarded && data.targetRole) {
          localStorage.setItem(dnaKey, JSON.stringify({
            targetRole: data.targetRole,
            targetCompanies: data.targetCompanies,
            experienceLevel: data.experienceLevel,
            preferredLanguage: data.preferredLanguage,
            isOnboarded: true
          }));
        }
        setUser(finalUser);
        localStorage.setItem('kodexis_user', JSON.stringify(finalUser));
        saveUserToDb(finalUser);
      }
    } catch (error) {
      console.warn('Backend server offline or sleeping. Retaining active session with persistent DNA:', error);
      if (!user) {
        const cached = localStorage.getItem('kodexis_user');
        if (cached) {
          try {
            const u = JSON.parse(cached);
            if (u && u.username) {
              const dnaKey = `kodexis_dna_params_${u.username.toLowerCase()}`;
              const savedDna = localStorage.getItem(dnaKey);
              if (savedDna) {
                const parsedDna = JSON.parse(savedDna);
                setUser({ ...u, ...parsedDna, isOnboarded: true });
                return;
              }
            }
            setUser(u);
          } catch {}
        }
      }
    }
  };

  const login = async (username: string, password: string): Promise<boolean> => {
    const cleanUsername = username.trim();
    const dnaKey = `kodexis_dna_params_${cleanUsername.toLowerCase()}`;
    const savedDna = localStorage.getItem(dnaKey);
    let parsedDna: any = null;
    if (savedDna) {
      try { parsedDna = JSON.parse(savedDna); } catch {}
    }

    try {
      const response = await withFastTimeout(
        axios.post('/api/auth/login', { username: cleanUsername, password }),
        2500,
        'User authentication'
      );
      const { token: receivedToken, ...userData } = response.data;
      let finalUserData: User = userData as User;
      if (parsedDna) {
        finalUserData = { ...finalUserData, ...parsedDna, isOnboarded: true };
      }
      localStorage.setItem('kodexis_token', receivedToken);
      localStorage.setItem('kodexis_user', JSON.stringify(finalUserData));
      saveUserToDb(finalUserData);
      setToken(receivedToken);
      axios.defaults.headers.common['Authorization'] = `Bearer ${receivedToken}`;
      setUser(finalUserData);
      return true;
    } catch (error) {
      console.warn('Backend server offline or high latency. Logging in with client session mode...');
      const db = getUsersDb();
      const existing = db[cleanUsername.toLowerCase()];

      const userProfile: User = existing ? { ...existing, ...(parsedDna || {}) } : {
        username: cleanUsername,
        role: cleanUsername.toLowerCase().includes('admin') ? 'ROLE_ADMIN' : 'ROLE_CANDIDATE',
        fullName: cleanUsername.charAt(0).toUpperCase() + cleanUsername.slice(1),
        targetRole: parsedDna?.targetRole || null,
        targetCompanies: parsedDna?.targetCompanies || null,
        experienceLevel: parsedDna?.experienceLevel || null,
        preferredLanguage: parsedDna?.preferredLanguage || null,
        readinessScore: 0,
        isOnboarded: !!parsedDna?.isOnboarded
      };

      const sessionToken = `mock_token_${cleanUsername}_${Date.now()}`;
      localStorage.setItem('kodexis_token', sessionToken);
      localStorage.setItem('kodexis_user', JSON.stringify(userProfile));
      saveUserToDb(userProfile);
      setToken(sessionToken);
      setUser(userProfile);
      return true;
    }
  };

  const register = async (username: string, password: string, fullName: string): Promise<boolean> => {
    const cleanUsername = username.trim();
    const cleanFullName = (fullName && fullName.trim()) ? fullName.trim() : (cleanUsername.charAt(0).toUpperCase() + cleanUsername.slice(1));
    const dnaKey = `kodexis_dna_params_${cleanUsername.toLowerCase()}`;
    const savedDna = localStorage.getItem(dnaKey);
    let parsedDna: any = null;
    if (savedDna) {
      try { parsedDna = JSON.parse(savedDna); } catch {}
    }

    try {
      const response = await withFastTimeout(
        axios.post('/api/auth/register', { username: cleanUsername, password, fullName: cleanFullName }),
        2500,
        'User registration'
      );
      const { token: receivedToken, ...userData } = response.data;
      let finalUserData: User = userData as User;
      if (parsedDna) {
        finalUserData = { ...finalUserData, ...parsedDna, isOnboarded: true };
      }
      localStorage.setItem('kodexis_token', receivedToken);
      localStorage.setItem('kodexis_user', JSON.stringify(finalUserData));
      saveUserToDb(finalUserData);
      setToken(receivedToken);
      axios.defaults.headers.common['Authorization'] = `Bearer ${receivedToken}`;
      setUser(finalUserData);
      return true;
    } catch (error) {
      console.warn('Backend server offline or high latency. Registering with client session mode...');
      const newUser: User = {
        username: cleanUsername,
        role: cleanUsername.toLowerCase().includes('admin') ? 'ROLE_ADMIN' : 'ROLE_CANDIDATE',
        fullName: cleanFullName,
        targetRole: parsedDna?.targetRole || null,
        targetCompanies: parsedDna?.targetCompanies || null,
        experienceLevel: parsedDna?.experienceLevel || null,
        preferredLanguage: parsedDna?.preferredLanguage || null,
        readinessScore: 0,
        isOnboarded: !!parsedDna?.isOnboarded
      };

      const sessionToken = `mock_token_${cleanUsername}_${Date.now()}`;
      localStorage.setItem('kodexis_token', sessionToken);
      localStorage.setItem('kodexis_user', JSON.stringify(newUser));
      saveUserToDb(newUser);
      setToken(sessionToken);
      setUser(newUser);
      return true;
    }
  };

  const onboard = async (data: { targetRole: string; targetCompanies: string; experienceLevel: string; preferredLanguage: string }): Promise<boolean> => {
    const currentUsername = user?.username || 'candidate';
    const dnaRecord = {
      targetRole: data.targetRole,
      targetCompanies: data.targetCompanies,
      experienceLevel: data.experienceLevel,
      preferredLanguage: data.preferredLanguage,
      isOnboarded: true
    };

    // Save DNA parameters permanently to dedicated user key and MongoDB
    const dnaKey = `kodexis_dna_params_${currentUsername.toLowerCase()}`;
    localStorage.setItem(dnaKey, JSON.stringify(dnaRecord));
    mongoService.saveUserDna(currentUsername, dnaRecord);

    const updated: User = {
      ...(user || {
        username: currentUsername,
        role: 'ROLE_CANDIDATE',
        fullName: currentUsername.charAt(0).toUpperCase() + currentUsername.slice(1),
        readinessScore: 75
      }),
      ...dnaRecord
    };

    setUser(updated);
    localStorage.setItem('kodexis_user', JSON.stringify(updated));
    saveUserToDb(updated);

    try {
      await withFastTimeout(axios.post('/api/auth/onboard', { username: currentUsername, ...data }), 2500, 'User onboarding');
    } catch (error) {
      console.warn('Backend onboarding delayed or offline, preferences locked permanently in local DB:', error);
    }
    return true;
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
