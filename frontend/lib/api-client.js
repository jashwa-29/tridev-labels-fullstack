import axios from 'axios';

/**
 * Enhanced Axios instance for Tridev Labels Frontend
 * Features:
 * - Environment-aware baseURL
 * - Standardized error handling
 * - Request/Response interceptors for Auth
 * - Timeout and validation settings
 */

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000, // 15 seconds
});

// Helper to determine environment
const isDev = process.env.NODE_ENV === 'development';

/**
 * Standardized error handler
 * @param {Error} error 
 */
const handleApiError = (error) => {
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
      console.error(`[API Error] ${error.response.status} ${error.config?.url}:`, error.response.data);
    }
  } else if (error.request) {
    // Request was made but no response received
    errorResponse.message = 'Network Error: No response from server. Please check your connection.';
    if (isDev) {
      console.error(`[API Network Error] ${error.config?.url}: No response received`);
    }
  } else {
    // Something happened in setting up the request
    errorResponse.message = error.message;
    if (isDev) {
      console.error(`[API Request Error]:`, error.message);
    }
  }
  
  return Promise.reject(errorResponse);
};

// Request Interceptor
apiClient.interceptors.request.use(
  (config) => {
    // Inject Auth Token safely
    if (typeof window !== 'undefined') {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
    }
    
    if (isDev) {
        // Optional: Log requests in dev
        // console.log(`[API Request] ${config.method.toUpperCase()} ${config.url}`);
    }
    
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor
apiClient.interceptors.response.use(
  (response) => {
    // Handle successful responses
    // We return response.data to keep the services clean
    return response.data;
  },
  handleApiError
);

export default apiClient;
