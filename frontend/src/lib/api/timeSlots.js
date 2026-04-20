import { get as httpGet } from './client.js';

/**
 * @typedef {import('../types/api.js').TimeSlot} TimeSlot
 * @typedef {import('../types/api.js').TimeSlotsByDate} TimeSlotsByDate
 */

/**
 * Time Slots API Service
 */

/**
 * Get available time slots for booking (public)
 * @param {string} calendarId
 * @param {Object} params
 * @param {string} params.from
 * @param {string} params.to
 * @param {number} [params.durationMinutes]
 * @param {number} [params.intervalMinutes]
 * @param {number} [params.meetingTypeId]
 * @returns {Promise<TimeSlotsByDate[]>}
 */
export function getAvailable(calendarId, params) {
  return httpGet(`/slots/available/${calendarId}`, params);
}

/**
 * Get all time slots for calendar (owner only)
 * @param {string} calendarId
 * @param {string} from
 * @param {string} to
 * @returns {Promise<TimeSlot[]>}
 */
export function getAll(calendarId, from, to) {
  return httpGet(`/slots/calendar/${calendarId}`, { from, to });
}

export default {
  getAvailable,
  getAll,
};
