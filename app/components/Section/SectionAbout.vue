<script setup lang="ts">
const { scrollTo } = useScroll()
</script>

<template>
  <section id="sobre" class="gradient-section-about py-12 md:py-24 px-6">
    <div class="max-w-5xl mx-auto">
      <h2 class="text-2xl md:text-3xl font-semibold tracking-[-0.015em] text-[var(--color-brand-primary)] text-center mb-4">
        Viaje mais. Gaste menos. Use milhas do jeito certo.
      </h2>

      <div class="relative bg-brand-dark rounded-xl p-6 md:p-8 w-full my-10 overflow-hidden">
        <img src="~/assets/img/logo-fly-up-milhas.png" alt="" aria-hidden="true" class="absolute right-4 top-1/2 -translate-y-1/2 w-48 md:w-64 opacity-5 pointer-events-none" />
        <p class="relative text-white/90 text-center text-base md:text-lg leading-relaxed">
          A maioria das pessoas acumula milhas, mas não sabe como usar e acaba pagando caro em passagens. Na Fly Up Milhas, você aprende de forma simples, como transformar seus gastos do dia a dia em viagens reais, pagando muito menos.
        </p>
      </div>

      <!-- 3 equal cards -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">

        <!-- Card 1: Conforto -->
        <div class="rounded-xl bg-white shadow-sm border border-gray-100 p-6">
          <UIcon name="i-heroicons-paper-airplane" class="w-8 h-8 text-[var(--color-brand-primary)] mb-3" />
          <h3 class="text-base font-medium text-[var(--color-brand-primary)] mb-2">Viaje com mais conforto pagando menos</h3>
          <p class="text-sm text-[var(--color-brand-text-muted)] leading-relaxed">
            Voe de classe executiva para Europa, Ásia e Américas pagando apenas uma fração do valor original.
          </p>
        </div>

        <!-- Card 2: Economia -->
        <div class="rounded-xl bg-white shadow-sm border border-gray-100 p-6">
          <UIcon name="i-heroicons-banknotes" class="w-8 h-8 text-[var(--color-brand-primary)] mb-3" />
          <h3 class="text-base font-medium text-[var(--color-brand-primary)] mb-2">Economize nas viagens do dia a dia</h3>
          <p class="text-sm text-[var(--color-brand-text-muted)] leading-relaxed">
            Transforme seus gastos comuns em milhas e reduza drasticamente o custo das suas passagens.
          </p>
        </div>

        <!-- Card 3: Estratégia -->
        <div class="rounded-xl bg-white shadow-sm border border-gray-100 p-6">
          <UIcon name="i-heroicons-light-bulb" class="w-8 h-8 text-[var(--color-brand-primary)] mb-3" />
          <h3 class="text-base font-medium text-[var(--color-brand-primary)] mb-2">Use suas milhas com estratégia</h3>
          <p class="text-sm text-[var(--color-brand-text-muted)] leading-relaxed">
            Aprenda a acumular, organizar e usar seus pontos da forma certa para nunca mais perder oportunidades.
          </p>
        </div>

      </div>

      <!-- CTA below cards -->
      <div class="text-center mt-8">
        <button
          class="bg-[var(--color-brand-cta)] hover:bg-[var(--color-brand-cta-hover)] text-white font-semibold px-8 py-4 rounded-lg text-lg cursor-pointer transition-colors"
          @click="scrollTo('formulario')"
        >
          Quero dar o primeiro passo
        </button>
      </div>
    </div>
  </section>
</template>
