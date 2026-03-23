import apiClient from '../lib/api-client';

export const quoteService = {
  // Get all quotes
  getAll: (page = 1, limit = 10, source = null) => {
    const sourceParam = source ? `&source=${source}` : '';
    return apiClient.get(`/quotes?page=${page}&limit=${limit}${sourceParam}`);
  },

  // Get single quote
  getById: (id) => {
    return apiClient.get(`/quotes/${id}`);
  },

  // Update status
  updateStatus: (id, status) => {
    return apiClient.patch(`/quotes/${id}/status`, { status });
  },

  // Delete quote
  delete: (id) => {
    return apiClient.delete(`/quotes/${id}`);
  },
  
  // Get stats
  getStats: () => {
    return apiClient.get('/quotes/stats');
  }
};
