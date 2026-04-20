<script>
  import { onMount } from 'svelte';
  import * as timeSlotsApi from '$lib/api/timeSlots.js';
  import * as meetingsApi from '$lib/api/meetings.js';
  import { notifications } from '$lib/stores/notifications.js';
  import Card from '$lib/components/ui/Card.svelte';
  import Button from '$lib/components/ui/Button.svelte';
  import Input from '$lib/components/ui/Input.svelte';
  import Badge from '$lib/components/ui/Badge.svelte';

  /**
   * @typedef {Object} Props
   * @property {(path: string) => void} navigate
   */

  /** @type {Props} */
  let { navigate } = $props();

  // For demo purposes
  const meetingTypeId = 1;
  const calendarId = '123e4567-e89b-12d3-a456-426614174000';
  const meetingTypeName = 'Встреча 15 минут';
  const durationMinutes = 15;
  const description = 'Короткий тип события для быстрого слота.';

  let currentDate = $state(new Date());
  let selectedDate = $state(/** @type {Date | null} */ (null));
  let selectedSlot = $state(/** @type {import('$lib/types/api.js').TimeSlot | null} */ (null));
  
  /** @type {import('$lib/types/api.js').TimeSlotsByDate[]} */
  let timeSlots = $state([]);
  let loading = $state(true);
  let booking = $state(false);
  
  // Booking form
  let guestName = $state('');
  let guestEmail = $state('');
  let notes = $state('');

  onMount(async () => {
    await loadTimeSlots();
  });

  async function loadTimeSlots() {
    const from = new Date(currentDate);
    from.setDate(1);
    const to = new Date(currentDate);
    to.setMonth(to.getMonth() + 1, 0);

    try {
      loading = true;
      timeSlots = await timeSlotsApi.getAvailable(calendarId, {
        from: from.toISOString().split('T')[0],
        to: to.toISOString().split('T')[0],
        durationMinutes,
        meetingTypeId,
      });
      loading = false;
    } catch (/** @type {any} */ err) {
      notifications.error('Failed to load time slots');
      loading = false;
    }
  }

  function changeMonth(delta) {
    currentDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + delta, 1);
    loadTimeSlots();
  }

  function selectDate(dateStr) {
    selectedDate = new Date(dateStr);
    selectedSlot = null;
  }

  function selectSlot(slot) {
    selectedSlot = slot;
  }

  function formatMonth(date) {
    const months = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 
                    'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'];
    return `${months[date.getMonth()]} ${date.getFullYear()} г.`;
  }

  function formatDate(date) {
    const days = ['воскресенье', 'понедельник', 'вторник', 'среда', 'четверг', 'пятница', 'суббота'];
    const months = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 
                    'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'];
    return `${days[date.getDay()]}, ${date.getDate()} ${months[date.getMonth()]}`;
  }

  function formatTime(dateTimeStr) {
    const date = new Date(dateTimeStr);
    return date.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
  }

  function getDaysForCalendar() {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startPadding = firstDay.getDay() === 0 ? 6 : firstDay.getDay() - 1;
    
    const days = [];
    
    // Previous month padding
    for (let i = startPadding - 1; i >= 0; i--) {
      const d = new Date(year, month, -i);
      days.push({ date: d, padding: true });
    }
    
    // Current month
    for (let i = 1; i <= lastDay.getDate(); i++) {
      const d = new Date(year, month, i);
      const dateStr = d.toISOString().split('T')[0];
      const dayData = timeSlots.find(ts => ts.date === dateStr);
      const hasAvailableSlots = dayData?.slots.some(s => s.status === 'available') ?? false;
      days.push({ 
        date: d, 
        padding: false, 
        hasSlots: hasAvailableSlots,
        slotCount: dayData?.slots.filter(s => s.status === 'available').length ?? 0
      });
    }
    
    return days;
  }

  /** @type {import('$lib/types/api.js').TimeSlot[]} */
  let currentDaySlots = $derived.by(() => {
    if (!selectedDate) return [];
    const dateStr = selectedDate.toISOString().split('T')[0];
    const dayData = timeSlots.find(ts => ts.date === dateStr);
    return dayData?.slots ?? [];
  });

  async function handleBooking() {
    if (!selectedSlot || !guestName || !guestEmail) return;

    booking = true;
    try {
      const result = await meetingsApi.book({
        calendarId,
        meetingTypeId,
        startTime: selectedSlot.slotStart,
        guestName,
        guestEmail,
        notes,
      });
      
      notifications.success('Бронирование успешно создано!');
      navigate(`/book/confirmation/${result.id}`);
    } catch (/** @type {any} */ err) {
      notifications.error(err.data?.error?.message || 'Ошибка бронирования');
    } finally {
      booking = false;
    }
  }
</script>

