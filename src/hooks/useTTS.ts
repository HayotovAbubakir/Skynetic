import { useCallback, useEffect, useRef, useState } from 'react'

export const useTTS = (text: string) => {
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [rate, setRate] = useState(1)
  const [error, setError] = useState<string | null>(null)

  const isSupported =
    typeof window !== 'undefined' &&
    'speechSynthesis' in window &&
    'SpeechSynthesisUtterance' in window

  const stop = useCallback(() => {
    if (!isSupported) return
    window.speechSynthesis.cancel()
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
    utterance.onstart = () => {
      setIsSpeaking(true)
      setIsPaused(false)
      setError(null)
    }
    utterance.onend = () => {
      setIsSpeaking(false)
      setIsPaused(false)
    }
    utterance.onerror = () => {
      setIsSpeaking(false)
      setIsPaused(false)
      setError('Speech synthesis failed.')
    }

    utteranceRef.current = utterance
    window.speechSynthesis.speak(utterance)
  }, [rate, stop, text])

  const pause = useCallback(() => {
    if (!isSupported) return
    window.speechSynthesis.pause()
    setIsPaused(true)
  }, [])

  const resume = useCallback(() => {
    if (!isSupported) return
    window.speechSynthesis.resume()
    setIsPaused(false)
  }, [])

  useEffect(() => () => stop(), [stop])

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
