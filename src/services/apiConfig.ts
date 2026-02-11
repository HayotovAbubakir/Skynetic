type OpenApiSpec = {
  host?: string
  basePath?: string
  schemes?: string[]
}

const normalizePath = (path: string) => {
  if (!path) return ''
  return path.startsWith('/') ? path : `/${path}`
}

export const joinUrl = (base: string, path: string) => {
  const trimmedBase = base.replace(/\/+$/, '')
  const normalizedPath = normalizePath(path)

  if (!trimmedBase) return normalizedPath
  if (trimmedBase.endsWith('/api') && normalizedPath.startsWith('/api/')) {
    return `${trimmedBase}${normalizedPath.slice(4)}`
  }

  return `${trimmedBase}${normalizedPath}`
}

const defaultBaseUrl = () => '/api'

const buildBaseFromSpec = (spec: OpenApiSpec): string | null => {
  const host = spec.host?.trim()
  if (!host) return null
  const scheme = spec.schemes?.[0] ?? 'http'
  const basePath = spec.basePath?.trim() ?? ''
  const normalizedBasePath = basePath ? normalizePath(basePath) : ''
  return `${scheme}://${host}${normalizedBasePath}`
}

let cachedBaseUrl: string | null = null
let baseUrlPromise: Promise<string> | null = null

const fetchBaseFromOpenApi = async () => {
  const openapiUrl = import.meta.env.VITE_OPENAPI_URL?.trim() || '/openapi.json'
  try {
    const response = await fetch(openapiUrl, { cache: 'no-store' })
    if (!response.ok) return null
    const spec = (await response.json()) as OpenApiSpec
    return buildBaseFromSpec(spec)
  } catch {
    return null
  }
}

export const resolveApiBaseUrl = async (): Promise<string> => {
  const explicit = import.meta.env.VITE_API_BASE_URL?.trim()
  if (explicit) return explicit
  if (cachedBaseUrl) return cachedBaseUrl
  if (!baseUrlPromise) {
    baseUrlPromise = (async () => {
      const fromSpec = await fetchBaseFromOpenApi()
      cachedBaseUrl = fromSpec ?? defaultBaseUrl()
      return cachedBaseUrl
    })()
  }

  return baseUrlPromise
}

export const getAuthHeader = () => {
  const explicit = import.meta.env.VITE_API_BASIC_AUTH?.trim()
  if (explicit) return `Basic ${explicit}`

  const user = import.meta.env.VITE_API_BASIC_USER
  const password = import.meta.env.VITE_API_BASIC_PASSWORD
  if (user && password && typeof btoa === 'function') {
    return `Basic ${btoa(`${user}:${password}`)}`
  }

  return null
}
