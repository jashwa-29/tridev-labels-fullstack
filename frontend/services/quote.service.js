import apiClient from '@/lib/api-client';

export const quoteService = {
  submit: async (quoteData) => {
    return apiClient.post('/quotes', quoteData);
  },

  // Admin methods (optional for now but good to have)
  getAll: async () => {
    return apiClient.get('/quotes');
  },

  updateStatus: async (id, status) => {
    return apiClient.patch(`/quotes/${id}`, { status });
  },

  delete: async (id) => {
    return apiClient.delete(`/quotes/${id}`);
  }
};
