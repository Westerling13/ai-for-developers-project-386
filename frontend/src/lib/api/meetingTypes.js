import { get as httpGet, post, put, remove } from './client.js';

/**
 * @typedef {import('../types/api.js').MeetingType} MeetingType
 * @typedef {import('../types/api.js').MeetingTypeCreate} MeetingTypeCreate
 * @typedef {import('../types/api.js').MeetingTypePublicView} MeetingTypePublicView
 */

/**
 * Meeting Types API Service
 */

/**
 * Get all meeting types for calendar (owner)
 * @param {string} calendarId
 * @returns {Promise<MeetingType[]>}
 */
export function list(calendarId) {
  return httpGet('/meeting-types', { calendarId });
}

/**
 * Get public meeting types for calendar (guest)
 * @param {string} calendarId
 * @returns {Promise<MeetingTypePublicView[]>}
 */
export function listPublic(calendarId) {
  return httpGet(`/meeting-types/public/${calendarId}`);
}

/**
 * Get meeting type by ID
 * @param {number} id
 * @returns {Promise<MeetingType>}
 */
export function getById(id) {
  return httpGet(`/meeting-types/${id}`);
}

/**
 * Create new meeting type
 * @param {MeetingTypeCreate} data
 * @returns {Promise<MeetingType>}
 */
export function create(data) {
  return post('/meeting-types', data);
}

/**
 * Update meeting type
 * @param {number} id
 * @param {Partial<MeetingTypeCreate>} data
 * @returns {Promise<MeetingType>}
 */
export function update(id, data) {
  return put(`/meeting-types/${id}`, data);
}

/**
 * Delete meeting type
 * @param {number} id
 * @returns {Promise<{message: string}>}
 */
export function removeType(id) {
  return remove(`/meeting-types/${id}`);
}

export default {
  list,
  listPublic,
  getById,
  create,
  update,
  remove: removeType,
};
