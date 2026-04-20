<script>
  import { onMount } from 'svelte';
  import * as availabilityApi from '../../api/availability.js';
  import * as calendarApi from '../../api/calendar.js';
  import { notifications } from '../../stores/notifications.js';
  import Card from '../../components/ui/Card.svelte';
  import Button from '../../components/ui/Button.svelte';
  import Input from '../../components/ui/Input.svelte';
  import Badge from '../../components/ui/Badge.svelte';

  /**
   * @typedef {Object} Props
   * @property {(path: string) => void} navigate
   */

  /** @type {Props} */
  let { navigate } = $props();

  /** @type {import('../../types/api.js').AvailabilityRule[]} */
  let rules = $state([]);
  let loading = $state(true);
  let activeTab = $state('rules'); // 'rules' | 'exceptions'

  // Days of week
  const daysOfWeek = [
    { value: 1, label: 'Пн' },
    { value: 2, label: 'Вт' },
    { value: 3, label: 'Ср' },
    { value: 4, label: 'Чт' },
    { value: 5, label: 'Пт' },
    { value: 6, label: 'Сб' },
    { value: 7, label: 'Вс' },
  ];

  let calendarId = $state('');
  let showForm = $state(false);
  let editingId = $state(/** @type {string | null} */ (null));

  let formData = $state({
    dayOfWeek: 1,
    workStart: '09:00',
    workEnd: '18:00',
    slotDurationMinutes: 30,
    breaks: [],
    priority: 0,
    isActive: true,
  });

  onMount(async () => {
    try {
      const calendar = await calendarApi.getMyCalendar();
      calendarId = calendar.id;
      rules = await availabilityApi.getRules(calendarId);
      loading = false;
    } catch (err) {
      notifications.error('Failed to load availability rules');
      loading = false;
    }
  });

  function resetForm() {
    formData = {
      dayOfWeek: 1,
      workStart: '09:00',
      workEnd: '18:00',
      slotDurationMinutes: 30,
      breaks: [],
      priority: 0,
      isActive: true,
    };
    editingId = null;
  }

  function editRule(rule) {
    formData = {
      dayOfWeek: rule.dayOfWeek,
      workStart: rule.workStart,
      workEnd: rule.workEnd,
      slotDurationMinutes: rule.slotDurationMinutes,
      breaks: rule.breaks || [],
      priority: rule.priority,
      isActive: rule.isActive,
    };
    editingId = rule.id;
    showForm = true;
  }

  async function handleSubmit() {
    try {
      if (editingId) {
        await availabilityApi.updateRule(editingId, formData);
        notifications.success('Правило обновлено');
      } else {
        await availabilityApi.createRule({ ...formData, calendarId });
        notifications.success('Правило создано');
      }
      
      rules = await availabilityApi.getRules(calendarId);
      showForm = false;
      resetForm();
    } catch (err) {
      notifications.error(err.data?.error?.message || 'Ошибка сохранения');
    }
  }

  async function handleDelete(id) {
    if (!confirm('Удалить это правило?')) return;
    
    try {
      await availabilityApi.deleteRule(id);
      notifications.success('Правило удалено');
      rules = await availabilityApi.getRules(calendarId);
    } catch (err) {
      notifications.error('Ошибка удаления');
    }
  }

  function getDayLabel(value) {
    return daysOfWeek.find(d => d.value === value)?.label || '';
  }
</script>

