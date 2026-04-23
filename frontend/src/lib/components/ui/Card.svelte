<script>
  /**
   * @typedef {Object} Props
   * @property {boolean} [hoverable=false]
   * @property {string} [padding='lg'] - 'sm' | 'md' | 'lg'
   * @property {import('svelte').Snippet} [children]
   * @property {() => void} [onclick]
   */

  /** @type {Props} */
  let {
    hoverable = false,
    padding = 'lg',
    children,
    onclick
  } = $props();

  const paddingClass = $derived(`card-padding-${padding}`);
</script>

<div class="card {paddingClass}" class:hoverable {onclick} role={onclick ? 'button' : undefined} tabindex={onclick ? 0 : undefined}>
  {@render children?.()}
</div>

<style>
  .card {
    background-color: var(--color-surface);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-lg);
    box-shadow: var(--shadow-sm);
    transition: all var(--transition-base);
  }

  .card-padding-sm {
    padding: var(--space-md);
  }

  .card-padding-md {
    padding: var(--space-lg);
  }

  .card-padding-lg {
    padding: 24px;
  }

  .hoverable {
    cursor: pointer;
  }

  .hoverable:hover {
    border-color: var(--color-primary);
    box-shadow: var(--shadow-lg);
  }
</style>
