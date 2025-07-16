import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const problemService = {
  async getProblems(filters = {}) {
    try {
      const params = new URLSearchParams();
      if (filters.difficulty) params.append('difficulty', filters.difficulty);
      if (filters.category) params.append('category', filters.category);
      if (filters.search) params.append('search', filters.search);
      
      const response = await api.get(`/problems?${params}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching problems:', error);
      return {
        problems: [],
        total: 0,
        page: 1,
        totalPages: 0
      };
    }
  },

  async getProblem(id) {
    try {
      const response = await api.get(`/problems/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching problem:', error);
      throw error;
    }
  },

  async submitSolution(problemId, code, language) {
    try {
      const response = await api.post('/submissions', {
        problemId,
        code,
        language
      });
      return response.data;
    } catch (error) {
      console.error('Error submitting solution:', error);
      throw error;
    }
  },

  async getSubmissions(problemId = null) {
    try {
      const url = problemId ? `/submissions?problemId=${problemId}` : '/submissions';
      const response = await api.get(url);
      return response.data;
    } catch (error) {
      console.error('Error fetching submissions:', error);
      return [];
    }
  }
};

export default problemService;