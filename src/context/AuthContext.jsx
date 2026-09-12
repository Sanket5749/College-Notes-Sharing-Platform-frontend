import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiClient } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem('auth_user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });
  const [token, setToken] = useState(() => localStorage.getItem('auth_token'));
  const [loading, setLoading] = useState(true);

  // Validate session on app launch
  useEffect(() => {
    const verifySession = async () => {
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const response = await apiClient.get('/auth/me');
        if (response?.data?.user) {
          setUser(response.data.user);
          localStorage.setItem('auth_user', JSON.stringify(response.data.user));
        }
      } catch (err) {
        console.warn('Session verification failed, logging out:', err);
        logout();
      } finally {
        setLoading(false);
      }
    };

    verifySession();
  }, [token]);

  const login = async (prn, password) => {
    const res = await apiClient.post('/auth/login', {
      prn: prn.trim(),
      password,
    });

    if (res?.data?.token && res?.data?.user) {
      setToken(res.data.token);
      setUser(res.data.user);
      localStorage.setItem('auth_token', res.data.token);
      localStorage.setItem('auth_user', JSON.stringify(res.data.user));
      return res.data.user;
    }
    throw new Error(res?.message || 'Login failed.');
  };

  const register = async ({ name, prn, password, role }) => {
    const res = await apiClient.post('/auth/register', {
      name: name.trim(),
      prn: prn.trim(),
      password,
      role: role || 'student',
    });

    if (res?.data?.token && res?.data?.user) {
      setToken(res.data.token);
      setUser(res.data.user);
      localStorage.setItem('auth_token', res.data.token);
      localStorage.setItem('auth_user', JSON.stringify(res.data.user));
      return res.data.user;
    }
    throw new Error(res?.message || 'Registration failed.');
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user,
        loading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
