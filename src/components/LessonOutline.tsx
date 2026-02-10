import { BookOpenCheck } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import type { Course, Lesson } from '../types'
import { cn } from './ui/utils'

interface LessonOutlineProps {
  course: Course
  activeLesson: Lesson
}

export const LessonOutline = ({ course, activeLesson }: LessonOutlineProps) => {
  const { t } = useTranslation()

  return (
    <div className="space-y-4">
      <div>
        <p className="text-[0.7rem] uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
          {t('lesson.courseOutline')}
        </p>
        <h3 className="mt-2 break-words font-display text-lg font-semibold text-ink dark:text-white">
          {course.title}
        </h3>
      </div>
      <div className="space-y-2">
        {course.lessons.map((lesson) => (
          <Link
            key={lesson.id}
            to={`/lesson/${course.id}/${lesson.id}`}
            className={cn(
              'flex items-start gap-3 rounded-xl border border-slate-200/70 bg-white/80 px-4 py-3 text-sm text-slate-600 shadow-sm transition hover:border-teal/40 dark:border-slate-800/80 dark:bg-slate-900/80 dark:text-slate-200',
              lesson.id === activeLesson.id &&
                'border-teal/60 bg-teal/5 text-ink dark:border-teal-300/60 dark:bg-teal-500/15 dark:text-white',
            )}
          >
            <BookOpenCheck size={16} className="mt-0.5 text-teal dark:text-teal-300" />
            <div className="min-w-0">
              <p className="break-words font-semibold text-slate-700 dark:text-slate-100">
                {lesson.title}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {lesson.durationMinutes} {t('lesson.minutes')}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
