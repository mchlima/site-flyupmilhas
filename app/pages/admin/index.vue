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
    <div style="display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 1.5rem;">
      <div>
        <h1 style="font-size: 1.5rem; font-weight: 700; color: var(--ui-text);">Dashboard</h1>
        <p style="font-size: 0.875rem; color: var(--ui-text-muted);">Visão geral</p>
      </div>
      <div style="display: flex; align-items: center; gap: 0.375rem;">
        <UInput v-model="dateFrom" type="date" size="sm" style="width: 140px;" />
        <span style="font-size: 0.7rem; color: var(--ui-text-muted);">—</span>
        <UInput v-model="dateTo" type="date" size="sm" style="width: 140px;" />
        <UButton v-if="hasPeriod" icon="i-heroicons-x-mark" color="neutral" variant="ghost" size="xs" @click="resetPeriod" />
      </div>
    </div>

    <!-- Clientes -->
    <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 0.75rem;">
      <UCard>
        <div style="font-size: 0.7rem; color: var(--ui-text-muted); text-transform: uppercase; letter-spacing: 0.05em;">Clientes</div>
        <div style="font-size: 1.75rem; font-weight: 800; color: var(--ui-text); line-height: 1.2; margin-top: 0.25rem;">{{ stats?.totalCustomers || 0 }}</div>
        <div style="font-size: 0.7rem; color: var(--ui-text-muted); margin-top: 0.25rem;">
          {{ stats?.customersThisWeek || 0 }} esta semana · {{ stats?.customersThisMonth || 0 }} este mês
        </div>
      </UCard>

      <UCard>
        <div style="font-size: 0.7rem; color: var(--ui-text-muted); text-transform: uppercase; letter-spacing: 0.05em;">Avaliações</div>
        <div style="font-size: 1.75rem; font-weight: 800; color: var(--ui-text); line-height: 1.2; margin-top: 0.25rem;">{{ stats?.totalAssessments || 0 }}</div>
      </UCard>

      <UCard>
        <div style="font-size: 0.7rem; color: var(--ui-text-muted); text-transform: uppercase; letter-spacing: 0.05em;">Encontros</div>
        <div style="font-size: 1.75rem; font-weight: 800; color: var(--ui-text); line-height: 1.2; margin-top: 0.25rem;">{{ stats?.totalMeetings || 0 }}</div>
        <div style="font-size: 0.7rem; color: var(--ui-text-muted); margin-top: 0.25rem;">
          {{ stats?.scheduledMeetings || 0 }} agendados · {{ stats?.completedMeetings || 0 }} realizados
        </div>
      </UCard>
    </div>

    <!-- Financeiro -->
    <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 0.75rem; margin-top: 0.75rem;">
      <UCard>
        <div style="font-size: 0.7rem; color: var(--ui-text-muted); text-transform: uppercase; letter-spacing: 0.05em;">Pagamentos</div>
        <div style="font-size: 1.75rem; font-weight: 800; color: var(--ui-text); line-height: 1.2; margin-top: 0.25rem;">{{ stats?.totalPaid || 0 }}</div>
        <div style="font-size: 0.7rem; color: var(--ui-text-muted); margin-top: 0.25rem;">
          {{ conversionRate }}% de conversão
        </div>
      </UCard>

      <UCard>
        <div style="font-size: 0.7rem; color: var(--ui-text-muted); text-transform: uppercase; letter-spacing: 0.05em;">Receita</div>
        <div style="font-size: 1.75rem; font-weight: 800; color: var(--ui-color-success-500); line-height: 1.2; margin-top: 0.25rem;">{{ formatCurrency(stats?.grossRevenue || 0) }}</div>
      </UCard>

      <UCard>
        <div style="font-size: 0.7rem; color: var(--ui-text-muted); text-transform: uppercase; letter-spacing: 0.05em;">Ticket médio</div>
        <div style="font-size: 1.75rem; font-weight: 800; color: var(--ui-text); line-height: 1.2; margin-top: 0.25rem;">{{ formatCurrency(stats?.totalPaid ? Math.round((stats.grossRevenue || 0) / stats.totalPaid) : 0) }}</div>
      </UCard>
    </div>

    <!-- Status -->
    <UCard style="margin-top: 0.75rem;">
      <template #header>
        <span style="font-weight: 600; font-size: 0.875rem;">Clientes por status</span>
      </template>

      <div style="display: flex; flex-direction: column; gap: 0.375rem;">
        <div
          v-for="row in statusRows"
          :key="row.value"
          style="display: flex; align-items: center; justify-content: space-between; padding: 0.375rem 0;"
        >
          <div style="display: flex; align-items: center; gap: 0.75rem; flex: 1;">
            <UBadge :color="row.color" variant="subtle" size="xs" style="min-width: 5.5rem; justify-content: center;">{{ row.label }}</UBadge>
            <div style="flex: 1; height: 4px; background: var(--ui-bg-elevated); border-radius: 2px; overflow: hidden;">
              <div
                style="height: 100%; border-radius: 2px; transition: width 0.3s;"
                :style="{
                  width: `${stats?.totalCustomers ? (row.count / stats.totalCustomers) * 100 : 0}%`,
                  background: `var(--ui-color-${row.color}-500)`,
                }"
              />
            </div>
          </div>
          <span style="font-weight: 600; font-size: 0.85rem; min-width: 2rem; text-align: right; color: var(--ui-text);">{{ row.count }}</span>
        </div>
      </div>
    </UCard>
  </div>
</template>
