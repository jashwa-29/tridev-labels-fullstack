import apiClient from '../lib/api-client';

/**
 * Service for Contact Inquiries management
 * Communicates with /api/contacts endpoints
 */
export const contactService = {
  /**
   * Fetch all contact inquiries with pagination
   * @param {number} page 
   * @param {number} limit 
   * @returns {Promise<{data: Array, pages: number, total: number}>}
   */
  async getAll(page = 1, limit = 10) {
    return apiClient.get('/contacts', { params: { page, limit } });
  },

  /**
   * Fetch details of a single inquiry
   * @param {string} id - Database ObjectID
   */
  async getById(id) {
    if (!id) throw new Error('Contact ID is required');
    return apiClient.get(`/contacts/${id}`);
  },

  /**
   * Update the processing status of an inquiry (e.g., 'read', 'archived')
   * @param {string} id - Database ObjectID
   * @param {string} status 
   */
  async updateStatus(id, status) {
    return apiClient.patch(`/contacts/${id}/status`, { status });
  },

  /**
   * Remove a contact record permanently
   * @param {string} id - Database ObjectID
   */
  async delete(id) {
    return apiClient.delete(`/contacts/${id}`);
  },
  
  /**
   * Fetch aggregate statistics for contact requests
   * @returns {Promise<any>}
   */
  async getStats() {
    return apiClient.get('/contacts/stats');
  }
};
