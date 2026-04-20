<script>
  /**
   * @typedef {Object} Props
   * @property {string} [type='text']
   * @property {string} [value='']
   * @property {string} [placeholder='']
   * @property {string} [label='']
   * @property {string} [error='']
   * @property {boolean} [required=false]
   * @property {boolean} [disabled=false]
   * @property {(value: string) => void} [onchange]
   */

  /** @type {Props} */
  let {
    type = 'text',
    value = $bindable(''),
    placeholder = '',
    label = '',
    error = '',
    required = false,
    disabled = false,
    onchange
  } = $props();

  function handleInput(/** @type {Event} */ e) {
    const target = /** @type {HTMLInputElement} */ (e.target);
    value = target.value;
    onchange?.(value);
  }
</script>

<div class="input-wrapper">
  {#if label}
    <label class="input-label">
      {label}
      {#if required}
        <span class="required">*</span>
      {/if}
    </label>
  {/if}
  
  <input
    {type}
    {value}
    {placeholder}
    {disabled}
    {required}
    class="input"
    class:error={!!error}
    oninput={handleInput}
  />
  
  {#if error}
    <span class="error-message">{error}</span>
  {/if}
</div>

<style>
  .input-wrapper {
    display: flex;
    flex-direction: column;
    gap: var(--space-sm);
  }

  .input-label {
    font-size: var(--font-size-sm);
    font-weight: var(--font-weight-medium);
    color: var(--color-text-primary);
  }

  .required {
    color: var(--color-danger);
    margin-left: var(--space-xs);
  }

  .input {
    padding: 12px 16px;
    font-size: var(--font-size-md);
    color: var(--color-text-primary);
    background-color: var(--color-surface);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-md);
    transition: all var(--transition-fast);
    width: 100%;
  }

  .input:focus {
    outline: none;
    border-color: var(--color-primary);
    box-shadow: 0 0 0 3px var(--color-primary-light);
  }

  .input:disabled {
    background-color: var(--color-border-light);
    cursor: not-allowed;
  }

  .input::placeholder {
    color: var(--color-text-muted);
  }

  .input.error {
    border-color: var(--color-danger);
  }

  .input.error:focus {
    box-shadow: 0 0 0 3px var(--color-danger-light);
  }

  .error-message {
    font-size: var(--font-size-sm);
    color: var(--color-danger);
  }
</style>
