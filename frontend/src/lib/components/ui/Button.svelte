<script>
  /**
   * @typedef {Object} Props
   * @property {string} [variant='primary'] - 'primary' | 'secondary' | 'ghost' | 'danger'
   * @property {string} [size='md'] - 'sm' | 'md' | 'lg'
   * @property {boolean} [disabled=false]
   * @property {boolean} [loading=false]
   * @property {string} [type='button']
   * @property {() => void} [onclick]
   * @property {import('svelte').Snippet} [children]
   */

  /** @type {Props} */
  let {
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    type = 'button',
    onclick,
    children
  } = $props();

  const variantClass = $derived(`btn-${variant}`);
  const sizeClass = $derived(`btn-${size}`);
  const isDisabled = $derived(disabled || loading);
</script>

<button
  {type}
  class="btn {variantClass} {sizeClass}"
  disabled={isDisabled}
  onclick={onclick}
>
  {#if loading}
    <span class="spinner"></span>
  {/if}
  {@render children?.()}
</button>

<style>
  .btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: var(--space-sm);
    border: none;
    border-radius: var(--radius-md);
    font-family: inherit;
    font-weight: var(--font-weight-semibold);
    cursor: pointer;
    transition: all var(--transition-fast);
    text-decoration: none;
  }

  .btn:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  /* Sizes */
  .btn-sm {
    padding: var(--space-sm) var(--space-md);
    font-size: var(--font-size-sm);
  }

  .btn-md {
    padding: 12px 24px;
    font-size: var(--font-size-md);
  }

  .btn-lg {
    padding: 16px 32px;
    font-size: var(--font-size-lg);
  }

  /* Variants */
  .btn-primary {
    background-color: var(--color-primary);
    color: white;
    box-shadow: var(--shadow-primary);
  }

  .btn-primary:hover:not(:disabled) {
    background-color: var(--color-primary-hover);
  }

  .btn-secondary {
    background-color: var(--color-surface);
    color: var(--color-text-primary);
    border: 1px solid var(--color-border);
  }

  .btn-secondary:hover:not(:disabled) {
    background-color: var(--color-border-light);
  }

  .btn-ghost {
    background-color: transparent;
    color: var(--color-text-secondary);
  }

  .btn-ghost:hover:not(:disabled) {
    background-color: var(--color-border-light);
  }

  .btn-danger {
    background-color: var(--color-danger);
    color: white;
  }

  .btn-danger:hover:not(:disabled) {
    background-color: #DC2626;
  }

  /* Spinner */
  .spinner {
    width: 16px;
    height: 16px;
    border: 2px solid transparent;
    border-top-color: currentColor;
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
  }

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
</style>
