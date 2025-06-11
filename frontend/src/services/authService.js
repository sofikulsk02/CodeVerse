import axios from 'axios';
import { API_BASE_URL } from '../constants';

const API = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authService = {
  async login(email, password) {
    const response = await API.post('/auth/login', { email, password });
    return response.data;
  },

  async register(userData) {
    const response = await API.post('/auth/register', userData);
    return response.data;
  },

  async getProfile() {
    const response = await API.get('/auth/profile');
    return response.data.user;
  },
};

export default API;