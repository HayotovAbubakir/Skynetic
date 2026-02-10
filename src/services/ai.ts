export type ChatMessage = {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: string
}

export type ChatResponse = {
  reply: string
}

export const sendChatMessage = async (message: string): Promise<ChatResponse> => {
  const response = await fetch('/api/chat', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ message }),
  })

  if (!response.ok) {
    const details = await response.text()
    throw new Error(details || 'Failed to reach AI service')
  }

  return (await response.json()) as ChatResponse
}
