import { useCallback, useEffect, useRef, useState } from 'react'

type TTSOptions = {
  lang?: string
  /**
   * When true, emit word boundary events so callers can highlight
   * the text in sync with the spoken audio.
   */
  enableBoundaryEvents?: boolean
  /**
   * Optional callbacks for lifecycle events.
   */
  onStart?: () => void
  onEnd?: () => void
  onBoundary?: (payload: { charIndex: number; charLength: number }) => void
}

const resolveLang = (lang?: string) => {
  if (!lang) return 'en-US'
  const normalized = lang.toLowerCase()
  if (normalized.startsWith('ru')) return 'ru-RU'
  if (normalized.startsWith('uz')) return 'uz-UZ'
  if (normalized.startsWith('en')) return 'en-US'
  return lang
}

const pickBestVoice = (
  voices: SpeechSynthesisVoice[],
  resolvedLang: string,
): SpeechSynthesisVoice | null => {
  if (!voices.length) return null

  const normalized = resolvedLang.toLowerCase()
  const [prefix] = normalized.split('-')

  // 1. Exact language/region match, e.g. ru-RU, uz-UZ
  const exact = voices.find((voice) => voice.lang?.toLowerCase() === normalized)
  if (exact) return exact

  // 2. Any voice that starts with the same language code, e.g. ru-*, uz-*
  const sameLanguage = voices.find((voice) =>
    voice.lang?.toLowerCase().startsWith(`${prefix}-`),
  )
  if (sameLanguage) return sameLanguage

  // 3. Fallback: first voice whose lang starts with the same prefix anywhere
  const looseMatch = voices.find((voice) => voice.lang?.toLowerCase().startsWith(prefix))
  if (looseMatch) return looseMatch

  // 4. No suitable local voice found – let the browser decide.
  if (import.meta.env.DEV) {
    // eslint-disable-next-line no-console
    console.warn(
      `[useTTS] No voice found for language "${resolvedLang}". Falling back to default voice.`,
    )
  }

  return null
}

export const useTTS = (text: string, options: TTSOptions = {}) => {
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null)
  const isSpeakingRef = useRef(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [rate, setRate] = useState(1)
  const [error, setError] = useState<string | null>(null)
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([])

  const resolvedLang = resolveLang(options.lang)

  const isSupported =
    typeof window !== 'undefined' &&
    'speechSynthesis' in window &&
    'SpeechSynthesisUtterance' in window

  useEffect(() => {
    if (!isSupported) return

    const loadVoices = () => {
      const available = window.speechSynthesis.getVoices()
      setVoices(available)
    }

    loadVoices()
    window.speechSynthesis.addEventListener('voiceschanged', loadVoices)

    return () => {
      window.speechSynthesis.removeEventListener('voiceschanged', loadVoices)
    }
  }, [isSupported])

  const pickVoice = useCallback(
    () => pickBestVoice(voices, resolvedLang),
    [voices, resolvedLang],
  )

  const stop = useCallback(() => {
    if (!isSupported) return
    window.speechSynthesis.cancel()
    isSpeakingRef.current = false
    setIsSpeaking(false)
    setIsPaused(false)
  }, [isSupported])

  const speak = useCallback(() => {
    if (!isSupported || !text.trim()) {
      if (!isSupported) setError('Speech synthesis is not supported.')
      return
    }

    stop()

    const utterance = new SpeechSynthesisUtterance(text)
    utterance.rate = rate
    utterance.lang = resolvedLang
    const voice = pickVoice()
    if (voice) utterance.voice = voice

    utterance.onstart = () => {
      isSpeakingRef.current = true
      setIsSpeaking(true)
      setIsPaused(false)
      setError(null)
      options.onStart?.()
    }
    utterance.onend = () => {
      isSpeakingRef.current = false
      setIsSpeaking(false)
      setIsPaused(false)
      options.onEnd?.()
    }
    utterance.onerror = () => {
      isSpeakingRef.current = false
      setIsSpeaking(false)
      setIsPaused(false)
      setError('Speech synthesis failed.')
    }

    if (options.enableBoundaryEvents && typeof options.onBoundary === 'function') {
      utterance.onboundary = (event: SpeechSynthesisEvent) => {
        if (event.name === 'word' || event.charIndex != null) {
          options.onBoundary?.({
            charIndex: event.charIndex,
            charLength: (event.charLength as number | undefined) ?? 0,
          })
        }
      }
    }

    utteranceRef.current = utterance
    window.speechSynthesis.speak(utterance)
  }, [isSupported, pickVoice, rate, resolvedLang, stop, text, options])

  const pause = useCallback(() => {
    if (!isSupported) return
    window.speechSynthesis.pause()
    setIsPaused(true)
  }, [isSupported])

  const resume = useCallback(() => {
    if (!isSupported) return
    window.speechSynthesis.resume()
    setIsPaused(false)
  }, [isSupported])

  useEffect(() => () => stop(), [stop])

  useEffect(() => {
    if (!isSupported) return
    if (!text.trim()) return
    if (!isSpeakingRef.current) return

    stop()
    const timer = window.setTimeout(() => {
      speak()
    }, 0)

    return () => window.clearTimeout(timer)
  }, [isSupported, rate, resolvedLang, speak, stop, text])

  return {
    isSpeaking,
    isPaused,
    rate,
    setRate,
    speak,
    pause,
    resume,
    stop,
    error,
  }
}
