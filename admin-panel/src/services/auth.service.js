import apiClient from '../lib/api-client';

/**
 * Service for Authentication and User Profile management
 * Communicates with /api/auth endpoints
 */
export const authService = {
  /**
   * Authenticate admin users
   * @param {Object} credentials - { email, password }
   * @returns {Promise<{token: string, user: Object}>}
   */
  async login(credentials) {
    return apiClient.post('/auth/login', credentials);
  },

  /**
   * Request an OTP for password reset
   * @param {string} email 
   */
  async sendOtp(email) {
    return apiClient.post('/auth/forgotpassword', { email });
  },

  /**
   * Verify the received OTP
   * @param {string} email 
   * @param {string} otp 
   * @returns {Promise<{resetToken: string}>}
   */
  async verifyOtp(email, otp) {
    return apiClient.post('/auth/verifyotp', { email, otp });
  },

  /**
   * Reset password using the temporary reset token
   * @param {string} token - The resetToken from verifyOtp
   * @param {string} password - New password
   */
  async resetPassword(token, password) {
    return apiClient.put('/auth/resetpassword', { token, password });
  },

  /**
   * Update admin user credentials (email/password)
   * @param {Object} data - { currentPassword, newEmail, newPassword }
   */
  async updateCredentials(data) {
    return apiClient.put('/auth/edit-credentials', data);
  },

  /**
   * Fetch current user profile (requires auth)
   * @returns {Promise<{data: Object}>}
   */
  async getProfile() {
    return apiClient.get('/auth/profile');
  }
};
