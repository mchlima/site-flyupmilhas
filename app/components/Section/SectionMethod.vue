<script setup lang="ts">
const steps = [
  {
    icon: 'i-heroicons-clipboard-document-check',
    number: '01',
    title: 'Primeiro Encontro',
    description: 'Diagnostico completo dos seus cartoes, programas e gastos. Inicio da sua estrategia personalizada de milhas.',
  },
  {
    icon: 'i-heroicons-chart-bar',
    number: '02',
    title: 'Segundo Encontro',
    description: 'Aprofundamento da estrategia com acompanhamento do seu progresso. Ajustes e novas oportunidades.',
  },
  {
    icon: 'i-heroicons-arrow-path',
    number: '03',
    title: 'Terceiro Encontro',
    description: 'Revisao dos resultados alcancados e ajustes finais para maximizar seus ganhos com milhas.',
  },
  {
    icon: 'i-heroicons-academic-cap',
    number: '04',
    title: 'Autonomia',
    description: 'Voce se beneficia do que aprendeu, com conhecimento para acumular e emitir milhas sozinho.',
  },
]
</script>

<template>
  <section id="como-funciona" class="bg-[var(--color-brand-bg)] py-12 md:py-24 px-6">
    <div class="max-w-5xl mx-auto">
      <!-- Section heading -->
      <h2 class="text-2xl md:text-3xl font-bold text-[var(--color-brand-primary)] text-center mb-4">
        Como Funciona
      </h2>
      <p class="text-[var(--color-brand-text-muted)] text-center mb-12">
        Sua jornada na mentoria Fly Up Milhas
      </p>

      <!-- Steps bento grid: 1 col mobile, 2 col tablet, 4 col desktop -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <div
          v-for="step in steps"
          :key="step.number"
          class="rounded-xl p-6"
          :class="step.number === '04'
            ? 'bg-[var(--color-brand-primary)] text-white'
            : 'bg-white shadow-sm'"
        >
          <span
            class="text-4xl font-bold opacity-30 block mb-2"
            :class="step.number === '04' ? 'text-white' : 'text-[var(--color-brand-cta)]'"
          >{{ step.number }}</span>
          <UIcon
            :name="step.icon"
            class="w-10 h-10 mb-3"
            :class="step.number === '04' ? 'text-white/70' : 'text-[var(--color-brand-primary)]'"
          />
          <h3
            class="text-lg font-semibold mb-2"
            :class="step.number === '04' ? 'text-white' : 'text-[var(--color-brand-primary)]'"
          >{{ step.title }}</h3>
          <p
            class="text-sm leading-relaxed"
            :class="step.number === '04' ? 'text-white/80' : 'text-[var(--color-brand-text-muted)]'"
          >{{ step.description }}</p>
        </div>
      </div>

      <p class="text-center text-sm text-[var(--color-brand-text-muted)] mt-8 max-w-2xl mx-auto">
        Encontros quinzenais online via Google Meet, com suporte para duvidas via WhatsApp e material de apoio para aplicacao imediata.
      </p>

    </div>
  </section>
</template>
