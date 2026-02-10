import { useEffect, useState } from 'react'
import { CheckCircle2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import type { Exercise, ExerciseSubmission } from '../types'
import { Button } from './ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from './ui/Card'
import { Textarea } from './ui/Textarea'

interface ExerciseListProps {
  exercises: Exercise[]
  savedSubmissions?: ExerciseSubmission[]
  onSubmit: (submissions: ExerciseSubmission[]) => void
}

export const ExerciseList = ({ exercises, savedSubmissions = [], onSubmit }: ExerciseListProps) => {
  const { t } = useTranslation()
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [submitted, setSubmitted] = useState(savedSubmissions.length > 0)

  useEffect(() => {
    if (savedSubmissions.length) {
      const initial = savedSubmissions.reduce<Record<string, string>>((acc, item) => {
        acc[item.exerciseId] = item.answer
        return acc
      }, {})
      setAnswers(initial)
      setSubmitted(true)
    }
  }, [savedSubmissions])

  const handleSubmit = () => {
    const payload: ExerciseSubmission[] = exercises.map((exercise) => ({
      exerciseId: exercise.id,
      answer: answers[exercise.id] || '',
      submittedAt: new Date().toISOString(),
    }))
    onSubmit(payload)
    setSubmitted(true)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">{t('exercises.title')}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {exercises.map((exercise) => (
          <div
            key={exercise.id}
            className="space-y-3 rounded-xl border border-slate-200/70 bg-slate-50/80 px-4 py-3 text-sm text-slate-700 dark:border-slate-800/80 dark:bg-slate-800/70 dark:text-slate-100"
          >
            <div className="flex items-start gap-3">
              <CheckCircle2 size={18} className="mt-0.5 text-teal dark:text-teal-300" />
              <div className="min-w-0">
                <p className="break-words font-medium text-slate-700 dark:text-slate-100">
                  {exercise.prompt}
                </p>
                {exercise.hint && (
                  <p className="text-xs text-slate-500 dark:text-slate-300">
                    {t('exercises.hint')}: {exercise.hint}
                  </p>
                )}
              </div>
            </div>
            <Textarea
              value={answers[exercise.id] || ''}
              onChange={(event) =>
                setAnswers((prev) => ({ ...prev, [exercise.id]: event.target.value }))
              }
              placeholder={t('exercises.answerPlaceholder')}
              className="min-h-[90px]"
            />
          </div>
        ))}
        <div className="flex flex-wrap items-center gap-3">
          <Button size="sm" onClick={handleSubmit}>
            {t('exercises.submit')}
          </Button>
          {submitted && (
            <span className="text-xs font-semibold text-teal dark:text-teal-300">
              {t('exercises.saved')}
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
