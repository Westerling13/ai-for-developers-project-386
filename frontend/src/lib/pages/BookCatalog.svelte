<script>
  import { onMount } from 'svelte';
  import * as meetingTypesApi from '$lib/api/meetingTypes.js';
  import Card from '$lib/components/ui/Card.svelte';
  import Badge from '$lib/components/ui/Badge.svelte';

  /**
   * @typedef {Object} Props
   * @property {(path: string) => void} navigate
   */

  /** @type {Props} */
  let { navigate } = $props();

  /** @type {import('$lib/types/api.js').MeetingTypePublicView[]} */
  let meetingTypes = $state([]);
  let loading = $state(true);
  let error = $state('');

  // For demo, using a mock calendar ID - in real app this would come from URL
  const calendarId = '123e4567-e89b-12d3-a456-426614174000';

  onMount(async () => {
    try {
      meetingTypes = await meetingTypesApi.listPublic(calendarId);
      loading = false;
    } catch (/** @type {any} */ err) {
      error = err.message || 'Failed to load meeting types';
      loading = false;
    }
  });

  function selectMeetingType(/** @type {import('$lib/types/api.js').MeetingTypePublicView} */ type) {
    navigate(`/book/${type.id}`);
  }
</script>

<div class="page">
  <div class="container">
    <div class="host-card">
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
            <h3>Tota</h3>
            <span class="host-label">Host</span>
          </div>
        </div>
        <h2 class="page-title">Выберите тип события</h2>
        <p class="page-subtitle">
          Нажмите на карточку, чтобы открыть календарь и выбрать удобный слот.
        </p>
      </Card>
    </div>

    {#if loading}
      <div class="loading">Загрузка...</div>
    {:else if error}
      <div class="error">{error}</div>
    {:else}
      <div class="meeting-types-grid">
        {#each meetingTypes as type (type.id)}
          <Card hoverable on:click={() => selectMeetingType(type)}>
            <div class="meeting-type-card">
              <div class="meeting-type-header">
                <h3>{type.name}</h3>
                <Badge variant="default">{type.durationMinutes} мин</Badge>
              </div>
              {#if type.description}
                <p class="description">{type.description}</p>
              {/if}
            </div>
          </Card>
        {/each}
      </div>
    {/if}
  </div>
</div>

<style>
  .page {
    padding: var(--space-2xl) 0;
  }

  .host-card {
    max-width: 900px;
    margin: 0 auto var(--space-2xl);
  }

  .host-info {
    display: flex;
    align-items: center;
    gap: var(--space-md);
    margin-bottom: var(--space-lg);
  }

  .avatar {
    width: 48px;
    height: 48px;
    border-radius: 50%;
    overflow: hidden;
  }

  .host-details h3 {
    font-size: var(--font-size-lg);
    font-weight: var(--font-weight-semibold);
    margin: 0;
  }

  .host-label {
    font-size: var(--font-size-sm);
    color: var(--color-text-muted);
  }

  .page-title {
    font-size: var(--font-size-2xl);
    font-weight: var(--font-weight-bold);
    margin-bottom: var(--space-sm);
  }

  .page-subtitle {
    font-size: var(--font-size-md);
    color: var(--color-text-secondary);
    margin: 0;
  }

  .meeting-types-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: var(--space-lg);
    max-width: 900px;
    margin: 0 auto;
  }

  .meeting-type-card {
    display: flex;
    flex-direction: column;
    gap: var(--space-sm);
  }

  .meeting-type-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: var(--space-md);
  }

  .meeting-type-header h3 {
    font-size: var(--font-size-lg);
    font-weight: var(--font-weight-semibold);
    margin: 0;
  }

  .description {
    font-size: var(--font-size-md);
    color: var(--color-text-secondary);
    margin: 0;
  }

  .loading, .error {
    text-align: center;
    padding: var(--space-2xl);
    color: var(--color-text-secondary);
  }

  .error {
    color: var(--color-danger);
  }

  @media (max-width: 768px) {
    .meeting-types-grid {
      grid-template-columns: 1fr;
    }
  }
</style>
