<script setup lang="ts">
import bgHero from '~/assets/img/bg-hero.webp'

const { scrollTo } = useScroll()
</script>

<template>
  <section
    id="hero"
    class="min-h-screen flex flex-col justify-center"
    style="position: relative; overflow: hidden;"
  >
    <!-- Background image — LCP element with slow zoom -->
    <img
      :src="bgHero"
      alt=""
      aria-hidden="true"
      fetchpriority="high"
      loading="eager"
      decoding="async"
      style="position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; animation: heroZoom 20s ease-out forwards;"
    />
    <!-- Dark overlay -->
    <div style="position: absolute; inset: 0; background: linear-gradient(160deg, rgba(15,23,42,0.92) 0%, rgba(29,78,216,0.80) 100%);" />

    <div style="position: relative; z-index: 10; max-width: 48rem; margin: 0 auto; text-align: center; padding: 3rem 1.5rem; display: flex; flex-direction: column; align-items: center; gap: 1.5rem;">

      <!-- Badge -->
      <span
        class="hero-enter hero-enter--0"
        style="display: inline-flex; align-items: center; padding: 0.4rem 1.2rem; border-radius: 9999px; font-size: 0.8rem; font-weight: 600; letter-spacing: 0.05em; text-transform: uppercase; color: white; background: rgba(255,255,255,0.12); border: 1px solid rgba(255,255,255,0.2); backdrop-filter: blur(8px);"
      >
        Consultoria exclusiva de milhas
      </span>

      <!-- Headline -->
      <h1
        class="hero-enter hero-enter--1"
        style="font-size: 2rem; font-weight: 800; line-height: 1.15; letter-spacing: -0.02em; color: white;"
      >
        Aprenda a viajar de <span style="background: linear-gradient(135deg, #38bdf8, #818cf8); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;">classe executiva</span> pagando até <span style="background: linear-gradient(135deg, #38bdf8, #818cf8); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;">80% menos</span>, mesmo começando do zero.
      </h1>

      <!-- Subtitle -->
      <p
        class="hero-enter hero-enter--2"
        style="font-size: 1.15rem; line-height: 1.6; color: rgba(255,255,255,0.8); max-width: 36rem;"
      >
        Um método simples e prático para transformar seus gastos do dia a dia em milhas e viajar mais, gastando menos.
      </p>

      <!-- Social proof -->
      <div
        class="hero-enter hero-enter--3"
        style="display: flex; align-items: center; justify-content: center; gap: 0.75rem; flex-wrap: wrap;"
      >
        <span style="font-size: 0.85rem; font-weight: 500; color: rgba(255,255,255,0.7);">+500 clientes atendidos</span>
        <span style="width: 4px; height: 4px; border-radius: 50%; background: rgba(255,255,255,0.4);" />
        <span style="font-size: 0.85rem; font-weight: 500; color: rgba(255,255,255,0.7);">Nota 5.0 no Google</span>
      </div>

      <!-- CTA -->
      <div class="hero-enter hero-enter--4" style="display: flex; justify-content: center;">
        <button
          class="hero-cta"
          style="display: inline-flex; align-items: center; gap: 0.5rem; padding: 1rem 2.5rem; border-radius: 0.75rem; font-size: 1.15rem; font-weight: 700; color: white; background: var(--color-brand-cta); cursor: pointer; border: none; transition: transform 0.2s ease, background 0.2s ease, box-shadow 0.2s ease;"
          @click="scrollTo('formulario')"
        >
          Quero começar agora
          <span style="transition: transform 0.2s ease;">&rarr;</span>
        </button>
      </div>

      <p
        class="hero-enter hero-enter--5"
        style="font-size: 0.85rem; color: rgba(255,255,255,0.6);"
      >
        Comece a economizar já no primeiro mês
      </p>
    </div>

    <!-- Scroll indicator -->
    <div
      class="hero-enter hero-enter--5"
      style="position: absolute; bottom: 2rem; left: 50%; transform: translateX(-50%); z-index: 10;"
    >
      <div style="width: 28px; height: 28px; border-right: 2px solid rgba(255,255,255,0.5); border-bottom: 2px solid rgba(255,255,255,0.5); transform: rotate(45deg); animation: bounceDn 2s ease-in-out infinite;" />
    </div>
  </section>
</template>

<style>
/* Animations — unscoped so keyframes work reliably */
.hero-enter {
  opacity: 0;
  transform: translateY(1.5rem);
  animation: heroAppear 0.7s ease-out forwards;
}

.hero-enter--0 { animation-delay: 0.1s; }
.hero-enter--1 { animation-delay: 0.25s; }
.hero-enter--2 { animation-delay: 0.45s; }
.hero-enter--3 { animation-delay: 0.6s; }
.hero-enter--4 { animation-delay: 0.75s; }
.hero-enter--5 { animation-delay: 0.9s; }

@keyframes heroAppear {
  to { opacity: 1; transform: translateY(0); }
}

@keyframes heroZoom {
  from { transform: scale(1); }
  to   { transform: scale(1.08); }
}

@keyframes bounceDn {
  0%, 100% { transform: rotate(45deg) translateY(0); opacity: 0.5; }
  50%      { transform: rotate(45deg) translateY(8px); opacity: 1; }
}

.hero-cta:hover {
  background: var(--color-brand-cta-hover) !important;
  transform: translateY(-2px);
  box-shadow: 0 8px 30px rgba(14,116,144,0.4);
}

/* Responsive title */
@media (min-width: 768px) {
  #hero h1 {
    font-size: 3.2rem !important;
  }
  #hero .hero-subtitle {
    font-size: 1.3rem !important;
  }
}
</style>
