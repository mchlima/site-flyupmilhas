<script setup lang="ts">
const config = useRuntimeConfig()
const r2Base = config.public.r2BaseUrl
const { scrollTo } = useScroll()
</script>

<template>
  <section
    id="especialista"
    class="bg-white py-12 md:py-24 px-6"
  >
    <div class="max-w-5xl mx-auto">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <!-- Photo column (left on desktop) -->
        <div>
          <!-- TODO: replace with real photo from Marcio -->
          <NuxtImg
            :src="`${r2Base}/marcio-placeholder.webp`"
            width="400"
            height="400"
            alt="Marcio — especialista em milhas aéreas da Fly Up Milhas"
            class="rounded-2xl shadow-lg w-full max-w-sm mx-auto"
          />
        </div>

        <!-- Content column (right on desktop) -->
        <div>
          <h2 class="text-2xl md:text-3xl font-bold text-[var(--color-brand-primary)] mb-4">
            Quem é o Márcio
          </h2>

          <!-- TODO: replace with bio from Marcio -->
          <p class="text-[var(--color-brand-text)] leading-relaxed mb-6">
            Ajudo profissionais e famílias a voar em classe executiva gastando uma fração do preço de tabela. Nos últimos anos, montei estratégias de milhas que geraram economia real para meus clientes — passagens executivas para Europa, Ásia e Américas emitidas por menos do que muitos pagam em passagens econômicas.
          </p>

          <!-- 3-metric stats row -->
          <!-- TODO: replace placeholders with real numbers from Marcio -->
          <div class="flex gap-8 my-6">
            <div class="text-center">
              <span class="text-3xl font-bold text-[var(--color-brand-cta)]">5M+</span>
              <p class="text-sm text-[var(--color-brand-text-muted)] mt-1">milhas acumuladas</p>
            </div>
            <div class="text-center">
              <span class="text-3xl font-bold text-[var(--color-brand-cta)]">12</span>
              <p class="text-sm text-[var(--color-brand-text-muted)] mt-1">países visitados</p>
            </div>
            <div class="text-center">
              <span class="text-3xl font-bold text-[var(--color-brand-cta)]">R$80k+</span>
              <p class="text-sm text-[var(--color-brand-text-muted)] mt-1">economizados para clientes</p>
            </div>
          </div>

          <!-- Secondary CTA -->
          <button
            class="bg-[var(--color-brand-cta)] hover:bg-[var(--color-brand-cta-hover)] text-white font-semibold px-8 py-4 rounded-lg text-lg cursor-pointer transition-colors"
            @click="scrollTo('formulario')"
          >
            Quero minha Consultoria
          </button>
        </div>
      </div>
    </div>
  </section>
</template>
