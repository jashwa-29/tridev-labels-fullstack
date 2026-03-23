import apiClient from '../lib/api-client';

/**
 * Service for Core Solutions/Services management
 * Communicates with /api/services endpoints
 */
export const serviceService = {
  /**
   * Fetch all services offered
   * @param {boolean} isAdmin - Whether to include metadata/hidden items
   * @returns {Promise<{data: Array}>}
   */
  async getAll(isAdmin = false) {
    return apiClient.get('/services', { params: { admin: isAdmin ? 'true' : undefined } });
  },

  /**
   * Create a new service category (Multipart/FormData for images)
   * @param {FormData} formData 
   */
  async create(formData) {
    return apiClient.post('/services', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },

  /**
   * Update an existing service (Multipart/FormData for images)
   * @param {string} id - Database ObjectID
   * @param {FormData} formData 
   */
  async update(id, formData) {
    return apiClient.patch(`/services/admin/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },

  /**
   * Remove a service category permanently
   * @param {string} id - Database ObjectID
   */
  async delete(id) {
    if (!id) throw new Error('Service ID is required');
    return apiClient.delete(`/services/admin/${id}`);
  },

  /**
   * Batch update the display order of services
   * @param {Array<{_id: string, order: number}>} orders 
   */
  async reorder(orders) {
    return apiClient.post('/services/reorder', { orders });
  }
};
