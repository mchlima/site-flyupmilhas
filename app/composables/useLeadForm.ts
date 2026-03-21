// app/composables/useLeadForm.ts
// Stub — fully implemented in Phase 3
export function useLeadForm() {
  const isLoading = ref(false)
  const isSuccess = ref(false)
  const error = ref<string | null>(null)

  // Wire up to POST /leads in Phase 3
  async function submit(_data: unknown) {
    // TODO: Phase 3 implementation
  }

  return { isLoading, isSuccess, error, submit }
}
