import { getAuthHeader, joinUrl, resolveApiBaseUrl } from './apiConfig'

export type ChatMessage = {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: string
}

export type ChatResponse = {
  reply: string
}

const buildChatUrl = async () => {
  const base = (await resolveApiBaseUrl()).trim()
  const path = (import.meta.env.VITE_CHAT_PATH ?? '/chat/message/').trim()
  return joinUrl(base, path)
}

const extractReply = (payload: unknown): string | null => {
  if (!payload) return null
  if (typeof payload === 'string') return payload

  if (typeof payload === 'object') {
    const data = payload as Record<string, unknown>
    const direct =
      data.reply ??
      data.message ??
      data.response ??
      data.answer ??
      data.content

    if (typeof direct === 'string') return direct

    if (data.data) {
      const nested = extractReply(data.data)
      if (nested) return nested
    }

    if (Array.isArray(data.choices)) {
      const first = data.choices[0] as Record<string, unknown> | undefined
      if (first) {
        const message = first.message as Record<string, unknown> | undefined
        if (message && typeof message.content === 'string') return message.content
        if (typeof first.text === 'string') return first.text
      }
    }
  }

  return null
}

export const sendChatMessage = async (message: string): Promise<ChatResponse> => {
  const authHeader = getAuthHeader()
  const timeoutMsRaw = import.meta.env.VITE_CHAT_TIMEOUT_MS
  const parsedTimeout = Number(timeoutMsRaw)
  const timeoutMs = Number.isFinite(parsedTimeout) && parsedTimeout > 0 ? parsedTimeout : 15000
  const controller = new AbortController()
  const timeoutId = globalThis.setTimeout(() => controller.abort(), timeoutMs)

  const response = await fetch(await buildChatUrl(), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(authHeader ? { Authorization: authHeader } : {}),
    },
    body: JSON.stringify({ message }),
    signal: controller.signal,
  }).finally(() => {
    globalThis.clearTimeout(timeoutId)
  })

  const text = await response.text()
  let payload: unknown = null
  if (text) {
    try {
      payload = JSON.parse(text)
    } catch {
      payload = text
    }
  }

  if (!response.ok) {
    const details = extractReply(payload) || (typeof payload === 'string' ? payload : '')
    throw new Error(details || 'Failed to reach AI service')
  }

  const reply = extractReply(payload)
  if (!reply) {
    throw new Error('Unexpected AI response format.')
  }

  return { reply }
}

