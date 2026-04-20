<script>
  import { onMount } from 'svelte';
  import * as ownerApi from '$lib/api/owner.js';
  import * as calendarApi from '$lib/api/calendar.js';
  import * as meetingsApi from '$lib/api/meetings.js';
  import Card from '$lib/components/ui/Card.svelte';
  import Badge from '$lib/components/ui/Badge.svelte';
  import { currentUser } from '$lib/stores/auth.js';

  /**
   * @typedef {Object} Props
   * @property {(path: string) => void} navigate
   */

  /** @type {Props} */
  let { navigate } = $props();

  /** @type {import('../types/api.js').Calendar | null} */
  let calendar = $state(null);
  
  /** @type {import('../types/api.js').MeetingListItem[]} */
  let upcomingMeetings = $state([]);
  let loading = $state(true);
  let stats = $state({
    totalMeetings: 0,
    todayMeetings: 0,
    pendingMeetings: 0,
  });

  onMount(async () => {
    try {
      const [calendarData, meetingsData] = await Promise.all([
        calendarApi.getMyCalendar(),
        meetingsApi.list({ sort: 'asc', limit: 5 }),
      ]);
      
      calendar = calendarData;
      upcomingMeetings = meetingsData.data || [];
      
      // Calculate stats
      stats = {
        totalMeetings: meetingsData.meta?.total || 0,
        todayMeetings: upcomingMeetings.filter(m => {
          const meetingDate = new Date(m.startTime);
          const today = new Date();
          return meetingDate.toDateString() === today.toDateString();
        }).length,
        pendingMeetings: upcomingMeetings.filter(m => m.status === 'pending').length,
      };
      
      loading = false;
    } catch (err) {
      loading = false;
    }
  });

  function formatDate(dateStr) {
    return new Date(dateStr).toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  function getStatusBadge(status) {
    switch (status) {
      case 'confirmed': return 'success';
      case 'pending': return 'warning';
      case 'cancelled': return 'danger';
      default: return 'default';
    }
  }
</script>

<div class="page">
  <div class="container">
    <div class="page-header">
      <h1>Панель управления</h1>
      <p class="subtitle">Добро пожаловать, {$currentUser?.name || 'User'}!</p>
    </div>

    {#if loading}
      <div class="loading">Загрузка...</div>
    {:else}
      <!-- Stats -->
      <div class="stats-grid">
        <Card padding="md">
          <div class="stat-card">
            <span class="stat-value">{stats.totalMeetings}</span>
            <span class="stat-label">Всего встреч</span>
          </div>
        </Card>
        <Card padding="md">
          <div class="stat-card">
            <span class="stat-value">{stats.todayMeetings}</span>
            <span class="stat-label">Сегодня</span>
          </div>
        </Card>
        <Card padding="md">
          <div class="stat-card">
            <span class="stat-value">{stats.pendingMeetings}</span>
            <span class="stat-label">Ожидают</span>
          </div>
        </Card>
      </div>

      <div class="dashboard-grid">
        <!-- Quick Actions -->
        <div class="quick-actions">
          <Card padding="md">
            <h3>Быстрые действия</h3>
            <div class="actions-list">
              <button class="action-btn" onclick={() => navigate('/admin/meeting-types')}>
                <span class="icon">📅</span>
                <span>Типы встреч</span>
              </button>
              <button class="action-btn" onclick={() => navigate('/admin/availability')}>
                <span class="icon">⏰</span>
                <span>Доступность</span>
              </button>
              <button class="action-btn" onclick={() => navigate('/admin/meetings')}>
                <span class="icon">👥</span>
                <span>Все встречи</span>
              </button>
            </div>
          </Card>
        </div>

        <!-- Calendar Info -->
        <div class="calendar-info">
          <Card padding="md">
            <h3>Мой календарь</h3>
            {#if calendar}
              <div class="info-list">
                <div class="info-row">
                  <span class="label">Название</span>
                  <span class="value">{calendar.name}</span>
                </div>
                <div class="info-row">
                  <span class="label">Часовой пояс</span>
                  <span class="value">{calendar.timezone}</span>
                </div>
                <div class="info-row">
                  <span class="label">Цвет</span>
                  <span class="color-preview" style="background-color: {calendar.color}"></span>
                </div>
                <div class="info-row">
                  <span class="label">Мин. уведомление</span>
                  <span class="value">{calendar.minBookingNoticeMinutes} мин</span>
                </div>
                <div class="info-row">
                  <span class="label">Макс. бронирование</span>
                  <span class="value">{calendar.maxBookingDaysAhead} дней</span>
                </div>
              </div>
            {/if}
          </Card>
        </div>

        <!-- Upcoming Meetings -->
        <div class="upcoming-meetings">
          <Card padding="md">
            <div class="section-header">
              <h3>Предстоящие встречи</h3>
              <button class="view-all" onclick={() => navigate('/admin/meetings')}>
                Все →
              </button>
            </div>
            
            {#if upcomingMeetings.length === 0}
              <p class="empty">Нет предстоящих встреч</p>
            {:else}
              <div class="meetings-list">
                {#each upcomingMeetings as meeting}
                  <div class="meeting-item">
                    <div class="meeting-info">
                      <span class="meeting-type">{meeting.meetingTypeName}</span>
                      <span class="meeting-guest">{meeting.guestName}</span>
                    </div>
                    <div class="meeting-meta">
                      <span class="meeting-time">{formatDate(meeting.startTime)}</span>
                      <Badge variant={getStatusBadge(meeting.status)}>
                        {meeting.status}
                      </Badge>
                    </div>
                  </div>
                {/each}
              </div>
            {/if}
          </Card>
        </div>
      </div>
    {/if}
  </div>
</div>

<style>
  .page {
    padding: var(--space-2xl) 0;
  }

  .page-header {
    margin-bottom: var(--space-xl);
  }

  .page-header h1 {
    font-size: var(--font-size-2xl);
    margin-bottom: var(--space-sm);
  }

  .subtitle {
    color: var(--color-text-secondary);
    font-size: var(--font-size-md);
    margin: 0;
  }

  .stats-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: var(--space-lg);
    margin-bottom: var(--space-xl);
  }

  .stat-card {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
  }

  .stat-value {
    font-size: var(--font-size-3xl);
    font-weight: var(--font-weight-bold);
    color: var(--color-primary);
  }

  .stat-label {
    font-size: var(--font-size-sm);
    color: var(--color-text-secondary);
    margin-top: var(--space-xs);
  }

  .dashboard-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: var(--space-lg);
  }

  .quick-actions {
    grid-column: 1;
  }

  .calendar-info {
    grid-column: 2;
  }

  .upcoming-meetings {
    grid-column: 1 / -1;
  }

  h3 {
    font-size: var(--font-size-lg);
    margin-bottom: var(--space-md);
  }

  .actions-list {
    display: flex;
    flex-direction: column;
    gap: var(--space-sm);
  }

  .action-btn {
    display: flex;
    align-items: center;
    gap: var(--space-md);
    padding: var(--space-md);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-md);
    background: white;
    cursor: pointer;
    transition: all var(--transition-fast);
    font-size: var(--font-size-md);
  }

  .action-btn:hover {
    border-color: var(--color-primary);
    background-color: var(--color-primary-light);
  }

  .icon {
    font-size: var(--font-size-xl);
  }

  .info-list {
    display: flex;
    flex-direction: column;
    gap: var(--space-md);
  }

  .info-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .info-row .label {
    font-size: var(--font-size-sm);
    color: var(--color-text-muted);
  }

  .info-row .value {
    font-size: var(--font-size-sm);
    font-weight: var(--font-weight-medium);
  }

  .color-preview {
    width: 20px;
    height: 20px;
    border-radius: var(--radius-sm);
  }

  .section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: var(--space-md);
  }

  .view-all {
    font-size: var(--font-size-sm);
    color: var(--color-primary);
    background: none;
    border: none;
    cursor: pointer;
  }

  .view-all:hover {
    text-decoration: underline;
  }

  .empty {
    text-align: center;
    color: var(--color-text-muted);
    padding: var(--space-xl) 0;
  }

  .meetings-list {
    display: flex;
    flex-direction: column;
    gap: var(--space-md);
  }

  .meeting-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: var(--space-md);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-md);
  }

  .meeting-info {
    display: flex;
    flex-direction: column;
    gap: var(--space-xs);
  }

  .meeting-type {
    font-weight: var(--font-weight-semibold);
  }

  .meeting-guest {
    font-size: var(--font-size-sm);
    color: var(--color-text-secondary);
  }

  .meeting-meta {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: var(--space-xs);
  }

  .meeting-time {
    font-size: var(--font-size-sm);
    color: var(--color-text-muted);
  }

  @media (max-width: 768px) {
    .stats-grid {
      grid-template-columns: 1fr;
    }

    .dashboard-grid {
      grid-template-columns: 1fr;
    }

    .quick-actions,
    .calendar-info,
    .upcoming-meetings {
      grid-column: 1;
    }
  }
</style>
