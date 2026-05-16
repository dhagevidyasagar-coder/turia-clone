export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5005/api';

export const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return token ? { 'Authorization': `Bearer ${token}` } : {};
};
