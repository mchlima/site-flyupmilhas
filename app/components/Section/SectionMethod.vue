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

      <!-- Steps grid (D-14): 4 columns on desktop, 1 column on mobile -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-8 mb-16">
        <div
          v-for="step in steps"
          :key="step.number"
          class="text-center"
        >
          <span class="text-4xl font-bold text-[var(--color-brand-cta)] opacity-30 block mb-2">
            {{ step.number }}
          </span>
          <UIcon
            :name="step.icon"
            class="w-10 h-10 text-[var(--color-brand-primary)] mx-auto mb-3"
          />
          <h3 class="text-lg font-semibold text-[var(--color-brand-primary)] mb-2">
            {{ step.title }}
          </h3>
          <p class="text-sm text-[var(--color-brand-text-muted)] leading-relaxed">
            {{ step.description }}
          </p>
        </div>
      </div>

      <!-- Offer block (D-15): visually distinct card -->
      <div class="bg-white rounded-2xl shadow p-8 text-center max-w-2xl mx-auto">
        <h3 class="text-xl font-bold text-[var(--color-brand-primary)] mb-4">
          O que está incluído
        </h3>
        <ul class="text-left inline-block">
          <li class="flex items-center gap-2 text-[var(--color-brand-text)] mb-2">
            <UIcon name="i-heroicons-check-circle" class="w-5 h-5 text-[var(--color-brand-cta)] flex-shrink-0" />
            <span>R$200 — pagamento único, sem mensalidade</span>
          </li>
          <li class="flex items-center gap-2 text-[var(--color-brand-text)] mb-2">
            <UIcon name="i-heroicons-check-circle" class="w-5 h-5 text-[var(--color-brand-cta)] flex-shrink-0" />
            <span>2 reuniões online (diagnóstico + revisão)</span>
          </li>
          <li class="flex items-center gap-2 text-[var(--color-brand-text)] mb-2">
            <UIcon name="i-heroicons-check-circle" class="w-5 h-5 text-[var(--color-brand-cta)] flex-shrink-0" />
            <span>1 mês de acompanhamento via WhatsApp</span>
          </li>
        </ul>
        <p class="text-sm text-[var(--color-brand-text-muted)] mt-4">
          Entregáveis: plano de milhas personalizado, lista de cartões recomendados e suporte na primeira emissão.
        </p>
      </div>
    </div>
  </section>
</template>
