import apiClient from '../lib/api-client';

/**
 * Service for Gallery and Industrial Finishes management
 * Communicates with /api/gallery endpoints
 */
export const galleryService = {
  /**
   * Fetch all gallery items
   * @param {boolean} isAdmin - Whether to include hidden items
   * @returns {Promise<{data: Array}>}
   */
  async getAll(isAdmin = false) {
    return apiClient.get('/gallery', { params: { admin: isAdmin ? 'true' : undefined } });
  },

  /**
   * Create a new gallery entry (Multipart/FormData for images)
   * @param {FormData} formData 
   */
  async create(formData) {
    return apiClient.post('/gallery', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },

  /**
   * Update an existing gallery entry
   * @param {string} id - Database ObjectID
   * @param {FormData|Object} formData 
   */
  async update(id, formData) {
    const isFormData = formData instanceof FormData;
    return apiClient.put(`/gallery/${id}`, formData, {
      headers: {
        'Content-Type': isFormData ? 'multipart/form-data' : 'application/json',
      },
    });
  },

  /**
   * Remove a gallery entry permanently
   * @param {string} id - Database ObjectID
   */
  async delete(id) {
    return apiClient.delete(`/gallery/${id}`);
  },

  /**
   * Batch update ordering of gallery items
   * @param {Array<{_id: string, order: number}>} orders 
   */
  async reorder(orders) {
    return apiClient.post('/gallery/reorder', { orders });
  }
};
