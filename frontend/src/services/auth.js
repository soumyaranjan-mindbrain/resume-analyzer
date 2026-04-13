import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const authAxios = axios.create({
  baseURL: `${API_BASE_URL}/auth`,
  withCredentials: true,
});

export const login = async (email, password) => {
  const response = await authAxios.post('/login', { email, password });
  return response.data;
};

export const register = async (userData) => {
  const response = await authAxios.post('/register', userData);
  return response.data;
};

export const logout = async () => {
  const response = await authAxios.post('/logout');
  return response.data;
};

export const getMe = async () => {
  const response = await authAxios.get('/me');
  return response.data;
};

export const changePassword = async (oldPassword, newPassword) => {
  const response = await authAxios.put('/change-password', { oldPassword, newPassword });
  return response.data;
};
