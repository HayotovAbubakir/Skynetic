import { useEffect, useRef, useState } from 'react'
import { Bot, Send, Sparkles } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { sendChatMessage, type ChatMessage } from '../services/ai'
import { Button } from './ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from './ui/Card'
import { Input } from './ui/Input'

const createMessage = (role: ChatMessage['role'], content: string): ChatMessage => ({
  id: `msg-${Date.now()}-${Math.random().toString(16).slice(2)}`,
  role,
  content,
  timestamp: new Date().toISOString(),
})

export const ChatPanel = () => {
  const { t, i18n } = useTranslation()
  const [messages, setMessages] = useState<ChatMessage[]>([
    createMessage('assistant', t('chat.welcome')),
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const listRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const list = listRef.current
    if (!list) return
    list.scrollTop = list.scrollHeight
  }, [messages, loading, error])

  const handleSend = async () => {
    if (!input.trim() || loading) return
    const userMessage = createMessage('user', input.trim())
    setMessages((prev) => [...prev, userMessage])
    setInput('')
    setLoading(true)
    setError('')

    try {
      const lang = i18n.language
      let payloadContent = userMessage.content

      if (lang === 'ru') {
        payloadContent = `Отвечай, пожалуйста, на русском языке.\n\n${userMessage.content}`
      } else if (lang === 'uz') {
        payloadContent = `Iltimos, javoblarni o'zbek tilida yozing.\n\n${userMessage.content}`
      }

      const response = await sendChatMessage(payloadContent)
      setMessages((prev) => [...prev, createMessage('assistant', response.reply)])
    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') {
        setError(t('chat.timeout'))
      } else {
        setError(err instanceof Error ? err.message : t('chat.error'))
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Bot size={18} className="text-teal dark:text-teal-300" /> {t('chat.title')}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex h-[420px] flex-col gap-4">
        <div
          ref={listRef}
          className="flex-1 space-y-3 overflow-y-auto rounded-xl bg-slate-50/80 p-4 text-slate-700 dark:bg-slate-800/70 dark:text-slate-100"
        >
          {messages.map((message) => (
            <div
              key={message.id}
              className={`max-w-[85%] rounded-xl px-3 py-2 text-sm shadow-sm break-words ${
                message.role === 'assistant'
                  ? 'bg-white/90 text-slate-600 dark:bg-slate-900/80 dark:text-slate-200'
                  : 'ml-auto bg-teal text-white dark:bg-teal-400 dark:text-slate-900'
              }`}
            >
              {message.content}
            </div>
          ))}
          {loading && (
            <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-300">
              <Sparkles size={14} className="animate-pulse" /> {t('chat.thinking')}
            </div>
          )}
          {error && <p className="text-xs text-red-500">{error}</p>}
        </div>
        <div className="flex gap-2">
          <Input
            value={input}
            onChange={(event) => setInput(event.target.value)}
            placeholder={t('chat.placeholder')}
            aria-label={t('chat.placeholder')}
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                event.preventDefault()
                void handleSend()
              }
            }}
          />
          <Button size="sm" onClick={() => void handleSend()} aria-label={t('common.submit')}>
            <Send size={16} />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}


