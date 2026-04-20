import { post, remove } from './client.js';

/**
 * @typedef {import('../types/api.js').LoginRequest} LoginRequest
 * @typedef {import('../types/api.js').OwnerRegistration} OwnerRegistration
 * @typedef {import('../types/api.js').AuthToken} AuthToken
 * @typedef {import('../types/api.js').Owner} Owner
 */

/**
 * Authentication API Service
 */

/**
 * Register a new owner
 * @param {OwnerRegistration} data
 * @returns {Promise<Owner>}
 */
export function register(data) {
  return post('/auth/register', data);
}

/**
 * Login owner
 * @param {LoginRequest} data
 * @returns {Promise<AuthToken>}
 */
export function login(data) {
  return post('/auth/login', data);
}

/**
 * Logout current user
 * @returns {Promise<{message: string}>}
 */
export function logout() {
  return post('/auth/logout');
}

export default {
  register,
  login,
  logout,
};
