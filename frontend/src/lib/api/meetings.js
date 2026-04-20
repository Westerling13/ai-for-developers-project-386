import { get as httpGet, post, put, remove } from './client.js';

/**
 * @typedef {import('../types/api.js').Meeting} Meeting
 * @typedef {import('../types/api.js').MeetingCreate} MeetingCreate
 * @typedef {import('../types/api.js').MeetingListItem} MeetingListItem
 * @typedef {import('../types/api.js').MeetingsResponse} MeetingsResponse
 */

/**
 * Meetings API Service
 */

/**
 * Get meetings list (owner only)
 * @param {Object} params
 * @param {string} [params.status]
 * @param {string} [params.fromDate]
 * @param {string} [params.toDate]
 * @param {string} [params.sort]
 * @param {number} [params.page]
 * @param {number} [params.limit]
 * @returns {Promise<MeetingsResponse>}
 */
export function list(params = {}) {
  return httpGet('/meetings', params);
}

/**
 * Get meeting by ID (owner only)
 * @param {string} id
 * @returns {Promise<Meeting>}
 */
export function getById(id) {
  return httpGet(`/meetings/${id}`);
}

/**
 * Book a meeting (public, no auth required)
 * @param {MeetingCreate} data
 * @returns {Promise<Meeting>}
 */
export function book(data) {
  return post('/meetings/book', data);
}

/**
 * Update meeting (owner only)
 * @param {string} id
 * @param {Object} data
 * @param {string} [data.startTime]
 * @param {string} [data.endTime]
 * @param {string} [data.status]
 * @param {string} [data.title]
 * @param {string} [data.description]
 * @param {string} [data.cancellationReason]
 * @returns {Promise<Meeting>}
 */
export function update(id, data) {
  return put(`/meetings/${id}`, data);
}

/**
 * Cancel meeting (owner only)
 * @param {string} id
 * @param {string} [reason]
 * @returns {Promise<{message: string}>}
 */
export function cancel(id, reason) {
  const params = reason ? { reason } : {};
  return remove(`/meetings/${id}`, params);
}

/**
 * Get meeting confirmation (public)
 * @param {string} id
 * @returns {Promise<{meeting: Meeting, meetingType: import('../types/api.js').MeetingTypePublicView}>}
 */
export function getConfirmation(id) {
  return httpGet(`/meetings/confirmation/${id}`);
}

export default {
  list,
  getById,
  book,
  update,
  cancel,
  getConfirmation,
};
