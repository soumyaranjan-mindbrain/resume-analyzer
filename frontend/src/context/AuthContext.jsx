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

      setUser(userData);
      localStorage.setItem('mindvista_user', JSON.stringify(userData));
    } catch {
      // Error is intentionally ignored as we just reset user state
      setUser(null);
      localStorage.removeItem('mindvista_user');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let savedUser = localStorage.getItem('mindvista_user');

    // Migration: Check for old kredo_user key if new one is missing
    if (!savedUser) {
      const oldUser = localStorage.getItem('kredo_user');
      if (oldUser) {
        localStorage.setItem('mindvista_user', oldUser);
        localStorage.removeItem('kredo_user');
        savedUser = oldUser;
      }
    }

    if (savedUser) {
      try {
        const parsed = JSON.parse(savedUser);
        setUser(parsed);
      } catch (e) {
        localStorage.removeItem('mindvista_user');
      }
    }
    // Verify session with backend
    checkAuth();
  }, []);

  const login = async (email, password) => {
    try {
      const data = await authService.login(email, password);
      const userData = data.user;
      setUser(userData);
      localStorage.setItem('mindvista_user', JSON.stringify(userData));

      // Ensure token is set if backend returned it
      if (data.token) {
        localStorage.setItem('auth_token', data.token);
      }

      return userData;
    } catch (error) {
      throw error;
    }
  };

  const registerUser = async (userData) => {
    try {
      const data = await authService.register(userData);
      return data; // returns { msg, email }
    } catch (error) {
      throw error;
    }
  };

  const verifyOTPUser = async (email, otp) => {
    try {
      const data = await authService.verifyOTP(email, otp);
      const userResData = data.user;
      setUser(userResData);
      localStorage.setItem('mindvista_user', JSON.stringify(userResData));
      if (data.token) {
        localStorage.setItem('auth_token', data.token);
      }
      return userResData;
    } catch (error) {
      throw error;
    }
  };

  const resendOTPUser = async (email) => {
    try {
      return await authService.resendOTP(email);
    } catch (error) {
      throw error;
    }
  };

  const updateOnboarding = async (onboardingData) => {
    try {
      const data = await authService.completeOnboarding(onboardingData);
      const updatedUser = data.user;
      setUser(updatedUser);
      localStorage.setItem('mindvista_user', JSON.stringify(updatedUser));
      return updatedUser;
    } catch (error) {
      throw error;
    }
  };


  const logout = async (redirectPath = '/') => {
    try {
      await authService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
      localStorage.removeItem('mindvista_user');
      localStorage.removeItem('auth_token');
      // Force a full reload to the target page to break the redirect cycle
      window.location.href = redirectPath;
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      login,
      register: registerUser,
      verifyOTP: verifyOTPUser,
      resendOTP: resendOTPUser,
      completeOnboarding: updateOnboarding,
      logout,
      loading,
      checkAuth
    }}>

      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
