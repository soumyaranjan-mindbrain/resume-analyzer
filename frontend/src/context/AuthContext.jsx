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
<<<<<<< HEAD
      // Map student to user role for frontend consistency
      if (userData.role === 'student') userData.role = 'user';
      setUser(userData);
    } catch (error) {
=======
      if (userData.role === 'student') userData.role = 'user';
      setUser(userData);
      localStorage.setItem('kredo_user', JSON.stringify(userData));
    } catch {
>>>>>>> 41b8693f4b056f0286c9dde1c76a3df58538fe9e
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
<<<<<<< HEAD
      } catch (e) {
        localStorage.removeItem('kredo_user');
      }
    }
    // Verify session with backend
=======
      } catch {
        localStorage.removeItem('kredo_user');
      }
    }
>>>>>>> 41b8693f4b056f0286c9dde1c76a3df58538fe9e
    checkAuth();
  }, []);

  const login = async (email, password) => {
<<<<<<< HEAD
    try {
      const data = await authService.login(email, password);
      const userData = data.user;
      if (userData.role === 'student') userData.role = 'user';
      setUser(userData);
      localStorage.setItem('kredo_user', JSON.stringify(userData));
      return userData;
    } catch (error) {
      throw error;
    }
  };


  const registerUser = async (userData) => {
    try {
      const data = await authService.register(userData);
      return data;
    } catch (error) {
      throw error;
    }
=======
    const data = await authService.login(email, password);
    const userData = data.user;
    if (userData.role === 'student') userData.role = 'user';
    setUser(userData);
    localStorage.setItem('kredo_user', JSON.stringify(userData));
    return userData;
  };

  const registerUser = async (userData) => {
    return authService.register(userData);
>>>>>>> 41b8693f4b056f0286c9dde1c76a3df58538fe9e
  };

  const logout = async () => {
    try {
      await authService.logout();
<<<<<<< HEAD
    } catch (error) {
      console.error('Logout error:', error);
=======
>>>>>>> 41b8693f4b056f0286c9dde1c76a3df58538fe9e
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
