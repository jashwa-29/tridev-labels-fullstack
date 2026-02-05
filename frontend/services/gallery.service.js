import apiClient from '../lib/api-client';

export const galleryService = {
  // Get all gallery items
  getAll: async (isAdmin = false) => {
    return apiClient.get(`/gallery${isAdmin ? '?admin=true' : ''}`);
  },

  // Reorder gallery items
  reorder: async (orders) => {
    return apiClient.post('/gallery/reorder', { orders });
  }
};
