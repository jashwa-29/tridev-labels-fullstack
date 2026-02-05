import apiClient from '../lib/api-client';

export const galleryService = {
  // Get all gallery items
  getAll: (isAdmin = false) => {
    return apiClient.get(`/gallery${isAdmin ? '?admin=true' : ''}`);
  },

  // Create new gallery item
  create: (formData) => {
    return apiClient.post('/gallery', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  // Update gallery item
  update: (id, formData) => {
    const isFormData = formData instanceof FormData;
    return apiClient.put(`/gallery/${id}`, formData, {
      headers: {
        'Content-Type': isFormData ? 'multipart/form-data' : 'application/json',
      },
    });
  },

  // Delete gallery item
  delete: (id) => {
    return apiClient.delete(`/gallery/${id}`);
  },

  // Reorder gallery items
  reorder: (orders) => {
    return apiClient.post('/gallery/reorder', { orders });
  }
};
