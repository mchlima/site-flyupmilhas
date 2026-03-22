<script setup lang="ts">
const cards = [
  { text: 'Pessoas que querem viajar mais gastando menos', icon: 'i-heroicons-paper-airplane' },
  { text: 'Quem está começando do zero em milhas', icon: 'i-heroicons-rocket-launch' },
  { text: 'Quem já tem pontos, mas não sabe usar bem', icon: 'i-heroicons-puzzle-piece' },
  { text: 'Quem quer aprender sem depender de dicas soltas', icon: 'i-heroicons-academic-cap' },
  { text: 'Quem busca clareza, segurança e estratégia', icon: 'i-heroicons-shield-check' },
]
</script>

<template>
  <section id="para-quem-e" class="bg-white py-12 md:py-24 px-6">
    <div class="max-w-5xl mx-auto">
      <h2 class="text-2xl md:text-3xl font-bold text-[var(--color-brand-primary)] text-center mb-10">
        Para quem é essa mentoria?
      </h2>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 max-w-4xl mx-auto">
        <div
          v-for="(card, index) in cards"
          :key="card.text"
          class="rounded-xl bg-white shadow-sm border border-gray-100 p-6 flex items-start gap-4"
          :class="index === 4 ? 'md:col-span-2 md:max-w-sm md:mx-auto' : ''"
        >
          <UIcon :name="card.icon" class="w-8 h-8 text-[var(--color-brand-cta)] shrink-0" />
          <p class="text-[var(--color-brand-text)] leading-relaxed">{{ card.text }}</p>
        </div>
      </div>

    </div>
  </section>
</template>
