<script setup lang="ts">
// Market quotes bar — shows live USD-BRL, EUR-BRL and IBOVESPA values.
// Data fetched fresh on every page open via SSR-friendly useFetch.
//
// All three quotes come from Yahoo Finance's public chart endpoint:
//   - AwesomeAPI hit 429/QuotaExceeded on Vercel's shared egress IPs
//   - brapi.dev now requires a registered token (returns 401 MISSING_TOKEN)
//   - Yahoo Finance remains free, no auth, and handles all three symbols
// No axios, no setInterval — per plan 260415-m3g.

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

function useYahooQuote(key: string, symbol: string) {
  return useFetch<YahooChartResponse>(
    `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(symbol)}`,
    {
      key,
      server: true,
      lazy: false,
      dedupe: 'defer',
      query: { interval: '1d' },
      headers: {
        'cache-control': 'no-store',
        // Yahoo blocks requests without a UA header from server-side fetchers.
        'user-agent': 'Mozilla/5.0 (compatible; FlyUpMilhas/1.0)',
      },
      // Never let a rejected promise bubble up and break SSR.
      onResponseError() {
        /* handled via `error` ref */
      },
    },
  )
}

const { data: usdData, pending: pendingUsd, error: errorUsd } = await useYahooQuote('market-usd', 'USDBRL=X')
const { data: eurData, pending: pendingEur, error: errorEur } = await useYahooQuote('market-eur', 'EURBRL=X')
const { data: ibovData, pending: pendingIbov, error: errorIbov } = await useYahooQuote('market-ibov', '^BVSP')

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
  return value >= 0 ? 'text-emerald-300' : 'text-rose-300'
}

function pctArrow(value: number): string {
  return value >= 0 ? '▲' : '▼'
}

type QuoteRef = Ref<YahooChartResponse | null>

function quotePresentation(
  data: QuoteRef,
  pending: Ref<boolean>,
  error: Ref<unknown>,
  format: (value: number) => string,
) {
  const meta = computed(() => data.value?.chart?.result?.[0]?.meta)
  const price = computed(() => meta.value?.regularMarketPrice)
  const prev = computed(() => meta.value?.chartPreviousClose)

  const ok = computed(
    () =>
      !pending.value
      && !error.value
      && typeof price.value === 'number'
      && Number.isFinite(price.value),
  )

  const value = computed(() =>
    ok.value && typeof price.value === 'number' ? format(price.value) : PLACEHOLDER,
  )

  const pct = computed(() => {
    const p = price.value
    const c = prev.value
    if (
      typeof p !== 'number'
      || typeof c !== 'number'
      || !Number.isFinite(p)
      || !Number.isFinite(c)
      || c === 0
    ) {
      return 0
    }
    return ((p - c) / c) * 100
  })
  const pctLabel = computed(() => (ok.value ? formatPct(pct.value) : PLACEHOLDER))
  const pctColor = computed(() => (ok.value ? pctClass(pct.value) : 'text-white/80'))
  const arrow = computed(() => (ok.value ? pctArrow(pct.value) : ''))

  return { ok, value, pctLabel, pctColor, arrow }
}

const {
  value: usdValue,
  pctLabel: usdPctLabel,
  pctColor: usdPctColor,
  arrow: usdArrow,
} = quotePresentation(usdData, pendingUsd, errorUsd, formatBrl)

const {
  value: eurValue,
  pctLabel: eurPctLabel,
  pctColor: eurPctColor,
  arrow: eurArrow,
} = quotePresentation(eurData, pendingEur, errorEur, formatBrl)

const {
  ok: ibovOk,
  value: ibovValue,
  pctLabel: ibovPctLabel,
  pctColor: ibovPctColor,
  arrow: ibovArrow,
} = quotePresentation(ibovData, pendingIbov, errorIbov, formatPoints)
</script>

