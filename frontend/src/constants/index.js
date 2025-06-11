export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const APP_NAME = import.meta.env.VITE_APP_NAME || 'CampusCode';

export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  DASHBOARD: '/dashboard',
  PROBLEMS: '/problems',
  CONTESTS: '/contests',
  PROFILE: '/profile',
  ADMIN: '/admin',
};

export const USER_ROLES = {
  ADMIN: 'admin',
  STUDENT: 'student',
};

export const PROBLEM_DIFFICULTIES = {
  EASY: 'easy',
  MEDIUM: 'medium',
  HARD: 'hard',
};

export const SUBMISSION_STATUS = {
  PENDING: 'pending',
  RUNNING: 'running',
  ACCEPTED: 'accepted',
  WRONG_ANSWER: 'wrong_answer',
  TIME_LIMIT_EXCEEDED: 'time_limit_exceeded',
  RUNTIME_ERROR: 'runtime_error',
  COMPILATION_ERROR: 'compilation_error',
};

export const PROGRAMMING_LANGUAGES = {
  JAVASCRIPT: 'javascript',
  PYTHON: 'python',
  JAVA: 'java',
  CPP: 'cpp',
  C: 'c',
};

export const THEME_COLORS = {
  PRIMARY: {
    50: '#eff6ff',
    500: '#3b82f6',
    600: '#2563eb',
    700: '#1d4ed8',
  },
  SUCCESS: {
    50: '#f0fdf4',
    500: '#22c55e',
    600: '#16a34a',
  },
  DANGER: {
    50: '#fef2f2',
    500: '#ef4444',
    600: '#dc2626',
  },
};