import { useMemo, useState } from 'react'
import { ClipboardCheck } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import type { Quiz } from '../types'
import { Badge } from './ui/Badge'
import { Button } from './ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from './ui/Card'

interface QuizCardProps {
  quiz: Quiz
  savedScore?: number
  onSubmit: (score: number, maxScore: number) => void
}

export const QuizCard = ({ quiz, savedScore, onSubmit }: QuizCardProps) => {
  const { t } = useTranslation()
  const [answers, setAnswers] = useState<Record<string, number>>({})
  const [score, setScore] = useState<number | null>(savedScore ?? null)

  const maxScore = quiz.questions.length
  const completed = score !== null

  const computedScore = useMemo(() => {
    return quiz.questions.reduce((sum, question) => {
      if (answers[question.id] === question.answerIndex) {
        return sum + 1
      }
      return sum
    }, 0)
  }, [answers, quiz.questions])

  const handleSubmit = () => {
    const newScore = computedScore
    setScore(newScore)
    onSubmit(newScore, maxScore)
  }

  const handleReset = () => {
    setAnswers({})
    setScore(null)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <ClipboardCheck size={18} className="text-teal dark:text-teal-300" /> {quiz.title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Badge className="border-teal/20 bg-teal/10 text-teal dark:border-teal-500/40 dark:bg-teal-500/20 dark:text-teal-200">
          {t(`quiz.type.${quiz.type}`)}
        </Badge>
        <div className="space-y-3">
          {quiz.questions.map((question, index) => (
            <div
              key={question.id}
              className="rounded-xl border border-slate-200/70 bg-slate-50/80 p-4 dark:border-slate-800/80 dark:bg-slate-800/70"
            >
              <p className="text-sm font-semibold text-slate-700 dark:text-slate-100">
                {index + 1}. {question.prompt}
              </p>
              <div className="mt-3 grid gap-2 text-sm text-slate-600 dark:text-slate-200 md:grid-cols-2">
                {question.options.map((option, optionIndex) => {
                  const isSelected = answers[question.id] === optionIndex
                  const isCorrect = completed && optionIndex === question.answerIndex
                  const isWrong = completed && isSelected && !isCorrect

                  return (
                    <button
                      type="button"
                      key={option}
                      onClick={() =>
                        setAnswers((prev) => ({ ...prev, [question.id]: optionIndex }))
                      }
                      className={`rounded-lg border px-3 py-2 text-left transition-colors break-words ${
                        isSelected
                          ? 'border-teal bg-teal/10 text-teal dark:border-teal-300 dark:bg-teal-500/20 dark:text-teal-200'
                          : 'border-slate-200 bg-white/90 text-slate-600 dark:border-slate-700 dark:bg-slate-900/80 dark:text-slate-200'
                      } ${
                        isCorrect ? 'border-emerald-400 text-emerald-600 dark:border-emerald-300 dark:text-emerald-300' : ''
                      } ${
                        isWrong ? 'border-red-400 text-red-500 dark:border-red-300 dark:text-red-300' : ''
                      }`}
                    >
                      {option}
                    </button>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Button size="sm" onClick={handleSubmit}>
            {t('quiz.submit')}
          </Button>
          <Button variant="outline" size="sm" onClick={handleReset}>
            {t('quiz.tryAgain')}
          </Button>
          {completed && (
            <span className="text-xs font-semibold text-teal dark:text-teal-300">
              {t('quiz.score')}: {score}/{maxScore}
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