<div class="page">
  <div class="container">
    <h1 class="page-title">{meetingTypeName}</h1>
    
    <div class="booking-layout">
      <!-- Left Panel: Info -->
      <div class="info-panel">
        <Card padding="md">
          <div class="host-info">
            <div class="avatar">
              <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                <circle cx="20" cy="20" r="20" fill="#F3F4F6"/>
                <circle cx="20" cy="16" r="8" fill="#D1D5DB"/>
                <ellipse cx="20" cy="38" rx="14" ry="10" fill="#D1D5DB"/>
              </svg>
            </div>
            <div class="host-details">
              <h4>Tota</h4>
              <span class="host-label">Host</span>
            </div>
          </div>
          
          <div class="meeting-info">
            <h3>{meetingTypeName} <Badge variant="default">{durationMinutes} мин</Badge></h3>
            <p class="description">{description}</p>
          </div>

          {#if selectedDate}
            <div class="selected-info">
              <div class="info-row">
                <span class="label">Выбранная дата</span>
                <span class="value">{formatDate(selectedDate)}</span>
              </div>
              {#if selectedSlot}
                <div class="info-row">
                  <span class="label">Выбранное время</span>
                  <span class="value">{formatTime(selectedSlot.slotStart)} - {formatTime(selectedSlot.slotEnd)}</span>
                </div>
              {:else}
                <div class="info-row">
                  <span class="label">Выбранное время</span>
                  <span class="value muted">Время не выбрано</span>
                </div>
              {/if}
            </div>
          {/if}
        </Card>
      </div>

      <!-- Center: Calendar -->
      <div class="calendar-panel">
        <Card padding="md">
          <div class="calendar-header">
            <h3>Календарь</h3>
            <div class="calendar-nav">
              <button class="nav-btn" onclick={() => changeMonth(-1)}>←</button>
              <button class="nav-btn" onclick={() => changeMonth(1)}>→</button>
            </div>
          </div>
          
          <div class="calendar-month">{formatMonth(currentDate)}</div>
          
          <div class="calendar-grid">
            <div class="weekday-header">Пн</div>
            <div class="weekday-header">Вт</div>
            <div class="weekday-header">Ср</div>
            <div class="weekday-header">Чт</div>
            <div class="weekday-header">Пт</div>
            <div class="weekday-header">Сб</div>
            <div class="weekday-header">Вс</div>
            
            {#each getDaysForCalendar() as day}
              <button
                class="day-cell"
                class:padding={day.padding}
                class:has-slots={day.hasSlots}
                class:selected={selectedDate && day.date.toDateString() === selectedDate.toDateString()}
                disabled={day.padding || !day.hasSlots}
                onclick={() => !day.padding && selectDate(day.date.toISOString().split('T')[0])}
              >
                <span class="day-number">{day.date.getDate()}</span>
                {#if day.hasSlots}
                  <span class="slot-count">{day.slotCount} св.</span>
                {/if}
              </button>
            {/each}
          </div>
        </Card>
      </div>

      <!-- Right: Time Slots -->
      <div class="slots-panel">
        <Card padding="md">
          <h3 class="slots-title">Статус слотов</h3>
          
          {#if !selectedDate}
            <p class="empty-state">Выберите дату в календаре</p>
          {:else if loading}
            <p class="empty-state">Загрузка...</p>
          {:else if currentDaySlots.length === 0}
            <p class="empty-state">Нет доступных слотов на эту дату</p>
          {:else}
            <div class="slots-list">
              {#each currentDaySlots as slot}
                <button
                  class="slot-item"
                  class:available={slot.status === 'available'}
                  class:booked={slot.status === 'booked'}
                  class:selected={selectedSlot?.id === slot.id}
                  disabled={slot.status !== 'available'}
                  onclick={() => selectSlot(slot)}
                >
                  <span class="time">{formatTime(slot.slotStart)} - {formatTime(slot.slotEnd)}</span>
                  <Badge variant={slot.status === 'available' ? 'success' : 'danger'}>
                    {slot.status === 'available' ? 'Свободно' : 'Занято'}
                  </Badge>
                </button>
              {/each}
            </div>
          {/if}

          {#if selectedSlot}
            <div class="booking-form">
              <h4>Введите данные для бронирования</h4>
              <Input
                label="Ваше имя"
                placeholder="Иван Иванов"
                bind:value={guestName}
                required
              />
              <Input
                type="email"
                label="Email"
                placeholder="ivan@example.com"
                bind:value={guestEmail}
                required
              />
              <Input
                label="Заметки (опционально)"
                placeholder="Дополнительная информация"
                bind:value={notes}
              />
            </div>
          {/if}

          <div class="actions">
            <Button variant="secondary" onclick={() => navigate('/book')}>
              Назад
            </Button>
            {#if selectedSlot}
              <Button loading={booking} onclick={handleBooking}>
                Продолжить
              </Button>
            {/if}
          </div>
        </Card>
      </div>
    </div>
  </div>
</div>

<style>
  .page {
    padding: var(--space-xl) 0;
  }

  .page-title {
    font-size: var(--font-size-2xl);
    font-weight: var(--font-weight-bold);
    margin-bottom: var(--space-xl);
  }

  .booking-layout {
    display: grid;
    grid-template-columns: 280px 1fr 300px;
    gap: var(--space-lg);
    align-items: start;
  }

  /* Info Panel */
  .host-info {
    display: flex;
    align-items: center;
    gap: var(--space-sm);
    margin-bottom: var(--space-md);
  }

  .avatar {
    width: 40px;
    height: 40px;
    border-radius: 50%;
  }

  .host-details h4 {
    font-size: var(--font-size-md);
    margin: 0;
  }

  .host-label {
    font-size: var(--font-size-xs);
    color: var(--color-text-muted);
  }

  .meeting-info {
    margin-bottom: var(--space-lg);
  }

  .meeting-info h3 {
    font-size: var(--font-size-lg);
    display: flex;
    align-items: center;
    gap: var(--space-sm);
    margin-bottom: var(--space-sm);
  }

  .description {
    font-size: var(--font-size-sm);
    color: var(--color-text-secondary);
    margin: 0;
  }

  .selected-info {
    display: flex;
    flex-direction: column;
    gap: var(--space-md);
  }

  .info-row {
    display: flex;
    flex-direction: column;
    gap: var(--space-xs);
    padding: var(--space-md);
    background-color: var(--color-border-light);
    border-radius: var(--radius-md);
  }

  .info-row .label {
    font-size: var(--font-size-sm);
    color: var(--color-text-muted);
  }

  .info-row .value {
    font-size: var(--font-size-md);
    font-weight: var(--font-weight-medium);
    color: var(--color-text-primary);
  }

  .info-row .value.muted {
    color: var(--color-text-muted);
  }

  /* Calendar Panel */
  .calendar-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: var(--space-md);
  }

  .calendar-header h3 {
    font-size: var(--font-size-lg);
    margin: 0;
  }

  .calendar-nav {
    display: flex;
    gap: var(--space-sm);
  }

  .nav-btn {
    width: 32px;
    height: 32px;
    border: 1px solid var(--color-border);
    background: white;
    border-radius: var(--radius-md);
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: var(--font-size-md);
    transition: all var(--transition-fast);
  }

  .nav-btn:hover {
    background-color: var(--color-border-light);
  }

  .calendar-month {
    font-size: var(--font-size-md);
    color: var(--color-text-secondary);
    margin-bottom: var(--space-md);
  }

  .calendar-grid {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    gap: var(--space-xs);
  }

  .weekday-header {
    text-align: center;
    font-size: var(--font-size-xs);
    font-weight: var(--font-weight-medium);
    color: var(--color-text-muted);
    padding: var(--space-sm) 0;
  }

  .day-cell {
    aspect-ratio: 1;
    border: 1px solid transparent;
    background: white;
    border-radius: var(--radius-md);
    cursor: pointer;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 2px;
    transition: all var(--transition-fast);
    padding: 2px;
  }

  .day-cell:hover:not(:disabled) {
    border-color: var(--color-primary);
    background-color: var(--color-primary-light);
  }

  .day-cell.selected {
    background-color: var(--color-primary);
    color: white;
  }

  .day-cell.selected .slot-count {
    color: white;
  }

  .day-cell:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }

  .day-cell.padding {
    opacity: 0.3;
  }

  .day-number {
    font-size: var(--font-size-sm);
    font-weight: var(--font-weight-medium);
  }

  .slot-count {
    font-size: 10px;
    color: var(--color-text-muted);
  }

  /* Slots Panel */
  .slots-title {
    font-size: var(--font-size-lg);
    margin-bottom: var(--space-md);
  }

  .empty-state {
    text-align: center;
    color: var(--color-text-muted);
    font-size: var(--font-size-sm);
    padding: var(--space-xl) 0;
  }

  .slots-list {
    display: flex;
    flex-direction: column;
    gap: var(--space-sm);
    max-height: 400px;
    overflow-y: auto;
    margin-bottom: var(--space-lg);
  }

  .slot-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: var(--space-sm) var(--space-md);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-md);
    background: white;
    cursor: pointer;
    transition: all var(--transition-fast);
  }

  .slot-item:hover:not(:disabled) {
    border-color: var(--color-primary);
  }

  .slot-item.selected {
    border-color: var(--color-primary);
    background-color: var(--color-primary-light);
  }

  .slot-item:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .slot-item .time {
    font-size: var(--font-size-sm);
    font-weight: var(--font-weight-medium);
  }

  .booking-form {
    display: flex;
    flex-direction: column;
    gap: var(--space-md);
    margin-bottom: var(--space-lg);
    padding-top: var(--space-lg);
    border-top: 1px solid var(--color-border);
  }

  .booking-form h4 {
    font-size: var(--font-size-md);
    margin: 0;
  }

  .actions {
    display: flex;
    gap: var(--space-md);
    justify-content: flex-end;
  }

  @media (max-width: 1024px) {
    .booking-layout {
      grid-template-columns: 1fr;
    }

    .info-panel {
      order: 1;
    }

    .calendar-panel {
      order: 2;
    }

    .slots-panel {
      order: 3;
    }
  }
</style>
