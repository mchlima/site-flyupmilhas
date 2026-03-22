<script setup lang="ts">
const config = useRuntimeConfig()
// r2BaseUrl comes from NUXT_PUBLIC_R2_BASE_URL env var (e.g., https://cdn.flyupmilhas.com.br)
const r2Base = config.public.r2BaseUrl
</script>

<template>
  <section class="min-h-screen flex flex-col items-center justify-center bg-[var(--color-brand-bg)] px-6">
    <!-- Test image: validates the R2 pipeline (per INFR-02, D-06, D-07) -->
    <!-- fetchpriority="high" + loading="eager" required for LCP element (per INFR-04) -->
    <NuxtImg
      :src="`${r2Base}/test-placeholder.webp`"
      width="1200"
      height="675"
      alt="Fly Up Milhas — imagem de teste do pipeline R2"
      loading="eager"
      fetchpriority="high"
      class="w-full max-w-3xl rounded-lg shadow mb-8"
    />

    <div class="text-center">
      <h1 class="text-2xl font-bold text-[var(--color-brand-primary)] mb-2">
        Fly Up Milhas
      </h1>
      <p class="text-[var(--color-brand-text-muted)]">
        Em breve — mentoria em milhas aéreas
      </p>
    </div>
  </section>
</template>
