import apiClient from '@/lib/api-client';

/**
 * Service for Client Testimonials
 * Communicates with /api/testimonials endpoints
 */
export const testimonialService = {
  /**
   * Fetch all approved testimonials
   * @returns {Promise<{data: Array}>}
   */
  async getAll() {
    return apiClient.get('/testimonials');
  },

  /**
   * Create a new testimonial (Admin Only)
   * @param {Object} data 
   */
  async create(data) {
    return apiClient.post('/testimonials/admin', data);
  },

  /**
   * Update a testimonial (Admin Only)
   * @param {string} id 
   * @param {Object} data 
   */
  async update(id, data) {
    return apiClient.patch(`/testimonials/admin/${id}`, data);
  },

  /**
   * Delete a testimonial (Admin Only)
   * @param {string} id 
   */
  async delete(id) {
    return apiClient.delete(`/testimonials/admin/${id}`);
  }
};
