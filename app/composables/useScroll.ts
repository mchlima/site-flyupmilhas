// app/composables/useScroll.ts
export function useScroll() {
  function scrollTo(id: string) {
    if (import.meta.client) {
      const el = document.getElementById(id)
      el?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }
  return { scrollTo }
}
