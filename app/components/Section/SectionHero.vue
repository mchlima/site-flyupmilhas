<script setup lang="ts">
import bgHero from '~/assets/img/bg-hero.webp'

const { scrollTo } = useScroll()

const visible = ref(false)
onMounted(() => {
  visible.value = true
})
</script>

<template>
  <section
    id="hero"
    class="min-h-screen relative overflow-hidden flex flex-col justify-center"
  >
    <!-- Background image — LCP element -->
    <img
      :src="bgHero"
      alt=""
      aria-hidden="true"
      fetchpriority="high"
      loading="eager"
      decoding="async"
      class="absolute inset-0 w-full h-full object-cover"
    />
    <!-- Dark overlay for text contrast -->
    <div class="absolute inset-0 gradient-hero opacity-90" />

    <div class="relative z-10 max-w-3xl mx-auto text-center px-6 py-12 md:py-24 flex flex-col justify-center min-h-screen">
      <h1
        class="text-3xl md:text-5xl font-bold tracking-tight text-white leading-tight mb-6 transition-all duration-700 ease-out"
        :class="visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'"
      >
        Aprenda a viajar de classe executiva pagando até 80% menos, mesmo começando do zero.
      </h1>

      <p
        class="text-lg md:text-xl text-white/80 mb-10 max-w-2xl mx-auto transition-all duration-700 ease-out delay-300"
        :class="visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'"
      >
        Um método simples e prático para transformar seus gastos do dia a dia em milhas e viajar mais, gastando menos.
      </p>

      <div
        class="flex justify-center transition-all duration-700 ease-out delay-500"
        :class="visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'"
      >
        <button
          class="bg-[var(--color-brand-cta)] hover:bg-[var(--color-brand-cta-hover)] text-white font-semibold px-8 py-4 rounded-lg text-lg cursor-pointer transition-colors"
          @click="scrollTo('formulario')"
        >
          Quero começar agora
        </button>
      </div>
      <p
        class="text-sm text-white/80 text-center mt-3 transition-all duration-700 ease-out delay-700"
        :class="visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'"
      >Comece a economizar já no primeiro mês</p>
    </div>
  </section>
</template>
