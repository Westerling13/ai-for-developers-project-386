<script>
  import { onMount } from 'svelte';
  import * as meetingsApi from '../../api/meetings.js';
  import { notifications } from '../../stores/notifications.js';
  import Card from '../../components/ui/Card.svelte';
  import Button from '../../components/ui/Button.svelte';
  import Badge from '../../components/ui/Badge.svelte';

  /**
   * @typedef {Object} Props
   * @property {(path: string) => void} navigate
   */

  /** @type {Props} */
  let { navigate } = $props();

  /** @type {import('../../types/api.js').MeetingListItem[]} */
  let meetings = $state([]);
  let loading = $state(true);
  let currentPage = $state(1);
  let totalPages = $state(1);
  let filterStatus = $state('');

  const statuses = [
    { value: '', label: 'Все статусы' },
    { value: 'pending', label: 'Ожидает' },
    { value: 'confirmed', label: 'Подтверждено' },
    { value: 'cancelled', label: 'Отменено' },
    { value: 'completed', label: 'Завершено' },
  ];

  onMount(() => {
    loadMeetings();
  });

  async function loadMeetings() {
    loading = true;
    try {
      const params = {
        page: currentPage,
        limit: 10,
        sort: 'asc',
      };
      if (filterStatus) params.status = filterStatus;
      
      const result = await meetingsApi.list(params);
      meetings = result.data || [];
      totalPages = result.meta?.totalPages || 1;
      loading = false;
    } catch (err) {
      notifications.error('Failed to load meetings');
      loading = false;
    }
  }

  function changePage(page) {
    if (page < 1 || page > totalPages) return;
    currentPage = page;
    loadMeetings();
  }

  function handleFilterChange(e) {
    filterStatus = e.target.value;
    currentPage = 1;
    loadMeetings();
  }

  function formatDate(dateStr) {
    return new Date(dateStr).toLocaleString('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  function getStatusBadge(status) {
    switch (status) {
      case 'confirmed': return 'success';
      case 'pending': return 'warning';
      case 'cancelled': return 'danger';
      case 'completed': return 'default';
      default: return 'default';
    }
  }

  async function cancelMeeting(id) {
    if (!confirm('Отменить эту встречу?')) return;
    
    try {
      await meetingsApi.cancel(id, 'Отменено владельцем');
      notifications.success('Встреча отменена');
      loadMeetings();
    } catch (err) {
      notifications.error('Ошибка отмены');
    }
  }
</script>

<div class="page">
  <div class="container">
    <div class="page-header">
      <h1>Встречи</h1>
      
      <div class="filters">
        <select value={filterStatus} onchange={handleFilterChange}>
          {#each statuses as status}
            <option value={status.value}>{status.label}</option>
          {/each}
        </select>
      </div>
    </div>

    {#if loading}
      <div class="loading">Загрузка...</div>
    {:else if meetings.length === 0}
      <Card padding="lg">
        <div class="empty-state">
          <p>Встреч не найдено</p>
        </div>
      </Card>
    {:else}
      <div class="meetings-list">
        {#each meetings as meeting}
          <Card padding="md">
            <div class="meeting-row">
              <div class="meeting-main">
                <div class="meeting-type">{meeting.meetingTypeName}</div>
                <div class="meeting-guest">{meeting.guestName} ({meeting.guestEmail})</div>
                <div class="meeting-time">{formatDate(meeting.startTime)}</div>
              </div>
              
              <div class="meeting-meta">
                <Badge variant={getStatusBadge(meeting.status)}>
                  {meeting.status}
                </Badge>
                <span class="duration">{meeting.durationMinutes} мин</span>
              </div>
              
              <div class="meeting-actions">
                {#if meeting.status !== 'cancelled' && meeting.status !== 'completed'}
                  <Button variant="ghost" onclick={() => cancelMeeting(meeting.id)}>
                    Отменить
                  </Button>
                {/if}
              </div>
            </div>
          </Card>
        {/each}
      </div>

      {#if totalPages > 1}
        <div class="pagination">
          <Button
            variant="secondary"
            disabled={currentPage === 1}
            onclick={() => changePage(currentPage - 1)}
          >
            ← Назад
          </Button>
          
          <span class="page-info">
            Страница {currentPage} из {totalPages}
          </span>
          
          <Button
            variant="secondary"
            disabled={currentPage === totalPages}
            onclick={() => changePage(currentPage + 1)}
          >
            Вперед →
          </Button>
        </div>
      {/if}
    {/if}
  </div>
</div>

<style>
  .page {
    padding: var(--space-2xl) 0;
  }

  .page-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: var(--space-xl);
    flex-wrap: wrap;
    gap: var(--space-md);
  }

  .page-header h1 {
    font-size: var(--font-size-2xl);
  }

  .filters select {
    padding: 8px 16px;
    border: 1px solid var(--color-border);
    border-radius: var(--radius-md);
    font-size: var(--font-size-md);
    background-color: white;
    cursor: pointer;
  }

  .meetings-list {
    display: flex;
    flex-direction: column;
    gap: var(--space-md);
  }

  .meeting-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: var(--space-lg);
    flex-wrap: wrap;
  }

  .meeting-main {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: var(--space-xs);
  }

  .meeting-type {
    font-weight: var(--font-weight-semibold);
    font-size: var(--font-size-md);
  }

  .meeting-guest {
    font-size: var(--font-size-sm);
    color: var(--color-text-secondary);
  }

  .meeting-time {
    font-size: var(--font-size-sm);
    color: var(--color-text-muted);
  }

  .meeting-meta {
    display: flex;
    align-items: center;
    gap: var(--space-md);
  }

  .duration {
    font-size: var(--font-size-sm);
    color: var(--color-text-muted);
  }

  .meeting-actions {
    display: flex;
    gap: var(--space-sm);
  }

  .empty-state {
    text-align: center;
    padding: var(--space-2xl);
    color: var(--color-text-secondary);
  }

  .pagination {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: var(--space-lg);
    margin-top: var(--space-xl);
  }

  .page-info {
    font-size: var(--font-size-sm);
    color: var(--color-text-secondary);
  }

  .loading {
    text-align: center;
    padding: var(--space-2xl);
    color: var(--color-text-secondary);
  }

  @media (max-width: 768px) {
    .meeting-row {
      flex-direction: column;
      align-items: flex-start;
    }

    .meeting-meta {
      width: 100%;
      justify-content: space-between;
    }
  }
</style>
