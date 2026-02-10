import {
  Award,
  BarChart3,
  CalendarCheck,
  Crown,
  Target,
} from 'lucide-react'
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { useTranslation } from 'react-i18next'
import { CourseCard } from '../components/CourseCard'
import { StatCard } from '../components/StatCard'
import { Badge } from '../components/ui/Badge'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card'
import { useTheme } from '../contexts/ThemeContext'
import { useAppStore } from '../features/appStore'

export const Dashboard = () => {
  const { t } = useTranslation()
  const { theme } = useTheme()
  const { user, courses, progress, leaderboard } = useAppStore()

  const enrolledCourses = courses.filter((course) => user.enrolledCourseIds.includes(course.id))

  const averageScore = Math.round(
    progress.reduce((sum, record) => sum + record.averageScore, 0) / Math.max(progress.length, 1),
  )

  const chartData = progress.map((record) => ({
    name: courses.find((course) => course.id === record.courseId)?.title ?? 'Course',
    score: record.averageScore,
  }))

  const gridColor = theme === 'dark' ? '#1E293B' : '#E2E8F0'

  return (
    <div className="space-y-10">
      <div>
        <p className="text-[0.7rem] uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
          {t('dashboard.eyebrow')}
        </p>
        <h1 className="mt-2 break-words text-balance font-display text-3xl font-semibold text-ink dark:text-white">
          {t('dashboard.title', { name: user.name })}
        </h1>
        <p className="mt-2 text-pretty text-sm text-slate-600 dark:text-slate-300">
          {t('dashboard.subtitle')}
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        <StatCard label={t('dashboard.enrolled')} value={`${enrolledCourses.length}`} icon={<Target />} />
        <StatCard label={t('dashboard.averageScore')} value={`${averageScore}%`} icon={<BarChart3 />} />
        <StatCard label={t('dashboard.streak')} value={`${user.streakDays}`} icon={<CalendarCheck />} />
        <StatCard label={t('dashboard.rank')} value={`#${user.rank}`} icon={<Crown />} />
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">{t('dashboard.performance')}</CardTitle>
          </CardHeader>
          <CardContent className="h-[260px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ left: -10, right: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 10 }} />
                <Tooltip />
                <Line type="monotone" dataKey="score" stroke="#0F766E" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">{t('dashboard.leaderboard')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {leaderboard.map((entry, index) => (
              <div
                key={entry.id}
                className="flex items-start justify-between gap-3 rounded-xl border border-slate-200/70 bg-slate-50/80 px-4 py-3 text-sm text-slate-700 dark:border-slate-800/80 dark:bg-slate-800/70 dark:text-slate-100"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <span className="font-semibold text-slate-500 dark:text-slate-300">
                    {index + 1}
                  </span>
                  <span className="break-words font-medium">{entry.name}</span>
                </div>
                <Badge className="shrink-0 border-teal/20 bg-teal/10 text-teal dark:border-teal-500/40 dark:bg-teal-500/20 dark:text-teal-200">
                  {entry.points} {t('dashboard.points')}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <section className="space-y-6">
        <div className="flex items-center justify-between gap-4">
          <div className="min-w-0">
            <h2 className="break-words font-display text-2xl font-semibold text-ink dark:text-white">
              {t('dashboard.activeCourses')}
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">{t('dashboard.continue')}</p>
          </div>
          <Badge className="bg-slate-50/80 text-slate-500 dark:bg-slate-800/70 dark:text-slate-100">
            {enrolledCourses.length} {t('dashboard.enrolledBadge')}
          </Badge>
        </div>
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {enrolledCourses.map((course) => (
            <CourseCard key={course.id} course={course} showProgress />
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <div>
          <h2 className="break-words font-display text-2xl font-semibold text-ink dark:text-white">
            {t('dashboard.assessment')}
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {t('dashboard.assessmentHelp')}
          </p>
        </div>
        <div className="grid gap-4 lg:grid-cols-3">
          {progress.map((record) => {
            const course = courses.find((item) => item.id === record.courseId)
            if (!course) return null
            return (
              <Card key={record.id}>
                <CardContent className="space-y-3 pt-6">
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="min-w-0 break-words font-semibold text-slate-700 dark:text-slate-100">
                      {course.title}
                    </h3>
                    <Award size={18} className="shrink-0 text-teal dark:text-teal-300" />
                  </div>
                  <div className="space-y-2 text-sm text-slate-600 dark:text-slate-300">
                    <p>{t('dashboard.lessonReview')}: {record.examResults.lessonReview}%</p>
                    <p>{t('dashboard.midCourse')}: {record.examResults.midCourse}%</p>
                    <p>{t('dashboard.finalExam')}: {record.examResults.final}%</p>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </section>
    </div>
  )
}
