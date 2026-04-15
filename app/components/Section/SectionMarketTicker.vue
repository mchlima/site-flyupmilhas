<script setup lang="ts">
// Market quotes bar — shows live USD-BRL, EUR-BRL and IBOVESPA values.
// Data fetched fresh on every page open via SSR-friendly useFetch.
// No axios, no setInterval — per plan 260415-m3g.

interface FxEntry {
  bid: string
  pctChange: string
}

interface AwesomeApiResponse {
  USDBRL: FxEntry
  EURBRL: FxEntry
}

interface YahooChartMeta {
  regularMarketPrice: number
  chartPreviousClose: number
}

interface YahooChartResponse {
  chart: {
    result: Array<{ meta: YahooChartMeta }> | null
    error: unknown
  }
}

// Currencies (USD-BRL, EUR-BRL) — AwesomeAPI, no auth required.
const {
  data: fxData,
  pending: pendingFx,
  error: errorFx,
} = await useFetch<AwesomeApiResponse>(
  'https://economia.awesomeapi.com.br/json/last/USD-BRL,EUR-BRL',
  {
    key: 'market-fx',
    server: true,
    lazy: false,
    dedupe: 'defer',
    headers: { 'cache-control': 'no-store' },
    // Never let a rejected promise bubble up and break SSR.
    onResponseError() {
      /* handled via `error` ref */
    },
  },
)

// Bolsa (IBOVESPA) — Yahoo Finance chart endpoint, public, no auth.
// brapi.dev now requires a token (returns 401 MISSING_TOKEN); Yahoo remains free.
const {
  data: ibovData,
  pending: pendingIbov,
  error: errorIbov,
} = await useFetch<YahooChartResponse>(
  'https://query1.finance.yahoo.com/v8/finance/chart/%5EBVSP',
  {
    key: 'market-ibov',
    server: true,
    lazy: false,
    dedupe: 'defer',
    query: { interval: '1d' },
    headers: {
      'cache-control': 'no-store',
      // Yahoo blocks requests without a UA header from server-side fetchers.
      'user-agent': 'Mozilla/5.0 (compatible; FlyUpMilhas/1.0)',
    },
    onResponseError() {
      /* handled via `error` ref */
    },
  },
)

// --- Formatting helpers ---

const PLACEHOLDER = '—'

function formatBrl(value: number): string {
  return `R$ ${value.toLocaleString('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`
}

function formatPoints(value: number): string {
  return value.toLocaleString('pt-BR', { maximumFractionDigits: 0 })
}

