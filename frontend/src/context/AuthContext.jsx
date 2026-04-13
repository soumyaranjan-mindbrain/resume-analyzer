import React, { createContext, useContext, useEffect, useState } from 'react';
import * as authService from '../services/auth';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const checkAuth = async () => {
    try {
      const data = await authService.getMe();
      const userData = data.user;
      if (userData.role === 'student') userData.role = 'user';
      setUser(userData);
      localStorage.setItem('kredo_user', JSON.stringify(userData));
    } catch {
      setUser(null);
      localStorage.removeItem('kredo_user');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const savedUser = localStorage.getItem('kredo_user');
    if (savedUser) {
      try {
        const parsed = JSON.parse(savedUser);
        if (parsed.role === 'student') parsed.role = 'user';
        setUser(parsed);
      } catch {
        localStorage.removeItem('kredo_user');
      }
    }
    checkAuth();
  }, []);

  const login = async (email, password) => {
    const data = await authService.login(email, password);
    const userData = data.user;
    if (userData.role === 'student') userData.role = 'user';
    setUser(userData);
    localStorage.setItem('kredo_user', JSON.stringify(userData));
    return userData;
  };

  const registerUser = async (userData) => {
    return authService.register(userData);
  };

  const logout = async () => {
    try {
      await authService.logout();
    } finally {
      setUser(null);
      localStorage.removeItem('kredo_user');
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, register: registerUser, logout, loading, checkAuth }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
