import { BookOpen, Clock3 } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import type { Course } from '../types'
import { useCourseProgress } from '../hooks/useCourseProgress'
import { Badge } from './ui/Badge'
import { Button } from './ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from './ui/Card'
import { Progress } from './ui/Progress'

interface CourseCardProps {
  course: Course
  showProgress?: boolean
}

export const CourseCard = ({ course, showProgress }: CourseCardProps) => {
  const progress = useCourseProgress(course.id)
  const { t } = useTranslation()

  return (
    <Card className="flex h-full flex-col">
      <CardHeader>
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <CardTitle className="break-words font-display text-xl leading-snug text-ink dark:text-white">
              {course.title}
            </CardTitle>
            <p className="mt-2 break-words text-sm text-moss dark:text-slate-300">
              {course.description}
            </p>
          </div>
          <Badge className="shrink-0">{course.level}</Badge>
        </div>
      </CardHeader>
      <CardContent className="mt-auto space-y-4">
        <div className="flex flex-wrap gap-2">
          {course.tags.map((tag) => (
            <Badge
              key={tag}
              className="bg-slate-50/80 text-slate-500 dark:bg-slate-800/70 dark:text-slate-100"
            >
              {tag}
            </Badge>
          ))}
        </div>
        <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-2">
            <BookOpen size={14} /> {course.totalLessons} {t('common.lessons')}
          </div>
          <div className="flex items-center gap-2">
            <Clock3 size={14} /> {course.estimatedHours} {t('common.hours')}
          </div>
        </div>
        {showProgress && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
              <span>{t('common.progress')}</span>
              <span>{progress.percentage}%</span>
            </div>
            <Progress value={progress.percentage} />
          </div>
        )}
        <Button asChild size="sm" className="w-full">
          <Link to={`/lesson/${course.id}`}>{t('course.open')}</Link>
        </Button>
      </CardContent>
    </Card>
  )
}
