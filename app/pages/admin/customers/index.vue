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
    <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 1.5rem;">
      <div>
        <h1 style="font-size: 1.5rem; font-weight: 700; color: var(--ui-text);">Clientes</h1>
        <p style="font-size: 0.875rem; color: var(--ui-text-muted);">{{ data?.total || 0 }} clientes</p>
      </div>
      <UButton to="/admin/customers/new" label="Novo cliente" color="primary" icon="i-heroicons-plus" />
    </div>

    <!-- Search + filter toggle -->
    <UCard :ui="{ body: 'p-0' }">
      <div style="padding: 0.75rem; border-bottom: 1px solid var(--ui-border);">
        <div style="display: flex; gap: 0.5rem; align-items: center;">
          <UInput
            icon="i-heroicons-magnifying-glass"
            placeholder="Buscar por nome, email ou telefone..."
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

        <!-- Expandable filters -->
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
          <USelect
            v-model="assessmentFilter"
            :items="assessmentOptions"
            value-key="value"
            label-key="label"
            size="sm"
            style="min-width: 135px;"
            @update:model-value="page = 1"
          />
          <USelect
            v-model="paymentFilter"
            :items="paymentOptions"
            value-key="value"
            label-key="label"
            size="sm"
            style="min-width: 145px;"
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
      <UTable :columns="columns" :data="data?.customers || []">
        <template #name-cell="{ row }">
          <NuxtLink :to="`/admin/customers/${row.original._id}`" style="font-weight: 500; color: var(--ui-text); text-decoration: none;">
            {{ row.original.name }}
          </NuxtLink>
        </template>

        <template #email-cell="{ row }">
          <span style="font-size: 0.8rem; color: var(--ui-text-muted);">{{ row.original.email }}</span>
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
          <span v-else style="color: var(--ui-text-muted); font-size: 0.75rem;">—</span>
        </template>

        <template #createdAt-cell="{ row }">
          <span style="color: var(--ui-text-muted); font-size: 0.8rem;">{{ formatDate(row.original.createdAt) }}</span>
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
