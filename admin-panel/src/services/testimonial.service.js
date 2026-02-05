import apiClient from '../lib/api-client';

export const testimonialService = {
  // Get all testimonials
  getAll: (isAdmin = false) => {
    return apiClient.get(`/testimonials${isAdmin ? '?admin=true' : ''}`);
  },

  // Get by ID
  getById: (id) => {
    return apiClient.get(`/testimonials/${id}`);
  },

  // Create new testimonial
  create: (formData) => {
    return apiClient.post('/testimonials', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  // Update testimonial
  update: (id, formData) => {
    const isFormData = formData instanceof FormData;
    return apiClient.put(`/testimonials/${id}`, formData, {
      headers: {
        'Content-Type': isFormData ? 'multipart/form-data' : 'application/json',
      },
    });
  },

  // Delete testimonial
  delete: (id) => {
    return apiClient.delete(`/testimonials/${id}`);
  },

  // Reorder testimonials
  reorder: (orders) => {
    return apiClient.post('/testimonials/reorder', { orders });
  }
};
