import apiClient from '../lib/api-client';

/**
 * Service for Gallery and Tactile Finish management
 * Communicates with /api/gallery endpoints
 */
export const galleryService = {
  /**
   * Fetch all gallery items
   * @param {boolean} isAdmin - Whether to include hidden items (requires auth)
   * @returns {Promise<{data: Array}>}
   */
  async getAll(isAdmin = false) {
    return apiClient.get(`/gallery${isAdmin ? '?admin=true' : ''}`);
  },

  /**
   * Reorder gallery items (Admin Only)
   * @param {Array<{_id: string, order: number}>} orders 
   * @returns {Promise<any>}
   */
  async reorder(orders) {
    return apiClient.post('/gallery/reorder', { orders });
  }
};
