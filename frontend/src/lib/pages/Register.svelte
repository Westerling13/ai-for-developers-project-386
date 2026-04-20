<script>
  import { auth } from '$lib/stores/auth.js';
  import { notifications } from '$lib/stores/notifications.js';
  import Button from '$lib/components/ui/Button.svelte';
  import Card from '$lib/components/ui/Card.svelte';
  import Input from '$lib/components/ui/Input.svelte';

  /**
   * @typedef {Object} Props
   * @property {(path: string) => void} navigate
   */

  /** @type {Props} */
  let { navigate } = $props();

  let name = $state('');
  let email = $state('');
  let password = $state('');
  let confirmPassword = $state('');
  let loading = $state(false);
  let errors = $state({ name: '', email: '', password: '', confirmPassword: '', general: '' });

  function validate() {
    let isValid = true;
    errors = { name: '', email: '', password: '', confirmPassword: '', general: '' };

    if (!name.trim()) {
      errors.name = 'Имя обязательно';
      isValid = false;
    }

    if (!email.trim()) {
      errors.email = 'Email обязателен';
      isValid = false;
    } else if (!email.includes('@')) {
      errors.email = 'Введите корректный email';
      isValid = false;
    }

    if (!password) {
      errors.password = 'Пароль обязателен';
      isValid = false;
    } else if (password.length < 6) {
      errors.password = 'Пароль должен быть не менее 6 символов';
      isValid = false;
    }

    if (password !== confirmPassword) {
      errors.confirmPassword = 'Пароли не совпадают';
      isValid = false;
    }

    return isValid;
  }

  async function handleSubmit() {
    if (!validate()) return;

    loading = true;
    const result = await auth.register({ name, email, password });
    loading = false;

    if (result.success) {
      notifications.success('Регистрация прошла успешно!');
      navigate('/admin');
    } else {
      errors.general = result.error || 'Ошибка регистрации';
    }
  }
</script>

<div class="page">
  <div class="container">
    <div class="form-container">
      <Card padding="lg">
        <div class="form-header">
          <h1>Создать аккаунт</h1>
          <p>Заполните форму для регистрации</p>
        </div>

        <form onsubmit={(e) => { e.preventDefault(); handleSubmit(); }} class="form">
          <Input
            label="Имя"
            placeholder="Иван Иванов"
            bind:value={name}
            error={errors.name}
            required
          />

          <Input
            type="email"
            label="Email"
            placeholder="your@email.com"
            bind:value={email}
            error={errors.email}
            required
          />

          <Input
            type="password"
            label="Пароль"
            placeholder="••••••••"
            bind:value={password}
            error={errors.password}
            required
          />

          <Input
            type="password"
            label="Подтвердите пароль"
            placeholder="••••••••"
            bind:value={confirmPassword}
            error={errors.confirmPassword}
            required
          />

          {#if errors.general}
            <div class="error-alert">{errors.general}</div>
          {/if}

          <div class="form-actions">
            <Button type="submit" loading={loading}>
              Зарегистрироваться
            </Button>
          </div>
        </form>

        <div class="form-footer">
          <p>Уже есть аккаунт? <a href="/login">Войти</a></p>
          <p><a href="/">← Вернуться на главную</a></p>
        </div>
      </Card>
    </div>
  </div>
</div>

<style>
  .page {
    padding: var(--space-3xl) 0;
    min-height: calc(100vh - var(--header-height));
    display: flex;
    align-items: center;
  }

  .form-container {
    max-width: 420px;
    margin: 0 auto;
  }

  .form-header {
    text-align: center;
    margin-bottom: var(--space-xl);
  }

  .form-header h1 {
    font-size: var(--font-size-2xl);
    margin-bottom: var(--space-sm);
  }

  .form-header p {
    color: var(--color-text-secondary);
    font-size: var(--font-size-md);
  }

  .form {
    display: flex;
    flex-direction: column;
    gap: var(--space-lg);
  }

  .form-actions {
    margin-top: var(--space-sm);
  }

  .form-actions :global(.btn) {
    width: 100%;
  }

  .error-alert {
    padding: var(--space-md);
    background-color: var(--color-danger-light);
    color: var(--color-danger);
    border-radius: var(--radius-md);
    font-size: var(--font-size-sm);
  }

  .form-footer {
    margin-top: var(--space-xl);
    text-align: center;
    display: flex;
    flex-direction: column;
    gap: var(--space-sm);
  }

  .form-footer p {
    margin: 0;
    font-size: var(--font-size-sm);
    color: var(--color-text-secondary);
  }

  @media (max-width: 768px) {
    .page {
      padding: var(--space-xl) 0;
    }
  }
</style>
