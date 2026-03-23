import apiClient from '../lib/api-client';

/**
 * Service for Specialty Label Solutions management
 * Communicates with /api/specials endpoints
 */
export const specialService = {
  /**
   * Fetch all specialty solutions
   * @param {boolean} isAdmin - Whether to include metadata/hidden items
   * @returns {Promise<{data: Array}>}
   */
  async getAll(isAdmin = false) {
    return apiClient.get('/specials', { params: { admin: isAdmin ? 'true' : undefined } });
  },

  /**
   * Create a new specialty item (Multipart/FormData for images)
   * @param {FormData} formData 
   */
  async create(formData) {
    return apiClient.post('/specials', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },

  /**
   * Remove a specialty item permanently
   * @param {string} id - Database ObjectID
   */
  async delete(id) {
    if (!id) throw new Error('Specialty ID is required');
    return apiClient.delete(`/specials/${id}`);
  }
};
