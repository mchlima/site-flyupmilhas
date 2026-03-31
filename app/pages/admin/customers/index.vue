<script setup lang="ts">
definePageMeta({ layout: 'admin', middleware: 'admin-auth' })
useSeoMeta({ title: 'Clientes — Fly Up Milhas Admin', robots: 'noindex, nofollow' })

const search = ref('')
const statusFilter = ref('all')
const assessmentFilter = ref('all')
const paymentFilter = ref('all')
const dateFrom = ref('')
const dateTo = ref('')
const page = ref(1)
const showFilters = ref(false)

const queryParams = computed(() => ({
  page: page.value,
  limit: 20,
  ...(statusFilter.value !== 'all' && { status: statusFilter.value }),
  ...(assessmentFilter.value !== 'all' && { assessment: assessmentFilter.value }),
  ...(paymentFilter.value !== 'all' && { payment: paymentFilter.value }),
  ...(dateFrom.value && { dateFrom: dateFrom.value }),
  ...(dateTo.value && { dateTo: dateTo.value }),
  ...(search.value && { search: search.value }),
}))

const { data } = await useFetch('/api/admin/customers', {
  query: queryParams,
  watch: [queryParams],
})

const statusOptions = [
  { label: 'Todos os status', value: 'all' },
  ...CUSTOMER_STATUSES.map(s => ({ label: s.label, value: s.value })),
]

const assessmentOptions = [
  { label: 'Avaliação', value: 'all' },
  { label: 'Preenchida', value: 'yes' },
  { label: 'Pendente', value: 'no' },
]

const paymentOptions = [
  { label: 'Pagamento', value: 'all' },
  { label: 'Pago', value: 'paid' },
  { label: 'Sem pagamento', value: 'none' },
]

function formatDate(d: string) {
  return new Date(d).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' })
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
  assessmentFilter.value = 'all'
  paymentFilter.value = 'all'
  dateFrom.value = ''
  dateTo.value = ''
  search.value = ''
  page.value = 1
}

const activeFilterCount = computed(() => {
  let count = 0
  if (statusFilter.value !== 'all') count++
  if (assessmentFilter.value !== 'all') count++
  if (paymentFilter.value !== 'all') count++
  if (dateFrom.value) count++
  if (dateTo.value) count++
  return count
})

const columns = [
  { id: 'name', accessorKey: 'name', header: 'Nome' },
  { id: 'email', accessorKey: 'email', header: 'Email' },
  { id: 'status', accessorKey: 'status', header: 'Status' },
  { id: 'hasAssessment', accessorKey: 'hasAssessment', header: 'Avaliação' },
  { id: 'paymentStatus', accessorKey: 'paymentStatus', header: 'Pagamento' },
  { id: 'createdAt', accessorKey: 'createdAt', header: 'Data' },
  { id: 'actions', header: '' },
]
</script>

<template>
  <div>
    <!-- Header -->
    <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-6">
      <div>
        <h1 class="text-2xl font-bold text-[var(--ui-text)]">Clientes</h1>
        <p class="text-sm text-[var(--ui-text-muted)]">{{ data?.total || 0 }} clientes</p>
      </div>
      <UButton to="/admin/customers/new" label="Novo cliente" color="primary" icon="i-heroicons-plus" />
    </div>

    <!-- Search + filter toggle -->
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

        <!-- Expandable filters -->
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
          <USelect
            v-model="assessmentFilter"
            :items="assessmentOptions"
            value-key="value"
            label-key="label"
            size="sm"
            class="min-w-[135px]"
            @update:model-value="page = 1"
          />
          <USelect
            v-model="paymentFilter"
            :items="paymentOptions"
            value-key="value"
            label-key="label"
            size="sm"
            class="min-w-[145px]"
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
        <UTable :columns="columns" :data="data?.customers || []">
          <template #name-cell="{ row }">
            <NuxtLink :to="`/admin/customers/${row.original._id}`" class="font-medium text-[var(--ui-text)] no-underline">
              {{ row.original.name }}
            </NuxtLink>
          </template>

          <template #email-cell="{ row }">
            <span class="text-[0.8rem] text-[var(--ui-text-muted)]">{{ row.original.email }}</span>
          </template>

          <template #status-cell="{ row }">
            <UBadge :color="getStatusColor(row.original.status || 'lead')" variant="subtle" size="xs">
              {{ getStatusLabel(row.original.status || 'lead') }}
            </UBadge>
          </template>

          <template #hasAssessment-cell="{ row }">
            <UBadge v-if="row.original.hasAssessment" color="success" variant="subtle" size="xs">Sim</UBadge>
            <UBadge v-else color="neutral" variant="subtle" size="xs">Não</UBadge>
          </template>

          <template #paymentStatus-cell="{ row }">
            <UBadge v-if="row.original.paymentStatus === 'paid'" color="success" variant="subtle" size="xs">Pago</UBadge>
            <UBadge v-else-if="row.original.paymentStatus === 'pending'" color="warning" variant="subtle" size="xs">Pendente</UBadge>
            <span v-else class="text-[var(--ui-text-muted)] text-xs">—</span>
          </template>

          <template #createdAt-cell="{ row }">
            <span class="text-[var(--ui-text-muted)] text-[0.8rem]">{{ formatDate(row.original.createdAt) }}</span>
          </template>

          <template #actions-cell="{ row }">
            <UButton
              :to="`/admin/customers/${row.original._id}`"
              icon="i-heroicons-chevron-right"
              color="neutral"
              variant="ghost"
              size="xs"
            />
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
