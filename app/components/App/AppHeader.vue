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
    class="fixed top-0 left-0 right-0 z-50 px-6 py-4 bg-[var(--color-brand-primary)] transition-transform duration-300"
    :class="isVisible ? 'translate-y-0' : '-translate-y-full'"
  >
    <div class="max-w-5xl mx-auto flex items-center justify-between">
      <!-- Logo -->
      <button class="cursor-pointer" @click="scrollTo('hero')">
        <img
          src="~/assets/img/logo-fly-up-milhas.png"
          alt="Fly Up Milhas"
          class="h-10 w-auto"
        />
      </button>

      <!-- Desktop nav -->
      <nav class="hidden md:flex items-center gap-6">
        <button
          v-for="link in navLinks"
          :key="link.anchor"
          class="text-white/80 hover:text-white text-sm font-medium transition-colors cursor-pointer"
          @click="navigate(link.anchor)"
        >
          {{ link.label }}
        </button>
        <button
          class="bg-[var(--color-brand-cta)] hover:bg-[var(--color-brand-cta-hover)] text-white font-semibold px-5 py-2 rounded-lg text-sm cursor-pointer transition-colors min-h-[44px]"
          @click="scrollTo('formulario')"
        >
          Quero dar o primeiro passo
        </button>
      </nav>

      <!-- Mobile hamburger -->
      <button
        class="md:hidden text-white min-h-[44px] min-w-[44px] flex items-center justify-center cursor-pointer"
        :aria-label="isMenuOpen ? 'Fechar menu' : 'Abrir menu'"
        :aria-expanded="isMenuOpen"
        @click="isMenuOpen = !isMenuOpen"
      >
        <UIcon
          :name="isMenuOpen ? 'i-heroicons-x-mark' : 'i-heroicons-bars-3'"
          class="w-6 h-6"
        />
      </button>
    </div>
  </header>

  <!-- Mobile fullscreen overlay -->
  <div
    class="fixed inset-0 z-40 flex flex-col items-center justify-center bg-[var(--color-brand-primary)] transition-opacity duration-200"
    :class="isMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'"
    role="dialog"
    aria-modal="true"
    :aria-hidden="!isMenuOpen"
  >
    <nav class="flex flex-col items-center gap-8">
      <button
        v-for="link in navLinks"
        :key="link.anchor"
        class="text-white text-xl font-bold cursor-pointer"
        @click="navigate(link.anchor)"
      >
        {{ link.label }}
      </button>
      <button
        class="mt-4 bg-[var(--color-brand-cta)] hover:bg-[var(--color-brand-cta-hover)] text-white font-semibold px-8 py-4 rounded-lg text-lg cursor-pointer transition-colors w-full max-w-xs"
        @click="navigate('formulario')"
      >
        Quero dar o primeiro passo
      </button>
    </nav>
  </div>
</template>
