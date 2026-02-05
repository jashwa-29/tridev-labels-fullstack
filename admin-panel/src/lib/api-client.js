import axios from 'axios';

/**
 * Enhanced Axios instance for Tridev Labels Admin Panel
 * Features:
 * - Environment-aware baseURL
 * - Standardized error handling
 * - Auto-logout on session expiration (401)
 * - Request/Response interceptors for Auth
 */

const API_URL = import.meta.env.VITE_API_BASE_URL;

const apiClient = axios.create({
  baseURL: `${API_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 300000, // 5 minutes for heavy industrial uploads/data
});

// Helper to determine environment
const isDev = import.meta.env.DEV;

/**
 * Standardized error handler for Admin Panel
 * @param {Error} error 
 */
const handleApiError = (error) => {
  const errorResponse = {
    message: 'An unexpected technical error occurred',
    status: error.response?.status,
    data: error.response?.data,
    originalError: error
  };

  if (error.response) {
    // Server responded with a status code out of 2xx
    errorResponse.message = error.response.data?.message || error.response.data?.error || `Server Error: ${error.response.status}`;
    
    // Auto-logout on 401 (Session Expired)
    // Only redirect if NOT already on the login page to avoid infinite loops 
    // and to allow bad credentials errors to show on the login page.
    if (error.response.status === 401 && window.location.pathname !== '/') {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/';
    }

    if (isDev) {
      console.error(`[Admin API Error] ${error.response.status} ${error.config?.url}:`, error.response.data);
    }
  } else if (error.request) {
    // Request was made but no response received
    errorResponse.message = 'Network Exception: No response from management server.';
    if (isDev) {
      console.error(`[Admin API Network Error] ${error.config?.url}: No response received`);
    }
  } else {
    // Something happened in setting up the request
    errorResponse.message = error.message;
  }
  
  return Promise.reject(errorResponse);
};

// Request Interceptor
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor
apiClient.interceptors.response.use(
  (response) => {
    // Standardize to return data directly
    return response.data;
  },
  handleApiError
);

export default apiClient;
