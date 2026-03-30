<!-- app/components/App/AppHeader.vue -->
<script setup lang="ts">
const { scrollTo } = useScroll()

const isVisible = ref(true)
const isMenuOpen = ref(false)
const lastScrollY = ref(0)
const SCROLL_THRESHOLD = 64

if (import.meta.client) {
  window.addEventListener('scroll', () => {
    const current = window.scrollY
    if (current < SCROLL_THRESHOLD) {
      isVisible.value = true
    } else {
      isVisible.value = current < lastScrollY.value
    }
    lastScrollY.value = current
  }, { passive: true })

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') isMenuOpen.value = false
  })
}

const navLinks = [
  { label: 'Sobre', anchor: 'sobre' },
  { label: 'Conteúdo', anchor: 'conteudo-programatico' },
  { label: 'Como Funciona', anchor: 'como-funciona' },
  { label: 'Depoimentos', anchor: 'depoimentos' },
  { label: 'FAQ', anchor: 'faq' },
]

function navigate(anchor: string) {
  isMenuOpen.value = false
  scrollTo(anchor)
}
</script>

<template>
  <header
    class="header-bar"
    :style="{ transform: isVisible ? 'translateY(0)' : 'translateY(-100%)' }"
  >
    <div style="max-width: 64rem; margin: 0 auto; display: flex; align-items: center; justify-content: space-between;">
      <!-- Logo -->
      <button style="cursor: pointer; background: none; border: none; padding: 0;" @click="scrollTo('hero')">
        <img
          src="~/assets/img/logo-fly-up-milhas.webp"
          alt="Fly Up Milhas"
          width="120"
          height="40"
          fetchpriority="high"
          decoding="async"
          style="height: 2.5rem; width: auto;"
        />
      </button>

      <!-- Desktop nav -->
      <nav class="header-desktop-nav">
        <button
          v-for="link in navLinks"
          :key="link.anchor"
          class="header-nav-link"
          @click="navigate(link.anchor)"
        >
          {{ link.label }}
        </button>
        <button
          class="header-cta"
          @click="scrollTo('formulario')"
        >
          Quero dar o primeiro passo
        </button>
      </nav>

      <!-- Mobile hamburger -->
      <button
        class="header-hamburger"
        :aria-label="isMenuOpen ? 'Fechar menu' : 'Abrir menu'"
        :aria-expanded="isMenuOpen"
        @click="isMenuOpen = !isMenuOpen"
      >
        <UIcon
          :name="isMenuOpen ? 'i-heroicons-x-mark' : 'i-heroicons-bars-3'"
          style="width: 1.5rem; height: 1.5rem;"
        />
      </button>
    </div>
  </header>

  <!-- Mobile fullscreen overlay -->
  <Transition name="menu">
    <div
      v-if="isMenuOpen"
      style="position: fixed; inset: 0; z-index: 45; display: flex; flex-direction: column; align-items: center; justify-content: center; background: #0F172A;"
      role="dialog"
      aria-modal="true"
    >
    <nav style="display: flex; flex-direction: column; align-items: center; gap: 2rem;">
      <button
        v-for="link in navLinks"
        :key="link.anchor"
        style="color: white; font-size: 1.25rem; font-weight: 700; cursor: pointer; background: none; border: none;"
        @click="navigate(link.anchor)"
      >
        {{ link.label }}
      </button>
      <button
        class="header-cta"
        style="margin-top: 1rem; padding: 1rem 2rem; font-size: 1.125rem; width: 100%; max-width: 20rem;"
        @click="navigate('formulario')"
      >
        Quero dar o primeiro passo
      </button>
    </nav>
  </div>
  </Transition>
</template>

<style>
.header-bar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 50;
  padding: 1rem 1.5rem;
  background: var(--color-brand-dark);
  transition: transform 0.3s ease;
}

.header-desktop-nav {
  display: none;
  align-items: center;
  gap: 1.5rem;
}

@media (min-width: 768px) {
  .header-desktop-nav {
    display: flex;
  }
  .header-hamburger {
    display: none !important;
  }
}

.header-nav-link {
  color: rgba(255,255,255,0.8);
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  background: none;
  border: none;
  transition: color 0.2s ease;
}

.header-nav-link:hover {
  color: var(--color-brand-primary);
}

.header-cta {
  background: var(--color-brand-cta);
  color: white;
  font-weight: 600;
  padding: 0.5rem 1.25rem;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  cursor: pointer;
  border: none;
  transition: background 0.2s ease;
  min-height: 44px;
}

.header-cta:hover {
  background: var(--color-brand-cta-hover);
}

.header-hamburger {
  color: white;
  min-height: 44px;
  min-width: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  background: none;
  border: none;
}

/* Menu transition */
.menu-enter-active,
.menu-leave-active {
  transition: opacity 0.25s ease;
}

.menu-enter-from,
.menu-leave-to {
  opacity: 0;
}
</style>
