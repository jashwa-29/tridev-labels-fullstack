import apiClient from '../lib/api-client';

export const serviceService = {
  // Get all services
  getAll: async (isAdmin = false) => {
    return apiClient.get(`/services${isAdmin ? '?admin=true' : ''}`);
  },

  // Get single service by slug
  getBySlug: async (slug) => {
    return apiClient.get(`/services/${slug}`);
  },

  // Create service
  create: async (serviceData) => {
    return apiClient.post('/services', serviceData);
  },

  // Update service
  update: async (id, serviceData) => {
    return apiClient.patch(`/services/admin/${id}`, serviceData);
  },

  // Delete service
  delete: async (id) => {
    return apiClient.delete(`/services/admin/${id}`);
  },

  // Reorder services
  reorder: async (orders) => {
    return apiClient.post('/services/reorder', { orders });
  }
};
