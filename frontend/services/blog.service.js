import apiClient from '@/lib/api-client';

/**
 * Service for Editorial/Blog content management
 * Communicates with /api/blogs endpoints
 */
export const blogService = {
  /**
   * Fetch all blogs with pagination
   * @param {number} page - Current page number
   * @param {number} limit - Number of items per page
   * @returns {Promise<{data: Array, pages: number, total: number}>}
   */
  async getAll(page = 1, limit = 9) {
    return apiClient.get(`/blogs?page=${page}&limit=${limit}`);
  },

  /**
   * Fetch a single blog by slug for dynamic routing
   * @param {string} slug - The blog post slug
   * @returns {Promise<{data: Object}>}
   */
  async getBySlug(slug) {
    if (!slug) throw new Error('Slug is required');
    return apiClient.get(`/blogs/slug/${slug}`);
  }
};
