import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Store getToken function
let getTokenFunction = null;

// Set getToken function (to be called from auth context)
export const setGetToken = (getToken) => {
  getTokenFunction = getToken;
};

// Request interceptor to add auth token
api.interceptors.request.use(
  async (config) => {
    // Get token from Clerk
    if (getTokenFunction) {
      try {
        const token = await getTokenFunction();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      } catch (error) {
        console.error('Failed to get token:', error);
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
      // Don't redirect if already on sign-in page
      if (window.location.pathname !== '/sign-in' && window.location.pathname !== '/sign-up') {
        // Handle unauthorized - redirect to login
        window.location.href = '/sign-in';
      }
    }
    return Promise.reject(error);
  }
);

export default api;

