<script setup lang="ts">
definePageMeta({ layout: 'admin', middleware: 'admin-auth' })
useSeoMeta({ title: 'Dashboard — Fly Up Milhas Admin', robots: 'noindex, nofollow' })

const dateFrom = ref('')
const dateTo = ref('')

const queryParams = computed(() => ({
  ...(dateFrom.value && { dateFrom: dateFrom.value }),
  ...(dateTo.value && { dateTo: dateTo.value }),
}))

const { data: stats } = await useFetch('/api/admin/stats', {
  query: queryParams,
  watch: [queryParams],
})

function formatCurrency(cents: number) {
  return `R$ ${(cents / 100).toFixed(2).replace('.', ',')}`
}

function resetPeriod() {
  dateFrom.value = ''
  dateTo.value = ''
}

const hasPeriod = computed(() => dateFrom.value || dateTo.value)

const statusRows = computed(() => {
  const counts = stats.value?.statusCounts || {}
  return CUSTOMER_STATUSES.map(s => ({
    ...s,
    count: counts[s.value] || 0,
  }))
})

const conversionRate = computed(() => {
  if (!stats.value?.totalCustomers) return '0'
  return Math.round((stats.value.totalPaid / stats.value.totalCustomers) * 100).toString()
})
</script>

<template>
  <div>
    <!-- Header + Period -->
    <div class="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between mb-6">
      <div>
        <h1 class="text-2xl font-bold text-[var(--ui-text)]">Dashboard</h1>
        <p class="text-sm text-[var(--ui-text-muted)]">Visão geral</p>
      </div>
      <div class="flex items-center gap-1.5">
        <UInput v-model="dateFrom" type="date" size="sm" class="w-[140px]" />
        <span class="text-xs text-[var(--ui-text-muted)]">—</span>
        <UInput v-model="dateTo" type="date" size="sm" class="w-[140px]" />
        <UButton v-if="hasPeriod" icon="i-heroicons-x-mark" color="neutral" variant="ghost" size="xs" @click="resetPeriod" />
      </div>
    </div>

    <!-- Clientes -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
      <UCard>
        <div class="text-[0.7rem] text-[var(--ui-text-muted)] uppercase tracking-wide">Clientes</div>
        <div class="text-3xl font-extrabold text-[var(--ui-text)] leading-tight mt-1">{{ stats?.totalCustomers || 0 }}</div>
        <div class="text-[0.7rem] text-[var(--ui-text-muted)] mt-1">
          {{ stats?.customersThisWeek || 0 }} esta semana · {{ stats?.customersThisMonth || 0 }} este mês
        </div>
      </UCard>

      <UCard>
        <div class="text-[0.7rem] text-[var(--ui-text-muted)] uppercase tracking-wide">Avaliações</div>
        <div class="text-3xl font-extrabold text-[var(--ui-text)] leading-tight mt-1">{{ stats?.totalAssessments || 0 }}</div>
      </UCard>

      <UCard>
        <div class="text-[0.7rem] text-[var(--ui-text-muted)] uppercase tracking-wide">Encontros</div>
        <div class="text-3xl font-extrabold text-[var(--ui-text)] leading-tight mt-1">{{ stats?.totalMeetings || 0 }}</div>
        <div class="text-[0.7rem] text-[var(--ui-text-muted)] mt-1">
          {{ stats?.scheduledMeetings || 0 }} agendados · {{ stats?.completedMeetings || 0 }} realizados
        </div>
      </UCard>
    </div>

    <!-- Financeiro -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mt-3">
      <UCard>
        <div class="text-[0.7rem] text-[var(--ui-text-muted)] uppercase tracking-wide">Pagamentos</div>
        <div class="text-3xl font-extrabold text-[var(--ui-text)] leading-tight mt-1">{{ stats?.totalPaid || 0 }}</div>
        <div class="text-[0.7rem] text-[var(--ui-text-muted)] mt-1">
          {{ conversionRate }}% de conversão
        </div>
      </UCard>

      <UCard>
        <div class="text-[0.7rem] text-[var(--ui-text-muted)] uppercase tracking-wide">Receita</div>
        <div class="text-3xl font-extrabold text-[var(--ui-color-success-500)] leading-tight mt-1">{{ formatCurrency(stats?.grossRevenue || 0) }}</div>
      </UCard>

      <UCard>
        <div class="text-[0.7rem] text-[var(--ui-text-muted)] uppercase tracking-wide">Ticket médio</div>
        <div class="text-3xl font-extrabold text-[var(--ui-text)] leading-tight mt-1">{{ formatCurrency(stats?.totalPaid ? Math.round((stats.grossRevenue || 0) / stats.totalPaid) : 0) }}</div>
      </UCard>
    </div>

    <!-- Status -->
    <UCard class="mt-3">
      <template #header>
        <span class="font-semibold text-sm">Clientes por status</span>
      </template>

      <div class="flex flex-col gap-1.5">
        <div
          v-for="row in statusRows"
          :key="row.value"
          class="flex items-center justify-between py-1.5"
        >
          <div class="flex items-center gap-3 flex-1">
            <UBadge :color="row.color" variant="subtle" size="xs" class="min-w-[5.5rem] justify-center">{{ row.label }}</UBadge>
            <div class="flex-1 h-1 bg-[var(--ui-bg-elevated)] rounded-sm overflow-hidden">
              <div
                class="h-full rounded-sm transition-[width] duration-300"
                :style="{
                  width: `${stats?.totalCustomers ? (row.count / stats.totalCustomers) * 100 : 0}%`,
                  background: `var(--ui-color-${row.color}-500)`,
                }"
              />
            </div>
          </div>
          <span class="font-semibold text-sm min-w-8 text-right text-[var(--ui-text)]">{{ row.count }}</span>
        </div>
      </div>
    </UCard>
  </div>
</template>
