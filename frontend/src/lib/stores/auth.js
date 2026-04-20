import { writable, derived } from 'svelte/store';
import * as authApi from '../api/auth.js';
import * as ownerApi from '../api/owner.js';

/**
 * @typedef {import('../types/api.js').Owner} Owner
 * @typedef {import('../types/api.js').AuthToken} AuthToken
 * @typedef {import('../types/api.js').LoginRequest} LoginRequest
 * @typedef {import('../types/api.js').OwnerRegistration} OwnerRegistration
 */

// Create stores
function createAuthStore() {
  const { subscribe, set, update } = writable({
    user: /** @type {Owner | null} */ (null),
    token: /** @type {string | null} */ (null),
    loading: false,
    error: /** @type {string | null} */ (null),
    isInitialized: false,
  });

  return {
    subscribe,
    
    /**
     * Initialize auth state from localStorage
     */
    init() {
      if (typeof localStorage === 'undefined') return;
      
      const token = localStorage.getItem('auth_token');
      const userJson = localStorage.getItem('auth_user');
      
      if (token && userJson) {
        try {
          const user = JSON.parse(userJson);
          set({
            user,
            token,
            loading: false,
            error: null,
            isInitialized: true,
          });
        } catch {
          localStorage.removeItem('auth_token');
          localStorage.removeItem('auth_user');
          set({
            user: null,
            token: null,
            loading: false,
            error: null,
            isInitialized: true,
          });
        }
      } else {
        update(state => ({ ...state, isInitialized: true }));
      }
    },

    /**
     * Login user
     * @param {LoginRequest} credentials
     */
    async login(credentials) {
      update(state => ({ ...state, loading: true, error: null }));
      
      try {
        const response = await authApi.login(credentials);
        const { token } = response;
        
        // Fetch user profile
        const user = await ownerApi.getProfile();
        
        // Save to localStorage
        if (typeof localStorage !== 'undefined') {
          localStorage.setItem('auth_token', token);
          localStorage.setItem('auth_user', JSON.stringify(user));
        }
        
        set({
          user,
          token,
          loading: false,
          error: null,
          isInitialized: true,
        });
        
        return { success: true };
      } catch (/** @type {any} */ error) {
        const errorMessage = error.data?.error?.message || 'Login failed';
        update(state => ({
          ...state,
          loading: false,
          error: errorMessage,
        }));
        return { success: false, error: errorMessage };
      }
    },

    /**
     * Register new user
     * @param {OwnerRegistration} data
     */
    async register(data) {
      update(state => ({ ...state, loading: true, error: null }));
      
      try {
        await authApi.register(data);
        
        // Auto-login after registration
        return await this.login({
          email: data.email,
          password: data.password,
        });
      } catch (/** @type {any} */ error) {
        const errorMessage = error.data?.error?.message || 'Registration failed';
        update(state => ({
          ...state,
          loading: false,
          error: errorMessage,
        }));
        return { success: false, error: errorMessage };
      }
    },

    /**
     * Logout user
     */
    async logout() {
      try {
        await authApi.logout();
      } catch {
        // Ignore errors on logout
      }
      
      if (typeof localStorage !== 'undefined') {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('auth_user');
      }
      
      set({
        user: null,
        token: null,
        loading: false,
        error: null,
        isInitialized: true,
      });
    },

    /**
     * Clear error
     */
    clearError() {
      update(state => ({ ...state, error: null }));
    },

    /**
     * Update user profile in store
     * @param {Partial<Owner>} data
     */
    updateUser(data) {
      update(state => {
        if (!state.user) return state;
        const updatedUser = { ...state.user, ...data };
        if (typeof localStorage !== 'undefined') {
          localStorage.setItem('auth_user', JSON.stringify(updatedUser));
        }
        return { ...state, user: updatedUser };
      });
    },
  };
}

export const auth = createAuthStore();

// Derived stores
export const isAuthenticated = derived(
  auth,
  $auth => !!$auth.token && !!$auth.user
);

export const isAuthLoading = derived(
  auth,
  $auth => $auth.loading
);

export const authError = derived(
  auth,
  $auth => $auth.error
);

export const currentUser = derived(
  auth,
  $auth => $auth.user
);
