const URLS = {
  sandbox: 'https://sandbox.asaas.com/api/v3',
  production: 'https://api.asaas.com/v3',
}

export function asaasApi(path: string, options: { method?: string, body?: unknown } = {}) {
  const config = useRuntimeConfig()
  const baseUrl = config.public.asaasEnvironment === 'production' ? URLS.production : URLS.sandbox

  return $fetch(`${baseUrl}${path}`, {
    method: (options.method || 'GET') as any,
    headers: {
      'Content-Type': 'application/json',
      access_token: config.asaasApiKey,
    },
    ...(options.body && { body: options.body }),
  })
}
