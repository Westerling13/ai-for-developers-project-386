/**
 * API Configuration
 */

// Prism mock API endpoint
export const API_BASE_URL = 'http://localhost:4010';

// Alternative: use environment variable
// export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4010';

/**
 * Default request timeout in milliseconds
 */
export const REQUEST_TIMEOUT = 10000;

/**
 * Pagination defaults
 */
export const DEFAULT_PAGE = 1;
export const DEFAULT_LIMIT = 20;
