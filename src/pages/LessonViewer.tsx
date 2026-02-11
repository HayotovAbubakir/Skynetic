import { useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import { PauseCircle, PlayCircle, Square } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { ChatPanel } from '../components/ChatPanel'
import { ExerciseList } from '../components/ExerciseList'
import { LessonOutline } from '../components/LessonOutline'
import { QuizCard } from '../components/QuizCard'
import { Badge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card'
import { Progress } from '../components/ui/Progress'
import { useAppStore } from '../features/appStore'
import { useProgressiveText } from '../hooks/useProgressiveText'
import { useTTS } from '../hooks/useTTS'

export const LessonViewer = () => {
  const { courseId, lessonId } = useParams()
  const { t, i18n } = useTranslation()
  const { courses, lessonProgress, recordExercises, recordQuizScore } = useAppStore()
  const [hasStarted, setHasStarted] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)

  const course = useMemo(
    () => courses.find((item) => item.id === courseId) ?? courses[0],
    [courses, courseId],
  )

  const lesson = useMemo(() => {
    if (!course) return undefined
    return course.lessons.find((item) => item.id === lessonId) ?? course.lessons[0]
  }, [course, lessonId])

  const ttsText = lesson ? lesson.theory.join(' ') : ''
  const { isSpeaking, isPaused, rate, setRate, speak, pause, resume, stop, error } = useTTS(
    ttsText,
    { lang: i18n.language },
  )

  const textSpeed = 1600 / Math.max(rate, 0.7)

  const { visibleLines, progress, isComplete, reset } = useProgressiveText(
    lesson?.theory ?? [],
    hasStarted && isPlaying,
    textSpeed,
  )

  const lessonRecord = lesson ? lessonProgress[lesson.id] : undefined

  if (!course || !lesson) {
    return <p className="text-sm text-slate-500 dark:text-slate-300">{t('common.noLesson')}</p>
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="min-w-0">
          <p className="text-[0.7rem] uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
            {t('lesson.eyebrow')}
          </p>
          <h1 className="mt-2 break-words font-display text-2xl font-semibold text-ink dark:text-white">
            {lesson.title}
          </h1>
          <p className="mt-2 break-words text-sm text-slate-600 dark:text-slate-300">
            {lesson.summary}
          </p>
        </div>
        <div className="flex flex-col items-end gap-3 md:items-end">
          <Badge className="w-fit border-teal/20 bg-teal/10 text-teal dark:border-teal-500/40 dark:bg-teal-500/20 dark:text-teal-200">
            {lesson.durationMinutes} {t('lesson.minutes')}
          </Badge>
          <Button
            size="sm"
            onClick={() => {
              if (!hasStarted) {
                setHasStarted(true)
                setIsPlaying(true)
                if (!isSpeaking && !error) {
                  speak()
                }
              }
            }}
          >
            {t('lesson.start')}
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_1.2fr_0.9fr]">
        <LessonOutline course={course} activeLesson={lesson} />

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">{t('lesson.theoryTitle')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3 rounded-2xl bg-slate-50/80 p-5 text-sm text-slate-700 dark:bg-slate-800/70 dark:text-slate-100">
                {visibleLines.map((line) => (
                  <p key={line}>{line}</p>
                ))}
                {isComplete && (
                  <p className="text-xs text-teal dark:text-teal-300">{t('lesson.endNotice')}</p>
                )}
              </div>
              <div className="space-y-3">
                <div className="flex flex-wrap items-center gap-3">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      if (!hasStarted) {
                        setHasStarted(true)
                        setIsPlaying(true)
                        if (!isSpeaking && !error) {
                          speak()
                        }
                        return
                      }
                      setIsPlaying((state) => !state)
                    }}
                  >
                    {hasStarted && isPlaying ? (
                      <>
                        <PauseCircle size={16} /> {t('common.pause')}
                      </>
                    ) : (
                      <>
                        <PlayCircle size={16} /> {t('common.play')}
                      </>
                    )}
                  </Button>
                  <Button variant="ghost" size="sm" onClick={reset}>
                    {t('common.restart')}
                  </Button>
                </div>
                <Progress value={progress} />
              </div>

              <div className="rounded-2xl border border-slate-200/70 bg-slate-50/80 p-4 dark:border-slate-800/80 dark:bg-slate-800/70">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-[0.7rem] uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
                      {t('lesson.audioLabel')}
                    </p>
                    <p className="text-sm text-slate-600 dark:text-slate-300">
                      {error ? t('lesson.audioUnavailable') : t('lesson.audioReady')}
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    {!isSpeaking && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          if (!hasStarted) {
                            setHasStarted(true)
                            setIsPlaying(true)
                          }
                          speak()
                        }}
                      >
                        <PlayCircle size={16} /> {t('lesson.audioReady')}
                      </Button>
                    )}
                    {isSpeaking && !isPaused && (
                      <Button size="sm" variant="outline" onClick={pause}>
                        <PauseCircle size={16} /> {t('lesson.audioPause')}
                      </Button>
                    )}
                    {isSpeaking && isPaused && (
                      <Button size="sm" variant="outline" onClick={resume}>
                        <PlayCircle size={16} /> {t('lesson.audioResume')}
                      </Button>
                    )}
                    {isSpeaking && (
                      <Button size="sm" variant="ghost" onClick={stop}>
                        <Square size={16} /> {t('lesson.audioStop')}
                      </Button>
                    )}
                  </div>
                </div>
                <div className="mt-3 flex flex-col gap-2 text-xs text-slate-500 dark:text-slate-400">
                  <label htmlFor="tts-rate">{t('lesson.audioRate')}</label>
                  <input
                    id="tts-rate"
                    type="range"
                    min={0.7}
                    max={1.5}
                    step={0.1}
                    value={rate}
                    onChange={(event) => setRate(Number(event.target.value))}
                    className="w-full accent-teal"
                  />
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                {lesson.sources.map((source) => (
                  <Badge
                    key={source}
                    className="bg-slate-50/80 text-slate-500 dark:bg-slate-800/70 dark:text-slate-100"
                  >
                    {source}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          <ExerciseList
            exercises={lesson.exercises}
            savedSubmissions={lessonRecord?.exercises}
            onSubmit={(submissions) => recordExercises(lesson.id, submissions)}
          />
          <QuizCard
            quiz={lesson.quiz}
            savedScore={lessonRecord?.quizScore}
            onSubmit={(score, maxScore) =>
              recordQuizScore(course.id, lesson.id, lesson.quiz.id, score, maxScore)
            }
          />
        </div>

        {hasStarted ? (
          <ChatPanel />
        ) : (
          <Card>
            <CardHeader>
              <CardTitle className="text-base">{t('chat.title')}</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-slate-600 dark:text-slate-300">
              {t('lesson.chatLocked')}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
