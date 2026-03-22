<script setup lang="ts">
const { scrollTo } = useScroll()

const benefits = [
  '3 encontros durante o período da mentoria (início, meio e fim)',
  'Suporte para dúvidas via WhatsApp',
  'Material de apoio',
  'Aplicação imediata',
  'Plano personalizado',
]
</script>

<template>
  <section
    id="preco"
    class="bg-[var(--color-brand-primary)] py-12 md:py-24 px-6"
  >
    <div class="max-w-3xl mx-auto text-center">
      <!-- Pre-heading -->
      <p class="text-[var(--color-brand-cta)] text-sm font-semibold uppercase tracking-widest mb-4">
        Comece sua jornada
      </p>

      <!-- Benefits list with check icons -->
      <div class="max-w-md mx-auto text-left space-y-4 mb-10">
        <div v-for="benefit in benefits" :key="benefit" class="flex items-start gap-3">
          <UIcon name="i-heroicons-check-circle" class="w-6 h-6 text-[var(--color-brand-cta)] shrink-0 mt-0.5" />
          <span class="text-white/90 text-base">{{ benefit }}</span>
        </div>
      </div>

      <!-- Note below benefits -->
      <p class="text-white/60 text-sm mb-8">Condições especiais disponíveis</p>

      <!-- CTA Button -->
      <button
        class="bg-[var(--color-brand-cta)] hover:bg-[var(--color-brand-cta-hover)] text-white font-semibold px-10 py-4 rounded-lg text-lg cursor-pointer transition-colors"
        @click="scrollTo('formulario')"
      >
        Quero dar o primeiro passo
      </button>
    </div>
  </section>
</template>
