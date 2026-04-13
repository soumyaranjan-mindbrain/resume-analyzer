import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const authAxios = axios.create({
  baseURL: `${API_BASE_URL}/auth`,
  withCredentials: true,
});

export const login = async (email, password) => {
  try {
    const response = await authAxios.post('/login', { email, password });
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: 'Login failed' };
  }
};

export const register = async (userData) => {
  try {
    const response = await authAxios.post('/register', userData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: 'Registration failed' };
  }
};

export const logout = async () => {
  try {
    const response = await authAxios.post('/logout');
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: 'Logout failed' };
  }
};

export const getMe = async () => {
  try {
    const response = await authAxios.get('/me');
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
