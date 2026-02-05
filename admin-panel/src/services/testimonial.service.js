import apiClient from '../lib/api-client';

/**
 * Service for Client Testimonials management
 * Communicates with /api/testimonials endpoints
 */
export const testimonialService = {
  /**
   * Fetch all client testimonials
   * @param {boolean} isAdmin - Whether to include hidden items
   * @returns {Promise<{data: Array}>}
   */
  async getAll(isAdmin = false) {
    return apiClient.get('/testimonials', { params: { admin: isAdmin ? 'true' : undefined } });
  },

  /**
   * Fetch a single testimonial by ID
   * @param {string} id - Database ObjectID
   */
  async getById(id) {
    if (!id) throw new Error('Testimonial ID is required');
    return apiClient.get(`/testimonials/${id}`);
  },

  /**
   * Create a new client testimonial (Multipart/FormData for images)
   * @param {FormData} formData 
   */
  async create(formData) {
    return apiClient.post('/testimonials', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },

  /**
   * Update an existing testimonial
   * @param {string} id - Database ObjectID
   * @param {FormData|Object} formData 
   */
  async update(id, formData) {
    const isFormData = formData instanceof FormData;
    return apiClient.put(`/testimonials/${id}`, formData, {
      headers: {
        'Content-Type': isFormData ? 'multipart/form-data' : 'application/json',
      },
    });
  },

  /**
   * Remove a testimonial permanently
   * @param {string} id - Database ObjectID
   */
  async delete(id) {
    return apiClient.delete(`/testimonials/${id}`);
  },

  /**
   * Batch update ordering of testimonials
   * @param {Array<{_id: string, order: number}>} orders 
   */
  async reorder(orders) {
    return apiClient.post('/testimonials/reorder', { orders });
  }
};
