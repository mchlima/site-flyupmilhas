<script setup lang="ts">
import youngProfessionalImg from '~/assets/img/young-professional-planning.png'
import familyPlanningImg from '~/assets/img/bazillian-family-planning.png'

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

      <div class="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 max-w-5xl mx-auto">
        <!-- LEFT column: info cards -->
        <div class="flex flex-col gap-4">
          <div
            v-for="card in cards"
            :key="card.text"
            class="rounded-xl bg-white shadow-sm border border-gray-100 p-6 flex items-start gap-4"
          >
            <UIcon :name="card.icon" class="w-8 h-8 text-[var(--color-brand-cta)] shrink-0" />
            <p class="text-[var(--color-brand-text)] leading-relaxed">{{ card.text }}</p>
          </div>
        </div>

        <!-- RIGHT column: lifestyle images -->
        <div class="flex flex-col gap-6 items-center justify-center">
          <img
            :src="youngProfessionalImg"
            alt="Jovem profissional planejando viagens com milhas"
            class="rounded-2xl shadow-md w-full object-cover"
          />
          <img
            :src="familyPlanningImg"
            alt="Familia brasileira planejando viagem juntos"
            class="rounded-2xl shadow-md w-full object-cover"
          />
        </div>
      </div>

    </div>
  </section>
</template>
