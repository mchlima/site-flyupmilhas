<script setup lang="ts">
const isVisible = ref(false)

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

if (import.meta.client) {
  const SCROLL_THRESHOLD = 300

  onMounted(() => {
    const onScroll = () => {
      isVisible.value = window.scrollY > SCROLL_THRESHOLD
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    onUnmounted(() => {
      window.removeEventListener('scroll', onScroll)
    })
  })
}
</script>

<template>
  <Transition name="fade">
    <button
      v-show="isVisible"
      class="fixed bottom-6 right-6 z-50 w-12 h-12 rounded-full bg-[var(--color-brand-cta)] hover:bg-[var(--color-brand-cta-hover)] text-white shadow-lg flex items-center justify-center cursor-pointer transition-colors"
      aria-label="Voltar ao topo"
      @click="scrollToTop"
    >
      <UIcon name="i-heroicons-chevron-up" class="w-6 h-6" />
    </button>
  </Transition>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
