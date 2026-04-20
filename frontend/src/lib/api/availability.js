import { get as httpGet, post, put, remove } from './client.js';

/**
 * @typedef {import('../types/api.js').AvailabilityRule} AvailabilityRule
 * @typedef {import('../types/api.js').AvailabilityRuleCreate} AvailabilityRuleCreate
 * @typedef {import('../types/api.js').AvailabilityException} AvailabilityException
 * @typedef {import('../types/api.js').AvailabilityExceptionCreate} AvailabilityExceptionCreate
 */

/**
 * Availability API Service
 */

// Rules

/**
 * Get all availability rules for calendar
 * @param {string} calendarId
 * @returns {Promise<AvailabilityRule[]>}
 */
export function getRules(calendarId) {
  return httpGet('/availability/rules', { calendarId });
}

/**
 * Create availability rule
 * @param {AvailabilityRuleCreate} data
 * @returns {Promise<AvailabilityRule>}
 */
export function createRule(data) {
  return post('/availability/rules', data);
}

/**
 * Update availability rule
 * @param {string} id
 * @param {AvailabilityRuleCreate} data
 * @returns {Promise<AvailabilityRule>}
 */
export function updateRule(id, data) {
  return put(`/availability/rules/${id}`, data);
}

/**
 * Delete availability rule
 * @param {string} id
 * @returns {Promise<{message: string}>}
 */
export function deleteRule(id) {
  return remove(`/availability/rules/${id}`);
}

// Exceptions

/**
 * Get all availability exceptions for calendar
 * @param {string} calendarId
 * @param {string} [from]
 * @param {string} [to]
 * @returns {Promise<AvailabilityException[]>}
 */
export function getExceptions(calendarId, from, to) {
  const params = { calendarId };
  if (from) params.from = from;
  if (to) params.to = to;
  return httpGet('/availability/exceptions', params);
}

/**
 * Create availability exception
 * @param {AvailabilityExceptionCreate} data
 * @returns {Promise<AvailabilityException>}
 */
export function createException(data) {
  return post('/availability/exceptions', data);
}

/**
 * Delete availability exception
 * @param {string} id
 * @returns {Promise<{message: string}>}
 */
export function deleteException(id) {
  return remove(`/availability/exceptions/${id}`);
}

export default {
  getRules,
  createRule,
  updateRule,
  deleteRule,
  getExceptions,
  createException,
  deleteException,
};
