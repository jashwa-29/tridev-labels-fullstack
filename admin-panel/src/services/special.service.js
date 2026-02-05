import apiClient from '../lib/api-client';

export const specialService = {
  // Get all specials
  getAll: (isAdmin = false) => {
    return apiClient.get(`/specials${isAdmin ? '?admin=true' : ''}`);
  },

  // Create new special
  create: (formData) => {
    return apiClient.post('/specials', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  // Delete special
  delete: (id) => {
    return apiClient.delete(`/specials/${id}`);
  }
};
