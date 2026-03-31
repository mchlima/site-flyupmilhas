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
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-[var(--ui-text)]">Encontros</h1>
      <p class="text-sm text-[var(--ui-text-muted)]">{{ data?.total || 0 }} encontros</p>
    </div>

    <!-- Search + Filters + Table -->
    <UCard :ui="{ body: 'p-0' }">
      <div class="p-3 border-b border-[var(--ui-border)]">
        <div class="flex gap-2 items-center">
          <UInput
            icon="i-heroicons-magnifying-glass"
            placeholder="Buscar por nome, email ou telefone..."
            :model-value="search"
            class="flex-1"
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

        <div v-if="showFilters" class="flex gap-2 flex-wrap items-center mt-3 pt-3 border-t border-[var(--ui-border)]">
          <USelect
            v-model="statusFilter"
            :items="statusOptions"
            value-key="value"
            label-key="label"
            size="sm"
            class="min-w-[155px]"
            @update:model-value="page = 1"
          />
          <div class="flex items-center gap-1">
            <UInput v-model="dateFrom" type="date" size="sm" class="w-[140px]" @update:model-value="page = 1" />
            <span class="text-xs text-[var(--ui-text-muted)]">—</span>
            <UInput v-model="dateTo" type="date" size="sm" class="w-[140px]" @update:model-value="page = 1" />
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
      <div class="overflow-x-auto">
        <UTable :columns="columns" :data="data?.meetings || []">
          <template #customerName-cell="{ row }">
            <NuxtLink :to="`/admin/customers/${row.original.customerId}`" class="no-underline">
              <div class="font-medium text-[var(--ui-text)]">{{ row.original.customerName }}</div>
              <div class="text-[0.7rem] text-[var(--ui-text-muted)]">{{ row.original.customerEmail }}</div>
            </NuxtLink>
          </template>

          <template #title-cell="{ row }">
            <span class="text-sm text-[var(--ui-text)]">{{ row.original.title }}</span>
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
            <span v-if="row.original.scheduledAt" class="text-[0.8rem] text-[var(--ui-text-muted)]">
              {{ formatDateTime(row.original.scheduledAt) }}
            </span>
            <span v-else class="text-xs text-[var(--ui-text-muted)]">—</span>
          </template>

          <template #duration-cell="{ row }">
            <span class="text-[0.8rem] text-[var(--ui-text-muted)]">{{ row.original.duration }} min</span>
          </template>

          <template #actions-cell="{ row }">
            <div class="flex items-center gap-1">
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
      </div>
    </UCard>

    <!-- Pagination -->
    <div v-if="data && data.totalPages > 1" class="flex justify-center mt-4">
      <UPagination
        v-model="page"
        :total="data.total"
        :items-per-page="20"
      />
    </div>
  </div>
</template>