<template>
  <section
    aria-label="Cotações de mercado"
    class="text-white border-y border-white/10 overflow-hidden md:overflow-visible"
    :style="{ backgroundColor: 'var(--color-brand-primary)' }"
  >
    <div class="py-2.5 md:max-w-5xl md:mx-auto md:px-4">
      <div
        class="marquee-track flex items-center whitespace-nowrap text-xs md:text-sm font-semibold md:flex-wrap md:justify-center md:gap-x-6 md:gap-y-2"
      >
        <!-- First copy: visible always -->
        <div class="flex shrink-0 items-center gap-x-6 pl-6 md:contents">
          <!-- Dólar -->
          <div class="flex items-center gap-1.5">
            <span class="uppercase tracking-wider text-white/90">Dólar</span>
            <span
              v-if="pendingUsd"
              class="inline-block w-16 h-4 bg-white/20 animate-pulse rounded"
              aria-hidden="true"
            />
            <template v-else>
              <span>{{ usdValue }}</span>
              <span :class="usdPctColor">{{ usdArrow }} {{ usdPctLabel }}</span>
            </template>
          </div>

          <!-- Euro -->
          <div class="flex items-center gap-1.5">
            <span class="uppercase tracking-wider text-white/90">Euro</span>
            <span
              v-if="pendingEur"
              class="inline-block w-16 h-4 bg-white/20 animate-pulse rounded"
              aria-hidden="true"
            />
            <template v-else>
              <span>{{ eurValue }}</span>
              <span :class="eurPctColor">{{ eurArrow }} {{ eurPctLabel }}</span>
            </template>
          </div>

          <!-- Ibov -->
          <div class="flex items-center gap-1.5">
            <span class="uppercase tracking-wider text-white/90">Ibov</span>
            <span
              v-if="pendingIbov"
              class="inline-block w-20 h-4 bg-white/20 animate-pulse rounded"
              aria-hidden="true"
            />
            <template v-else>
              <span>{{ ibovValue }}<span v-if="ibovOk" class="text-white/90 ml-1">pts</span></span>
              <span :class="ibovPctColor">{{ ibovArrow }} {{ ibovPctLabel }}</span>
            </template>
          </div>
        </div>

        <!-- Second copy: seamless marquee loop on mobile; hidden on md+
             Must be structurally identical to first copy so -50% translate
             lands exactly at its start (seamless loop math). -->
        <div
          class="flex shrink-0 items-center gap-x-6 pl-6 md:hidden"
          aria-hidden="true"
        >
          <div class="flex items-center gap-1.5">
            <span class="uppercase tracking-wider text-white/90">Dólar</span>
            <span
              v-if="pendingUsd"
              class="inline-block w-16 h-4 bg-white/20 animate-pulse rounded"
            />
            <template v-else>
              <span>{{ usdValue }}</span>
              <span :class="usdPctColor">{{ usdArrow }} {{ usdPctLabel }}</span>
            </template>
          </div>
          <div class="flex items-center gap-1.5">
            <span class="uppercase tracking-wider text-white/90">Euro</span>
            <span
              v-if="pendingEur"
              class="inline-block w-16 h-4 bg-white/20 animate-pulse rounded"
            />
            <template v-else>
              <span>{{ eurValue }}</span>
              <span :class="eurPctColor">{{ eurArrow }} {{ eurPctLabel }}</span>
            </template>
          </div>
          <div class="flex items-center gap-1.5">
            <span class="uppercase tracking-wider text-white/90">Ibov</span>
            <span
              v-if="pendingIbov"
              class="inline-block w-20 h-4 bg-white/20 animate-pulse rounded"
            />
            <template v-else>
              <span>{{ ibovValue }}<span v-if="ibovOk" class="text-white/90 ml-1">pts</span></span>
              <span :class="ibovPctColor">{{ ibovArrow }} {{ ibovPctLabel }}</span>
            </template>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
@keyframes marquee {
  from {
    transform: translateX(0);
  }
  to {
    transform: translateX(-50%);
  }
}

.marquee-track {
  width: max-content;
  animation: marquee 28s linear infinite;
}

@media (min-width: 768px) {
  .marquee-track {
    width: auto;
    animation: none;
  }
}

@media (prefers-reduced-motion: reduce) {
  .marquee-track {
    animation: none;
  }
}
</style>
