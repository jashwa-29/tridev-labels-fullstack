import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000, // Increased to 15 seconds
});

// Helper to determine environment
const isDev = process.env.NODE_ENV === 'development';

// Request Interceptor
apiClient.interceptors.request.use(
  (config) => {
    // Progressively enhance with auth if needed
    if (typeof window !== 'undefined') {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor
apiClient.interceptors.response.use(
  (response) => {
    return response.data; // Standardize to return data directly
  },
  (error) => {
    const errorResponse = {
      message: 'An unexpected error occurred',
      status: error.response?.status,
      data: error.response?.data,
      originalError: error
    };

    if (error.response) {
      // Server responded with a status code out of 2xx
      errorResponse.message = error.response.data?.message || `Server Error: ${error.response.status}`;
      if (isDev) {
        console.error(`[API Error] ${error.response.status} ${error.config.url}:`, error.response.data);
      }
    } else if (error.request) {
      // Request was made but no response received
      errorResponse.message = 'No response from server. Please check your connection.';
      if (isDev) {
        console.error(`[API Network Error] ${error.config.url}: No response received`);
      }
    } else {
      // Something happened in setting up the request
      errorResponse.message = error.message;
      if (isDev) {
        console.error(`[API Request Error]:`, error.message);
      }
    }
    
    return Promise.reject(errorResponse);
  }
);

export default apiClient;