<div class="page">
  <div class="container">
    <div class="page-header">
      <h1>Доступность</h1>
      <Button onclick={() => { showForm = true; resetForm(); }}>
        + Добавить правило
      </Button>
    </div>

    {#if loading}
      <div class="loading">Загрузка...</div>
    {:else}
      <div class="availability-grid">
        {#each daysOfWeek as day}
          {@const dayRules = rules.filter(r => r.dayOfWeek === day.value)}
          <Card padding="md">
            <div class="day-card">
              <div class="day-header">
                <h3>{day.label}</h3>
                {#if dayRules.length === 0}
                  <Badge variant="danger">Недоступен</Badge>
                {:else}
                  <Badge variant="success">Рабочий день</Badge>
                {/if}
              </div>
              
              {#if dayRules.length > 0}
                <div class="rules-list">
                  {#each dayRules as rule}
                    <div class="rule-item">
                      <div class="rule-time">
                        {rule.workStart.slice(0, 5)} - {rule.workEnd.slice(0, 5)}
                      </div>
                      <div class="rule-details">
                        {rule.slotDurationMinutes} мин слоты
                        {#if rule.breaks && rule.breaks.length > 0}
                          , {rule.breaks.length} перерывов
                        {/if}
                      </div>
                      <div class="rule-actions">
                        <button class="icon-btn" onclick={() => editRule(rule)}>
                          ✏️
                        </button>
                        <button class="icon-btn" onclick={() => handleDelete(rule.id)}>
                          🗑️
                        </button>
                      </div>
                    </div>
                  {/each}
                </div>
              {:else}
                <p class="no-rules">Нет правил для этого дня</p>
              {/if}
            </div>
          </Card>
        {/each}
      </div>
    {/if}
  </div>
</div>

{#if showForm}
  <div class="modal-overlay" onclick={() => showForm = false}>
    <div class="modal" onclick={(e) => e.stopPropagation()}>
      <Card padding="lg">
        <h2>{editingId ? 'Редактировать' : 'Новое правило'}</h2>
        
        <form onsubmit={(e) => { e.preventDefault(); handleSubmit(); }} class="form">
          <div class="form-row">
            <div class="select-wrapper">
              <label>День недели</label>
              <select bind:value={formData.dayOfWeek}>
                {#each daysOfWeek as day}
                  <option value={day.value}>{day.label}</option>
                {/each}
              </select>
            </div>
          </div>
          
          <div class="form-row time-row">
            <Input
              type="time"
              label="Начало"
              bind:value={formData.workStart}
              required
            />
            <Input
              type="time"
              label="Конец"
              bind:value={formData.workEnd}
              required
            />
          </div>
          
          <Input
            type="number"
            label="Длительность слота (мин)"
            bind:value={formData.slotDurationMinutes}
            required
          />
          
          <label class="checkbox-label">
            <input
              type="checkbox"
              bind:checked={formData.isActive}
            />
            Активно
          </label>
          
          <div class="form-actions">
            <Button variant="secondary" onclick={() => showForm = false}>
              Отмена
            </Button>
            <Button type="submit">
              Сохранить
            </Button>
          </div>
        </form>
      </Card>
    </div>
  </div>
{/if}

<style>
  .page {
    padding: var(--space-2xl) 0;
  }

  .page-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: var(--space-xl);
  }

  .page-header h1 {
    font-size: var(--font-size-2xl);
  }

  .availability-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: var(--space-lg);
  }

  .day-card {
    display: flex;
    flex-direction: column;
    gap: var(--space-md);
  }

  .day-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .day-header h3 {
    font-size: var(--font-size-lg);
    margin: 0;
  }

  .rules-list {
    display: flex;
    flex-direction: column;
    gap: var(--space-sm);
  }

  .rule-item {
    display: flex;
    flex-direction: column;
    gap: var(--space-xs);
    padding: var(--space-sm);
    background-color: var(--color-border-light);
    border-radius: var(--radius-md);
  }

  .rule-time {
    font-weight: var(--font-weight-semibold);
    font-size: var(--font-size-sm);
  }

  .rule-details {
    font-size: var(--font-size-xs);
    color: var(--color-text-muted);
  }

  .rule-actions {
    display: flex;
    gap: var(--space-sm);
    margin-top: var(--space-xs);
  }

  .icon-btn {
    background: none;
    border: none;
    cursor: pointer;
    font-size: var(--font-size-md);
    padding: var(--space-xs);
  }

  .no-rules {
    font-size: var(--font-size-sm);
    color: var(--color-text-muted);
    font-style: italic;
  }

  /* Modal */
  .modal-overlay {
    position: fixed;
    inset: 0;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    padding: var(--space-lg);
  }

  .modal {
    width: 100%;
    max-width: 480px;
  }

  .modal h2 {
    font-size: var(--font-size-xl);
    margin-bottom: var(--space-lg);
  }

  .form {
    display: flex;
    flex-direction: column;
    gap: var(--space-lg);
  }

  .form-row {
    display: flex;
    gap: var(--space-md);
  }

  .time-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
  }

  .select-wrapper {
    display: flex;
    flex-direction: column;
    gap: var(--space-sm);
  }

  .select-wrapper label {
    font-size: var(--font-size-sm);
    font-weight: var(--font-weight-medium);
    color: var(--color-text-primary);
  }

  .select-wrapper select {
    padding: 12px 16px;
    border: 1px solid var(--color-border);
    border-radius: var(--radius-md);
    font-size: var(--font-size-md);
    background-color: white;
    cursor: pointer;
  }

  .checkbox-label {
    display: flex;
    align-items: center;
    gap: var(--space-sm);
    font-size: var(--font-size-md);
    cursor: pointer;
  }

  .checkbox-label input {
    width: 18px;
    height: 18px;
    accent-color: var(--color-primary);
  }

  .form-actions {
    display: flex;
    justify-content: flex-end;
    gap: var(--space-md);
    margin-top: var(--space-md);
  }

  .loading {
    text-align: center;
    padding: var(--space-2xl);
    color: var(--color-text-secondary);
  }

  @media (max-width: 1024px) {
    .availability-grid {
      grid-template-columns: repeat(2, 1fr);
    }
  }

  @media (max-width: 768px) {
    .page-header {
      flex-direction: column;
      gap: var(--space-md);
      align-items: flex-start;
    }

    .availability-grid {
      grid-template-columns: 1fr;
    }

    .time-row {
      grid-template-columns: 1fr;
    }
  }
</style>
