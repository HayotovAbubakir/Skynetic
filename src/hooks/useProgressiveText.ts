import { useEffect, useMemo, useState } from 'react'

export const useProgressiveText = (
  lines: string[],
  isPlaying: boolean,
  speed = 1400,
) => {
  const [visibleCount, setVisibleCount] = useState(1)

  useEffect(() => {
    setVisibleCount(1)
  }, [lines])

  useEffect(() => {
    if (!isPlaying) return undefined
    if (visibleCount >= lines.length) return undefined

    const timer = setInterval(() => {
      setVisibleCount((count) => Math.min(lines.length, count + 1))
    }, speed)

    return () => clearInterval(timer)
  }, [isPlaying, lines.length, speed, visibleCount])

  const visibleLines = useMemo(() => lines.slice(0, visibleCount), [lines, visibleCount])
  const progress = Math.round((visibleCount / Math.max(lines.length, 1)) * 100)

  return {
    visibleLines,
    progress,
    isComplete: visibleCount >= lines.length,
    reset: () => setVisibleCount(1),
  }
}
