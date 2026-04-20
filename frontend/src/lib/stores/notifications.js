import { writable } from 'svelte/store';

/**
 * Notification type
 * @typedef {Object} Notification
 * @property {string} id
 * @property {'success' | 'error' | 'warning' | 'info'} type
 * @property {string} message
 * @property {number} [duration]
 */

function createNotificationStore() {
  const { subscribe, update } = writable(/** @type {Notification[]} */ ([]));

  /**
   * @param {Notification} notification
   */
  function add(notification) {
    const id = Math.random().toString(36).substring(2, 9);
    const newNotification = { ...notification, id };
    
    update(notifications => [...notifications, newNotification]);
    
    // Auto remove after duration
    const duration = notification.duration || 5000;
    setTimeout(() => {
      remove(id);
    }, duration);
    
    return id;
  }

  /**
   * @param {string} id
   */
  function remove(id) {
    update(notifications => notifications.filter(n => n.id !== id));
  }

  return {
    subscribe,
    add,
    remove,
    success: (/** @type {string} */ message, /** @type {number} */ duration) => 
      add({ type: 'success', message, duration }),
    error: (/** @type {string} */ message, /** @type {number} */ duration) => 
      add({ type: 'error', message, duration }),
    warning: (/** @type {string} */ message, /** @type {number} */ duration) => 
      add({ type: 'warning', message, duration }),
    info: (/** @type {string} */ message, /** @type {number} */ duration) => 
      add({ type: 'info', message, duration }),
  };
}

export const notifications = createNotificationStore();
