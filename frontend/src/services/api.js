import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

// Resume APIs
export const uploadResume = async (formData) => {
  const response = await apiClient.post('/resume/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};

export const analyzeResume = async (resumeId) => {
  const response = await apiClient.post('/resume/analyze', { resumeId });
  return response.data;
};

export const reanalyzeResume = async (resumeId, jobDescription) => {
  const response = await apiClient.post('/resume/reanalyze', { resumeId, jobDescription });
  return response.data;
};

export const getMyResumes = async () => {
  const response = await apiClient.get('/resume/my-resumes');
  return response.data;
};

export const getResumes = getMyResumes; // Alias for convenience

export const getResumeById = async (id) => {
  const response = await apiClient.get(`/resume/${id}`);
  return response.data;
};

export const deleteResume = async (id) => {
  const response = await apiClient.delete(`/resume/${id}`);
  return response.data;
};

export const matchResume = async (resumeId, jobDescription) => {
  const response = await apiClient.post('/resume/match', { resumeId, jobDescription });
  return response.data;
};

export const getFeedback = async (resumeId) => {
  const response = await apiClient.get('/resume/feedback', { params: { resumeId } });
  return response.data;
};

// Dashboard APIs
export const getDashboardStats = async () => {
  const response = await apiClient.get('/dashboard');
  return response.data;
};

export const getAnalytics = async () => {
  const response = await apiClient.get('/dashboard/analytics');
  return response.data;
};

export const getReports = async () => {
  const response = await apiClient.get('/dashboard/reports');
  return response.data;
};

// Profile APIs
export const updateProfile = async (id, data) => {
  const response = await apiClient.put(`/profile/${id}`, data);
  return response.data;
};

// Jobs APIs
export const getAllJobs = async () => {
  const response = await apiClient.get('/jobs');
  return response.data;
};

export const getMatchedJobs = async () => {
  // In a real scenario, this might need a resumeId or user context
  const response = await apiClient.get('/jobs/user/my-jobs'); 
  return response.data;
};

// Student APIs
export const getAdminStudents = async () => {
  const response = await apiClient.get('/students');
  return response.data;
};

export const deleteAdminStudent = async (id) => {
  const response = await apiClient.delete(`/students/${id}`);
  return response.data;
};

export const createAdminStudent = async (data) => {
  const response = await apiClient.post('/students', data);
  return response.data;
};

// Admin Settings APIs
export const exportData = async () => {
  const response = await apiClient.get('/settings/export');
  return response.data;
};

export const importData = async (data) => {
  const response = await apiClient.post('/settings/import', data);
  return response.data;
};

export const resetSettings = async () => {
  const response = await apiClient.post('/settings/reset');
  return response.data;
};

export const deleteAllData = async () => {
  const response = await apiClient.delete('/settings');
  return response.data;
};

export default apiClient;
