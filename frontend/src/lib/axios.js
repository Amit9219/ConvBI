import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
});

api.interceptors.request.use((config) => {
  // Extract user from Zustand persist storage
  const authStateJSON = localStorage.getItem('auth-storage');
  if (authStateJSON) {
    try {
      const authState = JSON.parse(authStateJSON);
      const token = authState?.state?.user?.token;
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (e) {
      console.error('Failed to parse auth storage', e);
    }
  }
  return config;
});

export default api;
