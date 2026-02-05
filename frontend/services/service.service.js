import apiClient from '../lib/api-client';

/**
 * Service for Core Solutions/Services management
 * Communicates with /api/services endpoints
 */
export const serviceService = {
  /**
   * Fetch all services
   * @param {boolean} isAdmin - Whether to include metadata/hidden items
   * @returns {Promise<{data: Array}>}
   */
  async getAll(isAdmin = false) {
    return apiClient.get(`/services${isAdmin ? '?admin=true' : ''}`);
  },

  /**
   * Fetch single service detail by slug
   * @param {string} slug 
   * @returns {Promise<{data: Object}>}
   */
  async getBySlug(slug) {
    if (!slug) throw new Error('Service slug is required');
    return apiClient.get(`/services/${slug}`);
  },

  /**
   * Create a new service (Admin Only)
   * @param {Object} serviceData 
   */
  async create(serviceData) {
    return apiClient.post('/services', serviceData);
  },

  /**
   * Update existing service (Admin Only)
   * @param {string} id - Database ObjectID
   * @param {Object} serviceData 
   */
  async update(id, serviceData) {
    return apiClient.patch(`/services/admin/${id}`, serviceData);
  },

  /**
   * Remove a service (Admin Only)
   * @param {string} id - Database ObjectID
   */
  async delete(id) {
    return apiClient.delete(`/services/admin/${id}`);
  },

  /**
   * Reorder services (Admin Only)
   * @param {Array<{_id: string, order: number}>} orders 
   */
  async reorder(orders) {
    return apiClient.post('/services/reorder', { orders });
  }
};
