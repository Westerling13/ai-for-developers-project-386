<script>
  import { fly, fade } from 'svelte/transition';
  import { flip } from 'svelte/animate';
  import { notifications } from '$lib/stores/notifications.js';
</script>

<div class="toast-container">
  {#each $notifications as notification (notification.id)}
    <div
      class="toast toast-{notification.type}"
      transition:fly={{ y: 20, duration: 300 }}
      animate:flip={{ duration: 200 }}
    >
      <span class="message">{notification.message}</span>
      <button
        class="close"
        onclick={() => notifications.remove(notification.id)}
        aria-label="Close"
      >
        ×
      </button>
    </div>
  {/each}
</div>

<style>
  .toast-container {
    position: fixed;
    top: var(--space-lg);
    right: var(--space-lg);
    z-index: 1000;
    display: flex;
    flex-direction: column;
    gap: var(--space-sm);
    max-width: 400px;
  }

  .toast {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--space-md);
    padding: var(--space-md) var(--space-lg);
    border-radius: var(--radius-md);
    box-shadow: var(--shadow-lg);
    animation: slideIn 0.3s ease;
  }

  @keyframes slideIn {
    from {
      transform: translateX(100%);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }

  .toast-success {
    background-color: var(--color-success);
    color: white;
  }

  .toast-error {
    background-color: var(--color-danger);
    color: white;
  }

  .toast-warning {
    background-color: var(--color-warning);
    color: white;
  }

  .toast-info {
    background-color: var(--color-info);
    color: white;
  }

  .message {
    font-size: var(--font-size-sm);
    font-weight: var(--font-weight-medium);
  }

  .close {
    background: none;
    border: none;
    color: inherit;
    font-size: var(--font-size-xl);
    cursor: pointer;
    opacity: 0.8;
    transition: opacity var(--transition-fast);
    padding: 0;
    line-height: 1;
  }

  .close:hover {
    opacity: 1;
  }

  @media (max-width: 768px) {
    .toast-container {
      left: var(--space-md);
      right: var(--space-md);
      max-width: none;
    }
  }
</style>
