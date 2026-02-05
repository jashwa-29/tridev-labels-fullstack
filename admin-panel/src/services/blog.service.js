import apiClient from '../lib/api-client';

export const blogService = {
  // Get all blogs with optional pagination and admin filter
  getAll: (params = {}) => {
    const { admin, page, limit } = params;
    const query = new URLSearchParams();
    if (admin) query.append('admin', 'true');
    if (page) query.append('page', page);
    if (limit) query.append('limit', limit);
    
    const queryString = query.toString();
    return apiClient.get(`/blogs${queryString ? `?${queryString}` : ''}`);
  },

  // Get by slug
  getBySlug: (slug) => {
    return apiClient.get(`/blogs/slug/${slug}`);
  },

  // Create new blog
  create: (formData) => {
    return apiClient.post('/blogs', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  // Update blog
  update: (id, formData) => {
    return apiClient.put(`/blogs/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  // Delete blog
  delete: (id) => {
    return apiClient.delete(`/blogs/${id}`);
  }
};
