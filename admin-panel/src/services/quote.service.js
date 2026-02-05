import apiClient from '../lib/api-client';

/**
 * Service for Sales Quotes and Industrial Leads management
 * Communicates with /api/quotes endpoints
 */
export const quoteService = {
  /**
   * Fetch all quote requests with pagination and source filtering
   * @param {number} page 
   * @param {number} limit 
   * @param {string} source - Optional filter (e.g., 'home', 'contact')
   * @returns {Promise<{data: Array, pages: number, total: number}>}
   */
  async getAll(page = 1, limit = 10, source = null) {
    return apiClient.get('/quotes', { 
      params: { page, limit, source: source || undefined } 
    });
  },

  /**
   * Fetch details of a single quote request
   * @param {string} id - Database ObjectID
   */
  async getById(id) {
    if (!id) throw new Error('Quote ID is required');
    return apiClient.get(`/quotes/${id}`);
  },

  /**
   * Update the status of a lead (e.g., 'pending', 'responded', 'converted')
   * @param {string} id - Database ObjectID
   * @param {string} status 
   */
  async updateStatus(id, status) {
    return apiClient.patch(`/quotes/${id}/status`, { status });
  },

  /**
   * Remove a quote record permanently
   * @param {string} id - Database ObjectID
   */
  async delete(id) {
    return apiClient.delete(`/quotes/${id}`);
  },
  
  /**
   * Fetch aggregate statistics for sales leads
   * @returns {Promise<any>}
   */
  async getStats() {
    return apiClient.get('/quotes/stats');
  }
};
