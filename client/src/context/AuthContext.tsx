import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { User } from '../types';
import { authApi, getStoredToken, setStoredToken, removeStoredToken } from '../services/api';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, pass: string) => Promise<{ success: boolean; message?: string }>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(() => getStoredToken());
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const clearLocalAuth = useCallback(() => {
    removeStoredToken();
    setToken(null);
    setUser(null);
  }, []);

  const logout = useCallback(async () => {
    try {
      await authApi.logout();
    } catch (e) {
      // Ignore network errors during logout
    } finally {
      clearLocalAuth();
    }
  }, [clearLocalAuth]);

  // Handle global 401 Unauthorized events from Axios
  useEffect(() => {
    const handleUnauthorized = () => {
      clearLocalAuth();
    };

    window.addEventListener('auth:unauthorized', handleUnauthorized);
    return () => window.removeEventListener('auth:unauthorized', handleUnauthorized);
  }, [clearLocalAuth]);

  // Initial auth verification on mount
  useEffect(() => {
    let isMounted = true;

    async function checkAuth() {
      const currentToken = getStoredToken();
      if (currentToken) {
        try {
          const res = await authApi.getMe();
          if (isMounted) {
            if (res.success && res.user) {
              setUser(res.user);
              setToken(currentToken);
            } else {
              clearLocalAuth();
            }
          }
        } catch (e) {
          if (isMounted) {
            clearLocalAuth();
          }
        }
      } else {
        if (isMounted) {
          setUser(null);
          setToken(null);
        }
      }
      if (isMounted) {
        setIsLoading(false);
      }
    }

    checkAuth();

    return () => {
      isMounted = false;
    };
  }, [clearLocalAuth]);

  const login = async (email: string, pass: string) => {
    try {
      const res = await authApi.login({ email, password: pass });
      if (res.success && res.token) {
        setStoredToken(res.token);
        setToken(res.token);
        setUser(res.user);
        return { success: true };
      }
      return { success: false, message: res.message || 'Login failed' };
    } catch (err: any) {
      return { success: false, message: err.response?.data?.message || 'Invalid credentials' };
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
