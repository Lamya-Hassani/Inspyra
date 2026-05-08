import axios from 'axios';

const API = axios.create({
  baseURL: 'http://127.0.0.1:8000/api/',
});

API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Clear storage and trigger logout event if needed
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      // For a simple redirect without context hook:
      if (window.location.pathname.startsWith('/admin')) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export const getImageUrl = (path) => {
  if (!path) return 'https://images.unsplash.com/photo-1545241047-6083a3684587?q=80&w=800';
  if (path.startsWith('http')) return path;
  return `http://127.0.0.1:8000${path}`;
};

export default API;
