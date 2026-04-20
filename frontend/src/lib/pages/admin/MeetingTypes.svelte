<script>
  import { onMount } from 'svelte';
  import * as meetingTypesApi from '../../api/meetingTypes.js';
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

  /** @type {import('../../types/api.js').MeetingType[]} */
  let meetingTypes = $state([]);
  let loading = $state(true);
  let showForm = $state(false);
  let editingId = $state(/** @type {number | null} */ (null));

  // Form state
  let formData = $state({
    name: '',
    description: '',
    durationMinutes: 30,
    color: '#0066CC',
    isActive: true,
  });

  let calendarId = $state('');

  onMount(async () => {
    try {
      const calendar = await calendarApi.getMyCalendar();
      calendarId = calendar.id;
      meetingTypes = await meetingTypesApi.list(calendarId);
      loading = false;
    } catch (err) {
      notifications.error('Failed to load meeting types');
      loading = false;
    }
  });

  function resetForm() {
    formData = {
      name: '',
      description: '',
      durationMinutes: 30,
      color: '#0066CC',
      isActive: true,
    };
    editingId = null;
  }

  function editType(type) {
    formData = {
      name: type.name,
      description: type.description || '',
      durationMinutes: type.durationMinutes,
      color: type.color,
      isActive: type.isActive,
    };
    editingId = type.id;
    showForm = true;
  }

  async function handleSubmit() {
    try {
      if (editingId) {
        await meetingTypesApi.update(editingId, formData);
        notifications.success('Тип встречи обновлён');
      } else {
        await meetingTypesApi.create({ ...formData, calendarId });
        notifications.success('Тип встречи создан');
      }
      
      // Refresh list
      meetingTypes = await meetingTypesApi.list(calendarId);
      showForm = false;
      resetForm();
    } catch (err) {
      notifications.error(err.data?.error?.message || 'Ошибка сохранения');
    }
  }

  async function handleDelete(id) {
    if (!confirm('Удалить этот тип встречи?')) return;
    
    try {
      await meetingTypesApi.remove(id);
      notifications.success('Тип встречи удалён');
      meetingTypes = await meetingTypesApi.list(calendarId);
    } catch (err) {
      notifications.error('Ошибка удаления');
    }
  }
</script>

<div class="page">
  <div class="container">
    <div class="page-header">
      <h1>Типы встреч</h1>
      <Button onclick={() => { showForm = true; resetForm(); }}>
        + Добавить
      </Button>
    </div>

    {#if loading}
      <div class="loading">Загрузка...</div>
    {:else}
      <div class="meeting-types-list">
        {#each meetingTypes as type (type.id)}
          <Card padding="md">
            <div class="meeting-type-item">
              <div class="type-info">
                <div class="type-header">
                  <span class="color-dot" style="background-color: {type.color}"></span>
                  <h3>{type.name}</h3>
                  <Badge variant="default">{type.durationMinutes} мин</Badge>
                  {#if !type.isActive}
                    <Badge variant="warning">Неактивен</Badge>
                  {/if}
                </div>
                {#if type.description}
                  <p class="description">{type.description}</p>
                {/if}
              </div>
              <div class="actions">
                <Button variant="ghost" onclick={() => editType(type)}>
                  ✏️
                </Button>
                <Button variant="ghost" onclick={() => handleDelete(type.id)}>
                  🗑️
                </Button>
              </div>
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
        <h2>{editingId ? 'Редактировать' : 'Новый тип встречи'}</h2>
        
        <form onsubmit={(e) => { e.preventDefault(); handleSubmit(); }} class="form">
          <Input
            label="Название"
            bind:value={formData.name}
            required
          />
          
          <Input
            label="Описание"
            bind:value={formData.description}
          />
          
          <div class="form-row">
            <Input
              type="number"
              label="Длительность (мин)"
              bind:value={formData.durationMinutes}
              required
            />
            
            <div class="color-input">
              <label>Цвет</label>
              <input
                type="color"
                bind:value={formData.color}
              />
            </div>
          </div>
          
          <label class="checkbox-label">
            <input
              type="checkbox"
              bind:checked={formData.isActive}
            />
            Активен
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

  .meeting-types-list {
    display: flex;
    flex-direction: column;
    gap: var(--space-md);
  }

  .meeting-type-item {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
  }

  .type-info {
    flex: 1;
  }

  .type-header {
    display: flex;
    align-items: center;
    gap: var(--space-sm);
    margin-bottom: var(--space-sm);
  }

  .type-header h3 {
    font-size: var(--font-size-lg);
    margin: 0;
  }

  .color-dot {
    width: 16px;
    height: 16px;
    border-radius: 50%;
  }

  .description {
    font-size: var(--font-size-sm);
    color: var(--color-text-secondary);
    margin: 0;
  }

  .actions {
    display: flex;
    gap: var(--space-sm);
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
    display: grid;
    grid-template-columns: 2fr 1fr;
    gap: var(--space-md);
  }

  .color-input {
    display: flex;
    flex-direction: column;
    gap: var(--space-sm);
  }

  .color-input label {
    font-size: var(--font-size-sm);
    font-weight: var(--font-weight-medium);
    color: var(--color-text-primary);
  }

  .color-input input {
    height: 44px;
    border: 1px solid var(--color-border);
    border-radius: var(--radius-md);
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

  @media (max-width: 768px) {
    .page-header {
      flex-direction: column;
      gap: var(--space-md);
      align-items: flex-start;
    }

    .form-row {
      grid-template-columns: 1fr;
    }
  }
</style>
