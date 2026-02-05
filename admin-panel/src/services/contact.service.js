import apiClient from '../lib/api-client';

export const contactService = {
  // Get all contacts
  getAll: (page = 1, limit = 10) => {
    return apiClient.get(`/contacts?page=${page}&limit=${limit}`);
  },

  // Get single contact
  getById: (id) => {
    return apiClient.get(`/contacts/${id}`);
  },

  // Update status
  updateStatus: (id, status) => {
    return apiClient.patch(`/contacts/${id}/status`, { status });
  },

  // Delete contact
  delete: (id) => {
    return apiClient.delete(`/contacts/${id}`);
  },
  
  // Get stats
  getStats: () => {
    return apiClient.get('/contacts/stats');
  }
};
