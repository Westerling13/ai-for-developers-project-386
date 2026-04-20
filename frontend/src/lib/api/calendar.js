import { get as httpGet, put } from './client.js';

/**
 * @typedef {import('../types/api.js').Calendar} Calendar
 */

/**
 * Calendar API Service
 */

/**
 * Get current owner's calendar
 * @returns {Promise<Calendar>}
 */
export function getMyCalendar() {
  return httpGet('/calendars/my');
}

/**
 * Update calendar settings
 * @param {Object} data
 * @param {string} [data.name]
 * @param {string} [data.timezone]
 * @param {string} [data.color]
 * @param {number} [data.minBookingNoticeMinutes]
 * @param {number} [data.maxBookingDaysAhead]
 * @returns {Promise<Calendar>}
 */
export function updateMyCalendar(data) {
  return put('/calendars/my', data);
}

export default {
  getMyCalendar,
  updateMyCalendar,
};
