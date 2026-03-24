<script setup lang="ts">
const steps = [
  {
    icon: 'i-heroicons-clipboard-document-check',
    number: '01',
    title: 'Primeiro Encontro',
    description: 'Mapeamos seus cartões, programas de fidelidade e hábitos de consumo. A partir disso, montamos uma estratégia personalizada para você começar a acumular milhas de verdade — e enxergar oportunidades que estavam escondidas.',
  },
  {
    icon: 'i-heroicons-chart-bar',
    number: '02',
    title: 'Segundo Encontro',
    description: 'Revisamos seu progresso e aprofundamos a estratégia. Você já começa a ver resultados concretos e descobre novas formas de acelerar o acúmulo de milhas com os recursos que já tem.',
  },
  {
    icon: 'i-heroicons-arrow-path',
    number: '03',
    title: 'Terceiro Encontro',
    description: 'Analisamos os resultados alcançados e fazemos os ajustes finais. Você sai com um plano claro para emitir suas primeiras passagens com milhas e continuar evoluindo.',
  },
  {
    icon: 'i-heroicons-academic-cap',
    number: '04',
    title: 'Autonomia',
    description: 'Com o conhecimento adquirido, você passa a acumular e emitir milhas de forma independente — sabendo exatamente quando e como aproveitar as melhores oportunidades.',
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
      <p class="text-[var(--color-brand-text-muted)] text-center mb-8">
        Em 30 dias, você sai com uma estratégia pronta para economizar de verdade nas suas viagens.
      </p>

      <!-- Info bar: duration, meetings, support -->
      <div class="flex flex-wrap justify-center gap-6 md:gap-10 mb-12">
        <div class="text-center">
          <p class="text-lg font-bold text-[var(--color-brand-primary)]">30 dias</p>
          <p class="text-sm text-[var(--color-brand-text-muted)]">Duração</p>
        </div>
        <div class="text-center">
          <p class="text-lg font-bold text-[var(--color-brand-primary)]">3 encontros/mês</p>
          <p class="text-sm text-[var(--color-brand-text-muted)]">Dias a combinar</p>
        </div>
        <div class="text-center">
          <p class="text-lg font-bold text-[var(--color-brand-primary)]">Suporte via WhatsApp</p>
          <p class="text-sm text-[var(--color-brand-text-muted)]">Sim, incluso</p>
        </div>
      </div>

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
        Encontros online via Google Meet, com suporte contínuo via WhatsApp e material de apoio para aplicação imediata.
      </p>

    </div>
  </section>
</template>
