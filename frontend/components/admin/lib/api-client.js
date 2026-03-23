import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:5000';

const apiClient = axios.create({
  baseURL: `${API_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 300000,
});

const isDev = process.env.NODE_ENV === 'development';

const handleApiError = (error) => {
  const errorResponse = {
    message: 'An unexpected technical error occurred',
    status: error.response?.status,
    data: error.response?.data,
    originalError: error
  };

  if (error.response) {
    errorResponse.message = error.response.data?.message || error.response.data?.error || `Server Error: ${error.response.status}`;
    
    if (error.response.status === 401 && typeof window !== 'undefined' && window.location.pathname !== '/admin') {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/admin';
    }

    if (isDev) {
      console.error(`[Admin API Error] ${error.response.status} ${error.config?.url}:`, error.response.data);
    }
  } else if (error.request) {
    errorResponse.message = 'Network Exception: No response from management server.';
    if (isDev) {
      console.error(`[Admin API Network Error] ${error.config?.url}: No response received`);
    }
  } else {
    errorResponse.message = error.message;
  }
  
  return Promise.reject(errorResponse);
};

apiClient.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response) => response.data,
  handleApiError
);

export default apiClient;
