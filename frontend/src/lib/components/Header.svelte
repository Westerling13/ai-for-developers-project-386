<script>
  import { auth, isAuthenticated } from '$lib/stores/auth.js';
  import Button from '$lib/components/ui/Button.svelte';

  /**
   * @typedef {Object} Props
   * @property {() => void} [onLoginClick]
   * @property {() => void} [onAdminClick]
   */

  /** @type {Props} */
  let { onLoginClick, onAdminClick } = $props();

  async function handleLogout() {
    await auth.logout();
    window.location.href = '/';
  }
</script>

<header class="header">
  <div class="container header-content">
    <a href="/" class="logo">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="3" y="4" width="18" height="18" rx="2" stroke="#9B7ED9" stroke-width="2"/>
        <path d="M16 2V6" stroke="#9B7ED9" stroke-width="2" stroke-linecap="round"/>
        <path d="M8 2V6" stroke="#9B7ED9" stroke-width="2" stroke-linecap="round"/>
        <path d="M3 10H21" stroke="#9B7ED9" stroke-width="2"/>
      </svg>
      <span>Calendar</span>
    </a>

    <nav class="nav">
      {#if $isAuthenticated}
        <a href="/admin" class="nav-link">Админка</a>
        <button class="nav-link logout" onclick={handleLogout}>Выйти</button>
      {:else}
        <a href="/book" class="nav-link">Записаться</a>
        <a href="/login" class="nav-link">Админка</a>
      {/if}
    </nav>
  </div>
</header>

<style>
  .header {
    height: var(--header-height);
    background-color: var(--color-surface);
    border-bottom: 1px solid var(--color-border);
    position: sticky;
    top: 0;
    z-index: 100;
  }

  .header-content {
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .logo {
    display: flex;
    align-items: center;
    gap: var(--space-sm);
    font-weight: var(--font-weight-bold);
    font-size: var(--font-size-lg);
    color: var(--color-text-primary);
    text-decoration: none;
  }

  .logo:hover {
    color: var(--color-text-primary);
  }

  .nav {
    display: flex;
    align-items: center;
    gap: var(--space-lg);
  }

  .nav-link {
    font-size: var(--font-size-md);
    font-weight: var(--font-weight-medium);
    color: var(--color-text-secondary);
    text-decoration: none;
    transition: color var(--transition-fast);
    background: none;
    border: none;
    cursor: pointer;
    padding: 0;
  }

  .nav-link:hover {
    color: var(--color-primary);
  }

  .logout {
    color: var(--color-danger);
  }

  .logout:hover {
    color: #DC2626;
  }

  @media (max-width: 768px) {
    .nav {
      gap: var(--space-md);
    }
  }
</style>
