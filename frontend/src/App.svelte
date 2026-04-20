<script>
  import { onMount } from 'svelte';
  import { auth, isAuthenticated } from './lib/stores/auth.js';
  import Header from './lib/components/Header.svelte';
  import Toast from './lib/components/Toast.svelte';

  // Import page components
  import HomePage from './lib/pages/Home.svelte';
  import LoginPage from './lib/pages/Login.svelte';
  import RegisterPage from './lib/pages/Register.svelte';
  import BookCatalogPage from './lib/pages/BookCatalog.svelte';
  import BookEventPage from './lib/pages/BookEvent.svelte';
  import AdminDashboard from './lib/pages/admin/Dashboard.svelte';
  import MeetingTypesPage from './lib/pages/admin/MeetingTypes.svelte';
  import AvailabilityPage from './lib/pages/admin/Availability.svelte';
  import MeetingsPage from './lib/pages/admin/Meetings.svelte';

  // Initialize auth on mount
  onMount(() => {
    auth.init();
  });

  // Simple router based on URL hash or path
  let currentPath = $state(window.location.pathname);

  // Handle navigation
  function navigate(/** @type {string} */ path) {
    window.history.pushState({}, '', path);
    currentPath = path;
  }

  // Listen for popstate
  window.addEventListener('popstate', () => {
    currentPath = window.location.pathname;
  });

  // Handle link clicks
  function handleLinkClick(/** @type {MouseEvent} */ e) {
    const target = /** @type {HTMLElement} */ (e.target);
    const anchor = target.closest('a');
    if (anchor && anchor.href && anchor.href.startsWith(window.location.origin)) {
      e.preventDefault();
      const url = new URL(anchor.href);
      navigate(url.pathname);
    }
  }

  // Route matching
  let page = $derived.by(() => {
    // Public routes
    if (currentPath === '/') return HomePage;
    if (currentPath === '/login') return $isAuthenticated ? AdminDashboard : LoginPage;
    if (currentPath === '/register') return $isAuthenticated ? AdminDashboard : RegisterPage;
    if (currentPath === '/book') return BookCatalogPage;
    if (currentPath.startsWith('/book/')) return BookEventPage;
    
    // Admin routes (require auth)
    if (currentPath === '/admin') return $isAuthenticated ? AdminDashboard : LoginPage;
    if (currentPath === '/admin/meeting-types') return $isAuthenticated ? MeetingTypesPage : LoginPage;
    if (currentPath === '/admin/availability') return $isAuthenticated ? AvailabilityPage : LoginPage;
    if (currentPath === '/admin/meetings') return $isAuthenticated ? MeetingsPage : LoginPage;
    
    // 404 fallback
    return HomePage;
  });
</script>

<div onclick={handleLinkClick} onkeypress={(e) => e.key === 'Enter' && handleLinkClick(e)} role="button" tabindex="0">
  <Header />
  
  <main>
    <page {navigate} />
  </main>
  
  <Toast />
</div>

<style>
  main {
    min-height: calc(100vh - var(--header-height));
  }
</style>
