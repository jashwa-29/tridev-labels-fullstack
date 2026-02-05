import apiClient from '../lib/api-client';

export const serviceService = {
  // Get all services
  getAll: (isAdmin = false) => {
    return apiClient.get(`/services${isAdmin ? '?admin=true' : ''}`);
  },

  // Create new service
  create: (formData) => {
    return apiClient.post('/services', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  // Update service
  update: (id, formData) => {
    return apiClient.patch(`/services/admin/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  // Delete service
  delete: (id) => {
    return apiClient.delete(`/services/admin/${id}`);
  },

  // Reorder services
  reorder: (orders) => {
    return apiClient.post('/services/reorder', { orders });
  }
};
