<script setup lang="ts">
definePageMeta({ layout: 'admin', middleware: 'admin-auth' })
useSeoMeta({ title: 'Encontros — Fly Up Milhas Admin', robots: 'noindex, nofollow' })

const search = ref('')
const statusFilter = ref('all')
const dateFrom = ref('')
const dateTo = ref('')
const page = ref(1)
const showFilters = ref(false)

const queryParams = computed(() => ({
  page: page.value,
  limit: 20,
  ...(statusFilter.value !== 'all' && { status: statusFilter.value }),
  ...(dateFrom.value && { dateFrom: dateFrom.value }),
  ...(dateTo.value && { dateTo: dateTo.value }),
  ...(search.value && { search: search.value }),
}))

const { data } = await useFetch('/api/admin/meetings', {
  query: queryParams,
  watch: [queryParams],
})

const statusOptions = [
  { label: 'Todos os status', value: 'all' },
  { label: 'A agendar', value: 'pending' },
  { label: 'Agendado', value: 'scheduled' },
  { label: 'Realizado', value: 'completed' },
  { label: 'Cancelado', value: 'cancelled' },
]

const statusConfig: Record<string, { label: string, color: string }> = {
  pending: { label: 'A agendar', color: 'warning' },
  scheduled: { label: 'Agendado', color: 'info' },
  completed: { label: 'Realizado', color: 'success' },
  cancelled: { label: 'Cancelado', color: 'error' },
}

function formatDateTime(d: string) {
  return new Date(d).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })
}

let searchTimeout: ReturnType<typeof setTimeout>
function onSearch(val: string) {
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    search.value = val
    page.value = 1
  }, 400)
}

function resetFilters() {
  statusFilter.value = 'all'
  dateFrom.value = ''
  dateTo.value = ''
  search.value = ''
  page.value = 1
}

const activeFilterCount = computed(() => {
  let count = 0
  if (statusFilter.value !== 'all') count++
  if (dateFrom.value) count++
  if (dateTo.value) count++
  return count
})

const columns = [
  { id: 'customerName', accessorKey: 'customerName', header: 'Cliente' },
  { id: 'title', accessorKey: 'title', header: 'Encontro' },
  { id: 'status', accessorKey: 'status', header: 'Status' },
  { id: 'scheduledAt', accessorKey: 'scheduledAt', header: 'Data/Hora' },
  { id: 'duration', accessorKey: 'duration', header: 'Duração' },
  { id: 'actions', header: '' },
]
</script>

<template>
  <div>
    <!-- Header -->
    <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 1.5rem;">
      <div>
        <h1 style="font-size: 1.5rem; font-weight: 700; color: var(--ui-text);">Encontros</h1>
        <p style="font-size: 0.875rem; color: var(--ui-text-muted);">{{ data?.total || 0 }} encontros</p>
      </div>
    </div>

    <!-- Search + Filters + Table -->
    <UCard :ui="{ body: 'p-0' }">
      <div style="padding: 0.75rem; border-bottom: 1px solid var(--ui-border);">
        <div style="display: flex; gap: 0.5rem; align-items: center;">
          <UInput
            icon="i-heroicons-magnifying-glass"
            placeholder="Buscar por nome, email ou telefone do cliente..."
            :model-value="search"
            style="flex: 1;"
            @update:model-value="onSearch($event as string)"
          />
          <UButton
            :icon="showFilters ? 'i-heroicons-funnel-solid' : 'i-heroicons-funnel'"
            :color="activeFilterCount > 0 ? 'primary' : 'neutral'"
            :variant="showFilters ? 'soft' : 'outline'"
            size="sm"
            :label="activeFilterCount > 0 ? `Filtros (${activeFilterCount})` : 'Filtros'"
            @click="showFilters = !showFilters"
          />
        </div>

        <div v-if="showFilters" style="display: flex; gap: 0.5rem; flex-wrap: wrap; align-items: center; margin-top: 0.75rem; padding-top: 0.75rem; border-top: 1px solid var(--ui-border);">
          <USelect
            v-model="statusFilter"
            :items="statusOptions"
            value-key="value"
            label-key="label"
            size="sm"
            style="min-width: 155px;"
            @update:model-value="page = 1"
          />
          <div style="display: flex; align-items: center; gap: 0.25rem;">
            <UInput v-model="dateFrom" type="date" size="sm" style="width: 140px;" @update:model-value="page = 1" />
            <span style="font-size: 0.7rem; color: var(--ui-text-muted);">—</span>
            <UInput v-model="dateTo" type="date" size="sm" style="width: 140px;" @update:model-value="page = 1" />
          </div>
          <UButton
            v-if="activeFilterCount > 0"
            label="Limpar"
            color="neutral"
            variant="ghost"
            size="xs"
            icon="i-heroicons-x-mark"
            @click="resetFilters"
          />
        </div>
      </div>

      <!-- Table -->
      <UTable :columns="columns" :data="data?.meetings || []">
        <template #customerName-cell="{ row }">
          <NuxtLink :to="`/admin/customers/${row.original.customerId}`" style="text-decoration: none;">
            <div style="font-weight: 500; color: var(--ui-text);">{{ row.original.customerName }}</div>
            <div style="font-size: 0.7rem; color: var(--ui-text-muted);">{{ row.original.customerEmail }}</div>
          </NuxtLink>
        </template>

        <template #title-cell="{ row }">
          <span style="font-size: 0.85rem; color: var(--ui-text);">{{ row.original.title }}</span>
        </template>

        <template #status-cell="{ row }">
          <UBadge
            :color="statusConfig[row.original.status]?.color || 'neutral'"
            variant="subtle"
            size="xs"
          >
            {{ statusConfig[row.original.status]?.label || row.original.status }}
          </UBadge>
        </template>

        <template #scheduledAt-cell="{ row }">
          <span v-if="row.original.scheduledAt" style="font-size: 0.8rem; color: var(--ui-text-muted);">
            {{ formatDateTime(row.original.scheduledAt) }}
          </span>
          <span v-else style="font-size: 0.75rem; color: var(--ui-text-muted);">—</span>
        </template>

        <template #duration-cell="{ row }">
          <span style="font-size: 0.8rem; color: var(--ui-text-muted);">{{ row.original.duration }} min</span>
        </template>

        <template #actions-cell="{ row }">
          <div style="display: flex; align-items: center; gap: 0.25rem;">
            <UButton
              v-if="row.original.meetLink"
              :href="row.original.meetLink"
              target="_blank"
              icon="i-heroicons-video-camera"
              color="primary"
              variant="ghost"
              size="xs"
            />
            <UButton
              :to="`/admin/customers/${row.original.customerId}`"
              icon="i-heroicons-chevron-right"
              color="neutral"
              variant="ghost"
              size="xs"
            />
          </div>
        </template>
      </UTable>
    </UCard>

    <!-- Pagination -->
    <div v-if="data && data.totalPages > 1" style="display: flex; justify-content: center; margin-top: 1rem;">
      <UPagination
        v-model="page"
        :total="data.total"
        :items-per-page="20"
      />
    </div>
  </div>
</template>
