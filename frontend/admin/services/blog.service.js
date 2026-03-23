import apiClient from '../lib/api-client';

/**
 * Service for Editorial/Blog content management
 * Communicates with /api/blogs endpoints
 */
export const blogService = {
  /**
   * Fetch all blogs with pagination and admin filters
   * @param {Object} params - Query parameters (page, limit, admin)
   * @returns {Promise<{data: Array, pages: number, total: number}>}
   */
  async getAll(params = {}) {
    return apiClient.get('/blogs', { params });
  },

  /**
   * Fetch a single blog by slug
   * @param {string} slug 
   */
  async getBySlug(slug) {
    if (!slug) throw new Error('Blog slug is required');
    return apiClient.get(`/blogs/slug/${slug}`);
  },

  /**
   * Create a new blog post (Multipart/FormData for images)
   * @param {FormData} formData 
   */
  async create(formData) {
    return apiClient.post('/blogs', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },

  /**
   * Update an existing blog post (Multipart/FormData for images)
   * @param {string} id - Database ObjectID
   * @param {FormData} formData 
   */
  async update(id, formData) {
    return apiClient.put(`/blogs/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },

  /**
   * Permanently delete a blog post
   * @param {string} id - Database ObjectID
   */
  async delete(id) {
    return apiClient.delete(`/blogs/${id}`);
  }
};
