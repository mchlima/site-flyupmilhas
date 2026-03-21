<script setup lang="ts">
// TODO: replace with real testimonials from Marcio
const testimonials = [
  {
    name: 'Ana Paula',
    city: 'São Paulo, SP',
    text: 'Com a consultoria do Márcio, consegui emitir dois bilhetes executivos para Lisboa por apenas 58.000 milhas cada. Pagaria mais de R$12.000 comprando direto. Valeu cada centavo da consultoria.',
    metric: 'R$12.000 economizados',
    route: 'GRU → LIS, classe executiva',
  },
  {
    name: 'Carlos Eduardo',
    city: 'Curitiba, PR',
    text: 'Não sabia nem que tinha milhas suficientes. O Márcio fez o diagnóstico e em 3 semanas já tinha as passagens emitidas para Miami em business class. Processo todo simples e sem estresse.',
    metric: 'R$8.500 economizados',
    route: 'CWB → MIA, classe executiva',
  },
]
</script>

<template>
  <section id="depoimentos" class="bg-white py-12 md:py-24 px-6">
    <div class="max-w-5xl mx-auto">
      <!-- Section heading -->
      <h2 class="text-2xl md:text-3xl font-bold text-[var(--color-brand-primary)] text-center mb-4">
        Resultados Reais
      </h2>
      <p class="text-[var(--color-brand-text-muted)] text-center mb-12">
        O que nossos clientes conseguiram
      </p>

      <!-- Testimonial cards grid (D-16, D-17, D-19) -->
      <!-- TODO: replace with real testimonials from Marcio -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div
          v-for="t in testimonials"
          :key="t.name"
          class="bg-[var(--color-brand-bg)] rounded-2xl shadow-sm p-8"
        >
          <p class="text-[var(--color-brand-text)] leading-relaxed mb-6 italic">
            "{{ t.text }}"
          </p>
          <div class="border-t border-gray-100 pt-4">
            <p class="font-semibold text-[var(--color-brand-primary)]">{{ t.name }}</p>
            <p class="text-sm text-[var(--color-brand-text-muted)]">{{ t.city }}</p>
            <p class="text-sm font-medium text-[var(--color-brand-cta)] mt-1">{{ t.metric }}</p>
            <p class="text-xs text-[var(--color-brand-text-muted)]">{{ t.route }}</p>
          </div>
        </div>
      </div>

    </div>
  </section>
</template>
