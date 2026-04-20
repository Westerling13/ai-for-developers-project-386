import { API_BASE_URL } from '../config.js';

/**
 * Custom error class for API errors
 */
export class ApiError extends Error {
  /**
   * @param {string} message
   * @param {number} status
   * @param {Object} data
   */
  constructor(message, status, data) {
    super(message);
    this.status = status;
    this.data = data;
    this.name = 'ApiError';
  }
}

/**
 * Get auth token from localStorage
 * @returns {string | null}
 */
function getAuthToken() {
  if (typeof localStorage !== 'undefined') {
    return localStorage.getItem('auth_token');
  }
  return null;
}

/**
 * Make HTTP request
 * @param {string} endpoint
 * @param {Object} options
 * @returns {Promise<any>}
 */
async function request(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  const token = getAuthToken();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const config = {
    ...options,
    headers,
  };

  if (options.body && typeof options.body === 'object') {
    config.body = JSON.stringify(options.body);
  }

  try {
    const response = await fetch(url, config);
    
    // Handle 204 No Content
    if (response.status === 204) {
      return null;
    }

    const data = await response.json();

    if (!response.ok) {
      throw new ApiError(
        data.error?.message || `HTTP error! status: ${response.status}`,
        response.status,
        data
      );
    }

    return data;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(error.message, 0, null);
  }
}

/**
 * HTTP GET request
 * @param {string} endpoint
 * @param {Object} params
 * @returns {Promise<any>}
 */
export function get(endpoint, params = {}) {
  const queryString = new URLSearchParams(params).toString();
  const url = queryString ? `${endpoint}?${queryString}` : endpoint;
  return request(url, { method: 'GET' });
}

/**
 * HTTP POST request
 * @param {string} endpoint
 * @param {Object} body
 * @returns {Promise<any>}
 */
export function post(endpoint, body) {
  return request(endpoint, { method: 'POST', body });
}

/**
 * HTTP PUT request
 * @param {string} endpoint
 * @param {Object} body
 * @returns {Promise<any>}
 */
export function put(endpoint, body) {
  return request(endpoint, { method: 'PUT', body });
}

/**
 * HTTP DELETE request
 * @param {string} endpoint
 * @param {Object} params
 * @returns {Promise<any>}
 */
export function remove(endpoint, params = {}) {
  const queryString = new URLSearchParams(params).toString();
  const url = queryString ? `${endpoint}?${queryString}` : endpoint;
  return request(url, { method: 'DELETE' });
}

export default {
  get,
  post,
  put,
  remove,
  ApiError,
};
