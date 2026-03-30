interface IBGECity {
  id: number
  nome: string
}

export function useBrazilianCities(stateRef: Ref<string> | ComputedRef<string>) {
  const cities = ref<string[]>([])
  const loading = ref(false)

  async function fetchCities(uf: string) {
    if (!uf || uf.length !== 2) {
      cities.value = []
      return
    }

    loading.value = true
    try {
      const data = await $fetch<IBGECity[]>(
        `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${uf}/municipios`,
        { query: { orderBy: 'nome' } },
      )
      cities.value = data.map(c => c.nome)
    } catch {
      cities.value = []
    } finally {
      loading.value = false
    }
  }

  watch(stateRef, (val) => {
    fetchCities(val)
  }, { immediate: true })

  return { cities, loading }
}
