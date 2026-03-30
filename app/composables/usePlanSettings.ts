export function usePlanSettings() {
  return useFetch('/api/settings/payment', {
    key: 'plan-settings',
    lazy: true,
    default: () => ({
      maxInstallments: 12,
      price: 20000,
      name: 'Mentoria Fly Up Milhas',
      description: '3 encontros online + suporte via WhatsApp',
    }),
  })
}
