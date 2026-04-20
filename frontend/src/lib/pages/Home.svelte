<script>
  import Button from '$lib/components/ui/Button.svelte';
  import Card from '$lib/components/ui/Card.svelte';
</script>

<div class="hero">
  <div class="container">
    <div class="hero-content">
      <div class="hero-text">
        <span class="badge">БЫСТРАЯ ЗАПИСЬ НА ЗВОНОК</span>
        <h1>Calendar</h1>
        <p class="subtitle">
          Забронируйте встречу за минуту: выберите тип события и удобное время.
        </p>
        <div class="actions">
          <Button onclick={() => window.location.href = '/book'}>
            Записаться →
          </Button>
        </div>
      </div>
      
      <Card padding="lg">
        <div class="features">
          <h3>Возможности</h3>
          <ul>
            <li>Выбор типа события и удобного времени для встречи.</li>
            <li>Быстрое бронирование с подтверждением и дополнительными заметками.</li>
            <li>Управление типами встреч и просмотр предстоящих записей в админке.</li>
          </ul>
        </div>
      </Card>
    </div>
  </div>
</div>

<style>
  .hero {
    padding: var(--space-3xl) 0;
    background: linear-gradient(135deg, var(--color-background) 0%, var(--color-surface) 100%);
    min-height: calc(100vh - var(--header-height));
  }

  .hero-content {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: var(--space-3xl);
    align-items: start;
  }

  .hero-text {
    display: flex;
    flex-direction: column;
    gap: var(--space-lg);
  }

  .badge {
    display: inline-flex;
    padding: var(--space-sm) var(--space-md);
    background-color: var(--color-surface);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-full);
    font-size: var(--font-size-xs);
    font-weight: var(--font-weight-semibold);
    color: var(--color-text-secondary);
    text-transform: uppercase;
    letter-spacing: 0.05em;
    width: fit-content;
  }

  h1 {
    font-size: var(--font-size-4xl);
    font-weight: var(--font-weight-bold);
    color: var(--color-text-primary);
    line-height: 1.1;
  }

  .subtitle {
    font-size: var(--font-size-lg);
    color: var(--color-text-secondary);
    line-height: 1.6;
    max-width: 400px;
  }

  .actions {
    margin-top: var(--space-md);
  }

  .features {
    display: flex;
    flex-direction: column;
    gap: var(--space-lg);
  }

  .features h3 {
    font-size: var(--font-size-xl);
    font-weight: var(--font-weight-semibold);
    color: var(--color-text-primary);
  }

  .features ul {
    list-style: none;
    display: flex;
    flex-direction: column;
    gap: var(--space-md);
  }

  .features li {
    font-size: var(--font-size-md);
    color: var(--color-text-secondary);
    line-height: 1.5;
    position: relative;
    padding-left: var(--space-md);
  }

  .features li::before {
    content: '•';
    position: absolute;
    left: 0;
    color: var(--color-primary);
    font-weight: bold;
  }

  @media (max-width: 968px) {
    .hero-content {
      grid-template-columns: 1fr;
      gap: var(--space-2xl);
    }

    .hero {
      padding: var(--space-2xl) 0;
    }

    h1 {
      font-size: var(--font-size-3xl);
    }
  }
</style>
