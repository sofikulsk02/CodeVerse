import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ✨ Fixed token interceptor with better error handling
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      // Validate token format before sending
      const tokenParts = token.split('.');
      if (tokenParts.length === 3) {
        config.headers.Authorization = `Bearer ${token}`;
      } else {
        console.log('⚠️ Invalid token format detected, removing from storage');
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear invalid tokens
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      
      // Only redirect if not already on auth page
      if (!window.location.pathname.includes('/auth')) {
        window.location.href = '/auth';
      }
    }
    return Promise.reject(error);
  }
);

export const authService = {
  async login(email, password) {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },

  async register(userData) {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },

  async getProfile() {
    const response = await api.get('/users/profile');
    return response.data;
  },

  async updateProfile(userData) {
    const response = await api.put('/users/profile', userData);
    return response.data;
  },
};

export default api;