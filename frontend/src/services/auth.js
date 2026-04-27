import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const authAxios = axios.create({
  baseURL: `${API_BASE_URL}/auth`,
  withCredentials: true,
});

export const login = async (email, password) => {
  try {
    const response = await authAxios.post('/login', { email, password });
    // Store token if backend sends it in body
    if (response.data.token) {
      localStorage.setItem('auth_token', response.data.token);
    }
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: 'Login failed' };
  }
};

export const register = async (userData) => {
  try {
    const response = await authAxios.post('/register', userData);
    if (response.data.token) {
      localStorage.setItem('auth_token', response.data.token);
    }
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: 'Registration failed' };
  }
};

export const logout = async () => {
  try {
    const response = await authAxios.post('/logout');
    localStorage.removeItem('auth_token');
    return response.data;
  } catch (error) {
    localStorage.removeItem('auth_token');
    throw error.response?.data || { error: 'Logout failed' };
  }
};

export const getMe = async () => {
  try {
    const token = localStorage.getItem('auth_token');
    const response = await authAxios.get('/me', {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: 'Not authenticated' };
  }
};

export const changePassword = async (oldPassword, newPassword) => {
  try {
    const response = await authAxios.put('/change-password', { oldPassword, newPassword });
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: 'Password change failed' };
  }
};

export const verifyOTP = async (email, otp) => {
  try {
    const response = await authAxios.post('/verify-otp', { email, otp });
    if (response.data.token) {
      localStorage.setItem('auth_token', response.data.token);
    }
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: 'OTP verification failed' };
  }
};

export const resendOTP = async (email) => {
  try {
    const response = await authAxios.post('/resend-otp', { email });
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: 'Failed to resend OTP' };
  }
};

export const completeOnboarding = async (onboardingData) => {
  try {
    const response = await authAxios.put('/onboarding', onboardingData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: 'Onboarding failed' };
  }
};

