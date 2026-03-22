<script setup lang="ts">
const { scrollTo } = useScroll()
</script>

<template>
  <section
    id="hero"
    class="min-h-screen bg-[var(--color-brand-bg)] flex flex-col justify-center"
  >
    <div class="max-w-3xl mx-auto text-center px-6 py-12 md:py-24 flex flex-col justify-center min-h-screen">
      <!-- Pain point chips -->
      <div class="flex flex-wrap justify-center gap-2 mb-6">
        <span class="text-xs md:text-sm px-3 py-1 rounded-full border border-[var(--color-brand-primary)]/30 text-[var(--color-brand-text-muted)]">Viajar de avião é caro</span>
        <span class="text-xs md:text-sm px-3 py-1 rounded-full border border-[var(--color-brand-primary)]/30 text-[var(--color-brand-text-muted)]">Milhas é só para quem tem cartão black</span>
        <span class="text-xs md:text-sm px-3 py-1 rounded-full border border-[var(--color-brand-primary)]/30 text-[var(--color-brand-text-muted)]">Não sei por onde começar</span>
      </div>

      <h1
        class="text-3xl md:text-5xl font-bold text-[var(--color-brand-primary)] leading-tight mb-6"
      >
        Sua próxima viagem de classe executiva custa menos que um jantar fora.
      </h1>

      <p
        class="text-lg md:text-xl text-[var(--color-brand-text-muted)] mb-10 max-w-2xl mx-auto"
      >
        Na mentoria Fly Up Milhas, você aprende a acumular e usar milhas com estratégia — do diagnóstico ao seu primeiro voo executivo.
      </p>

      <div class="flex justify-center">
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
