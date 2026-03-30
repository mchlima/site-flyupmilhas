const URLS = {
  sandbox: 'https://sandbox.asaas.com/api/v3',
  production: 'https://api.asaas.com/v3',
}

export async function asaasApi(path: string, options: { method?: string, body?: unknown } = {}) {
  const config = useRuntimeConfig()
  const baseUrl = config.public.asaasEnvironment === 'production' ? URLS.production : URLS.sandbox

  try {
    return await $fetch(`${baseUrl}${path}`, {
      method: (options.method || 'GET') as any,
      headers: {
        'Content-Type': 'application/json',
        access_token: config.asaasApiKey,
      },
      ...(options.body && { body: options.body }),
    })
  } catch (err: any) {
    const data = err?.data || err?.response?._data
    console.error(`[Asaas] ${options.method || 'GET'} ${path}`, JSON.stringify(data, null, 2))
    throw err
  }
}
