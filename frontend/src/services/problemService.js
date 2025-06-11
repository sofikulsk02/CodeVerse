import API from './authService';

export const problemService = {
  async getAllProblems(page = 1, difficulty = '', category = '') {
    const params = new URLSearchParams();
    params.append('page', page);
    if (difficulty) params.append('difficulty', difficulty);
    if (category) params.append('category', category);
    
    const response = await API.get(`/problems?${params}`);
    return response.data;
  },

  async getProblemById(id) {
    const response = await API.get(`/problems/${id}`);
    return response.data;
  },

  async submitSolution(problemId, code, language) {
    const response = await API.post(`/problems/${problemId}/submit`, {
      code,
      language
    });
    return response.data;
  },

  async getSubmissions(problemId = null) {
    const url = problemId ? `/submissions?problemId=${problemId}` : '/submissions';
    const response = await API.get(url);
    return response.data;
  },

  async getSubmissionStatus(submissionId) {
    const response = await API.get(`/submissions/${submissionId}`);
    return response.data;
  }
};