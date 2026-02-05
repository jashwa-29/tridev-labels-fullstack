import apiClient from '@/lib/api-client';

/**
 * Service for Quote Requests and Leads
 * Communicates with /api/quotes endpoints
 */
export const quoteService = {
  /**
   * Submit a new quote request from the frontend
   * @param {Object} quoteData - The form data from the contact/quote form
   * @returns {Promise<any>}
   */
  async submit(quoteData) {
    return apiClient.post('/quotes', quoteData);
  },

  /**
   * Fetch all quotes (Admin Only)
   * @returns {Promise<{data: Array}>}
   */
  async getAll() {
    return apiClient.get('/quotes');
  },

  /**
   * Update the status of a quote (Admin Only)
   * @param {string} id - Quote ID
   * @param {string} status - New status (e.g., 'contacted', 'resolved')
   */
  async updateStatus(id, status) {
    return apiClient.patch(`/quotes/${id}`, { status });
  },

  /**
   * Delete a quote record (Admin Only)
   * @param {string} id 
   */
  async delete(id) {
    return apiClient.delete(`/quotes/${id}`);
  }
};
