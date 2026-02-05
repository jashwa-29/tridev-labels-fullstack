import apiClient from './api-client';

export const testimonialService = {
  getAll: () => apiClient.get('/testimonials'),
};
