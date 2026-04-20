import { get as httpGet, put } from './client.js';

/**
 * @typedef {import('../types/api.js').Owner} Owner
 */

/**
 * Owner API Service
 */

/**
 * Get current owner profile
 * @returns {Promise<Owner>}
 */
export function getProfile() {
  return httpGet('/owner/profile');
}

/**
 * Update owner profile
 * @param {Object} data
 * @param {string} [data.name]
 * @param {string} [data.email]
 * @param {string} [data.timezone]
 * @returns {Promise<Owner>}
 */
export function updateProfile(data) {
  return put('/owner/profile', data);
}

/**
 * Change password
 * @param {Object} data
 * @param {string} data.oldPassword
 * @param {string} data.newPassword
 * @returns {Promise<{message: string}>}
 */
export function changePassword(data) {
  return put('/owner/password', data);
}

export default {
  getProfile,
  updateProfile,
  changePassword,
};
