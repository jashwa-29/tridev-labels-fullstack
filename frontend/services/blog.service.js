import apiClient from '@/lib/api-client';

export const blogService = {
  /**
   * Fetch all blogs with pagination
   * @param {number} page 
   * @param {number} limit 
   */
  async getAll(page = 1, limit = 9) {
    return apiClient.get(`/blogs?page=${page}&limit=${limit}`);
  },

  /**
   * Fetch a single blog by slug
   * @param {string} slug 
   */
  async getBySlug(slug) {
    if (!slug) return null;
    return apiClient.get(`/blogs/slug/${slug}`);
  }
};
