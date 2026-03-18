import apiClient from '../lib/api-client';

/**
 * Service for Chat History & Records
 * Communicates with /api/chats endpoints
 */
export const chatService = {
  /**
   * Fetch all closed chat records with pagination
   * @param {Object} params - Query parameters (page, limit)
   */
  async getHistory(params = {}) {
    return apiClient.get('/chats/history', { params });
  },

  /**
   * Fetch single chat details (message history)
   * @param {string} id 
   */
  async getById(id) {
    return apiClient.get(`/chats/${id}`);
  },

  /**
   * Fetch chat settings by key
   * @param {string} key 
   */
  async getSettings(key) {
    return apiClient.get(`/chat-settings/${key}`);
  },

  /**
   * Update chat settings
   * @param {Object} data 
   */
  async updateSettings(data) {
    return apiClient.post('/chat-settings', data);
  }
};
