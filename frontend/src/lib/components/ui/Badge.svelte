<script>
  /**
   * @typedef {Object} Props
   * @property {string} [variant='default'] - 'default' | 'success' | 'danger' | 'warning' | 'primary'
   * @property {import('svelte').Snippet} [children]
   */

  /** @type {Props} */
  let {
    variant = 'default',
    children
  } = $props();

  const variantClass = $derived(`badge-${variant}`);
</script>

<span class="badge {variantClass}">
  {@render children?.()}
</span>

<style>
  .badge {
    display: inline-flex;
    align-items: center;
    padding: 4px 12px;
    font-size: var(--font-size-xs);
    font-weight: var(--font-weight-medium);
    border-radius: var(--radius-full);
    white-space: nowrap;
  }

  .badge-default {
    background-color: var(--color-border-light);
    color: var(--color-text-secondary);
  }

  .badge-primary {
    background-color: var(--color-primary-light);
    color: var(--color-primary);
  }

  .badge-success {
    background-color: var(--color-success-light);
    color: var(--color-success);
  }

  .badge-danger {
    background-color: var(--color-danger-light);
    color: var(--color-danger);
  }

  .badge-warning {
    background-color: #FEF3C7;
    color: #D97706;
  }
</style>
