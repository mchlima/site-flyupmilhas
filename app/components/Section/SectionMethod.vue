<script setup lang="ts">
const steps = [
  {
    icon: 'i-heroicons-magnifying-glass',
    number: '01',
    title: 'Diagnóstico',
    description: 'Analisamos seus cartões, gastos mensais e programas de fidelidade para identificar onde você está deixando milhas na mesa.',
  },
  {
    icon: 'i-heroicons-light-bulb',
    number: '02',
    title: 'Estratégia',
    description: 'Montamos um plano personalizado: quais cartões usar, como transferir pontos e qual programa de milhas faz mais sentido para o seu perfil.',
  },
  {
    icon: 'i-heroicons-rocket-launch',
    number: '03',
    title: 'Execução',
    description: 'Você executa o plano com acompanhamento: dúvidas respondidas via WhatsApp e uma reunião de revisão ao final do primeiro mês.',
  },
  {
    icon: 'i-heroicons-paper-airplane',
    number: '04',
    title: 'Voo',
    description: 'Chegamos juntos ao momento da emissão. Selecionamos a disponibilidade, escolhemos a cabine e você embarca na executiva.',
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
        4 passos para voar em executiva
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

    </div>
  </section>
</template>
