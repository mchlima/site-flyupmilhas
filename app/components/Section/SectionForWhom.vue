<script setup lang="ts">
import familyAirportImg from '~/assets/img/brazilian-family-walking-airport.webp'

const { scrollTo } = useScroll()

const cards = [
  { text: 'Pessoas que querem viajar mais gastando menos', icon: 'i-heroicons-paper-airplane' },
  { text: 'Quem está começando do zero em milhas', icon: 'i-heroicons-rocket-launch' },
  { text: 'Quem já tem pontos, mas não sabe usar bem', icon: 'i-heroicons-puzzle-piece' },
  { text: 'Quem quer aprender sem depender de dicas soltas', icon: 'i-heroicons-academic-cap' },
  { text: 'Quem busca clareza, segurança e estratégia', icon: 'i-heroicons-shield-check' },
]

const negativeCards = [
  { text: 'Não é pra quem quer dinheiro fácil', icon: 'i-heroicons-x-mark' },
  { text: 'Não é pra quem não usa cartão', icon: 'i-heroicons-x-mark' },
  { text: 'Não é pra quem não vai aplicar', icon: 'i-heroicons-x-mark' },
]
</script>

<template>
  <section id="para-quem-e" class="relative bg-white py-12 md:py-24 px-6 overflow-hidden">
    <!-- Background image -->
    <div
      class="absolute inset-0 bg-cover bg-center"
      :style="{ backgroundImage: `url(${familyAirportImg})` }"
    />
    <div class="absolute inset-0 bg-white/90" />

    <div class="relative max-w-5xl mx-auto">
      <h2 class="text-2xl md:text-3xl font-semibold tracking-[-0.015em] text-brand-primary text-center mb-10">
        Para quem é essa mentoria?
      </h2>

      <!-- Positive cards — grid with icon circles -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-12">
        <div
          v-for="card in cards"
          :key="card.text"
          class="rounded-xl bg-white shadow-sm border border-gray-100 p-5 flex items-center gap-4 transition-all duration-300 ease-in-out hover:scale-[1.02] hover:shadow-lg"
        >
          <div class="w-10 h-10 rounded-full bg-brand-primary/10 flex items-center justify-center shrink-0">
            <UIcon :name="card.icon" class="w-5 h-5 text-brand-primary" />
          </div>
          <p class="text-brand-text leading-relaxed text-sm md:text-base">{{ card.text }}</p>
        </div>
      </div>

      <!-- Separator: negative qualification -->
      <div class="mb-6 text-center">
        <p class="text-lg font-semibold text-brand-primary">
          Essa mentoria não é para todos
        </p>
      </div>

      <!-- Negative qualification cards -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
        <div
          v-for="card in negativeCards"
          :key="card.text"
          class="rounded-xl bg-slate-50 border border-slate-200 p-5 flex items-center gap-4 transition-all duration-300 ease-in-out hover:scale-[1.02] hover:shadow-lg"
        >
          <UIcon :name="card.icon" class="w-7 h-7 text-brand-text-muted shrink-0" />
          <p class="text-brand-text leading-relaxed text-sm md:text-base">{{ card.text }}</p>
        </div>
      </div>

      <!-- CTA -->
      <div class="text-center">
        <button
          class="bg-brand-cta hover:bg-brand-cta-hover text-white font-semibold px-8 py-4 rounded-lg text-lg cursor-pointer transition-colors"
          @click="scrollTo('formulario')"
        >
          Quero dar o primeiro passo
        </button>
      </div>

    </div>
  </section>
</template>
