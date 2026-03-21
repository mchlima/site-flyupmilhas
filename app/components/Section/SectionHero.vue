<script setup lang="ts">
const { scrollTo } = useScroll()
</script>

<template>
  <section
    id="hero"
    class="min-h-screen bg-[var(--color-brand-bg)] flex flex-col justify-center"
  >
    <div class="max-w-3xl mx-auto text-center px-6 py-12 md:py-24 flex flex-col justify-center min-h-screen">
      <h1
        class="text-3xl md:text-5xl font-bold text-[var(--color-brand-primary)] leading-tight mb-6"
      >
        Sua próxima viagem de classe executiva custa menos que um jantar fora.
      </h1>

      <p
        class="text-lg md:text-xl text-[var(--color-brand-text-muted)] mb-10 max-w-2xl mx-auto"
      >
        Em 1 hora de consultoria personalizada, montamos sua estratégia completa de milhas — do diagnóstico à emissão da passagem.
      </p>

      <div class="flex justify-center">
        <button
          class="bg-[var(--color-brand-cta)] hover:bg-[var(--color-brand-cta-hover)] text-white font-semibold px-8 py-4 rounded-lg text-lg cursor-pointer transition-colors"
          @click="scrollTo('formulario')"
        >
          Quero minha Consultoria
        </button>
      </div>
    </div>
  </section>
</template>
