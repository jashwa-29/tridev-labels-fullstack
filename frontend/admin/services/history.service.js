import apiClient from '../lib/api-client';

/**
 * Service for Data Integrity & History Audit
 * Communicates with /api/history endpoints
 */
export const historyService = {
  /**
   * Fetch all history records with pagination
   * @param {Object} params - Query parameters (page, limit)
   */
  async getAll(params = {}) {
    return apiClient.get('/history', { params });
  },

  /**
   * Fetch a single history snapshot
   * @param {string} id 
   */
  async getById(id) {
    return apiClient.get(`/history/${id}`);
  },

  /**
   * Delete a history record
   * @param {string} id 
   */
  async delete(id) {
    return apiClient.delete(`/history/${id}`);
  }
};