function formatPct(value: number): string {
  const sign = value >= 0 ? '+' : '-'
  const abs = Math.abs(value).toLocaleString('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
  return `${sign}${abs}%`
}

function pctClass(value: number): string {
  return value >= 0 ? 'text-emerald-400' : 'text-rose-400'
}

function pctArrow(value: number): string {
  return value >= 0 ? '▲' : '▼'
}

// --- USD ---
const showUsd = computed(
  () => !pendingFx.value && !errorFx.value && !!fxData.value?.USDBRL?.bid,
)
const usd = computed(() => {
  const bid = Number(fxData.value?.USDBRL?.bid)
  return Number.isFinite(bid) ? formatBrl(bid) : PLACEHOLDER
})
const usdPct = computed(() => {
  const p = Number(fxData.value?.USDBRL?.pctChange)
  return Number.isFinite(p) ? p : 0
})
const usdPctLabel = computed(() =>
  showUsd.value ? formatPct(usdPct.value) : PLACEHOLDER,
)
const usdPctClass = computed(() =>
  showUsd.value ? pctClass(usdPct.value) : 'text-white/60',
)
const usdArrow = computed(() => (showUsd.value ? pctArrow(usdPct.value) : ''))

// --- EUR ---
const showEur = computed(
  () => !pendingFx.value && !errorFx.value && !!fxData.value?.EURBRL?.bid,
)
const eur = computed(() => {
  const bid = Number(fxData.value?.EURBRL?.bid)
  return Number.isFinite(bid) ? formatBrl(bid) : PLACEHOLDER
})
const eurPct = computed(() => {
  const p = Number(fxData.value?.EURBRL?.pctChange)
  return Number.isFinite(p) ? p : 0
})
const eurPctLabel = computed(() =>
  showEur.value ? formatPct(eurPct.value) : PLACEHOLDER,
)
const eurPctClass = computed(() =>
  showEur.value ? pctClass(eurPct.value) : 'text-white/60',
)
const eurArrow = computed(() => (showEur.value ? pctArrow(eurPct.value) : ''))

// --- IBOV ---
const ibovMeta = computed(() => ibovData.value?.chart?.result?.[0]?.meta)
const showIbov = computed(
  () =>
    !pendingIbov.value
    && !errorIbov.value
    && typeof ibovMeta.value?.regularMarketPrice === 'number',
)
const ibov = computed(() => {
  const price = ibovMeta.value?.regularMarketPrice
  return typeof price === 'number' && Number.isFinite(price)
    ? formatPoints(price)
    : PLACEHOLDER
})
const ibovPct = computed(() => {
  const price = ibovMeta.value?.regularMarketPrice
  const prev = ibovMeta.value?.chartPreviousClose
  if (
    typeof price !== 'number'
    || typeof prev !== 'number'
    || !Number.isFinite(price)
    || !Number.isFinite(prev)
    || prev === 0
  ) {
    return 0
  }
  return ((price - prev) / prev) * 100
})
const ibovPctLabel = computed(() =>
  showIbov.value ? formatPct(ibovPct.value) : PLACEHOLDER,
)
const ibovPctClass = computed(() =>
  showIbov.value ? pctClass(ibovPct.value) : 'text-white/60',
)
const ibovArrow = computed(() =>
  showIbov.value ? pctArrow(ibovPct.value) : '',
)
</script>

<template>
  <section
    aria-label="Cotações de mercado"
    class="text-white border-y border-white/10"
    :style="{ backgroundColor: 'var(--color-brand-primary)' }"
  >
    <div
      class="max-w-5xl mx-auto px-4 py-2.5 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs md:text-sm font-medium"
    >
      <!-- Dólar -->
      <div class="flex items-center gap-1.5">
        <span class="uppercase tracking-wider text-white/70">Dólar</span>
        <span
          v-if="pendingFx"
          class="inline-block w-16 h-4 bg-white/20 animate-pulse rounded"
          aria-hidden="true"
        />
        <template v-else>
          <span>{{ usd }}</span>
          <span :class="usdPctClass">{{ usdArrow }} {{ usdPctLabel }}</span>
        </template>
      </div>

      <!-- Euro -->
      <div class="flex items-center gap-1.5">
        <span class="uppercase tracking-wider text-white/70">Euro</span>
        <span
          v-if="pendingFx"
          class="inline-block w-16 h-4 bg-white/20 animate-pulse rounded"
          aria-hidden="true"
        />
        <template v-else>
          <span>{{ eur }}</span>
          <span :class="eurPctClass">{{ eurArrow }} {{ eurPctLabel }}</span>
        </template>
      </div>

      <!-- Bolsa -->
      <div class="flex items-center gap-1.5">
        <span class="uppercase tracking-wider text-white/70">Bolsa</span>
        <span
          v-if="pendingIbov"
          class="inline-block w-20 h-4 bg-white/20 animate-pulse rounded"
          aria-hidden="true"
        />
        <template v-else>
          <span>{{ ibov }}<span v-if="showIbov" class="text-white/70 ml-1">pts</span></span>
          <span :class="ibovPctClass">{{ ibovArrow }} {{ ibovPctLabel }}</span>
        </template>
      </div>
    </div>
  </section>
</template>
