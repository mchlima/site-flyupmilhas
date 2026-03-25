<script setup lang="ts">
import bgHero from '~/assets/img/bg-hero.png'

const { scrollTo } = useScroll()
</script>

<template>
  <section
    id="hero"
    class="min-h-screen relative overflow-hidden flex flex-col justify-center"
  >
    <!-- Background image -->
    <div
      class="absolute inset-0 bg-cover bg-center bg-no-repeat"
      :style="{ backgroundImage: `url(${bgHero})` }"
    />
    <!-- Dark overlay for text contrast -->
    <div class="absolute inset-0 gradient-hero opacity-90" />

    <div class="relative z-10 max-w-3xl mx-auto text-center px-6 py-12 md:py-24 flex flex-col justify-center min-h-screen">
      <h1
        class="text-3xl md:text-5xl font-bold tracking-tight text-white leading-tight mb-6"
      >
        Aprenda a viajar de classe executiva pagando até 80% menos, mesmo começando do zero.
      </h1>

      <p
        class="text-lg md:text-xl text-white/80 mb-10 max-w-2xl mx-auto"
      >
        Um método simples e prático para transformar seus gastos do dia a dia em milhas e viajar mais, gastando menos.
      </p>

      <div class="flex justify-center">
        <button
          class="bg-[var(--color-brand-cta)] hover:bg-[var(--color-brand-cta-hover)] text-white font-semibold px-8 py-4 rounded-lg text-lg cursor-pointer transition-colors"
          @click="scrollTo('formulario')"
        >
          Quero começar agora
        </button>
      </div>
      <p class="text-sm text-white/60 text-center mt-3">Comece a economizar já no primeiro mês</p>
    </div>
  </section>
</template>
