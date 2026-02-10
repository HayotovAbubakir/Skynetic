import { useMemo, useState } from 'react'
import { Search } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { CourseCard } from '../components/CourseCard'
import { Input } from '../components/ui/Input'
import { courses } from '../data/catalog'
import type { CourseCategory } from '../types'

const categories: CourseCategory[] = ['Programming', 'Languages', 'School subjects']

export const CourseCatalog = () => {
  const [query, setQuery] = useState('')
  const { t } = useTranslation()
  const categoryLabels: Record<CourseCategory, string> = {
    Programming: t('categories.programming'),
    Languages: t('categories.languages'),
    'School subjects': t('categories.school'),
  }

  const filteredCourses = useMemo(() => {
    if (!query.trim()) return courses
    return courses.filter((course) =>
      `${course.title} ${course.description} ${course.tags.join(' ')}`
        .toLowerCase()
        .includes(query.toLowerCase()),
    )
  }, [query])

  return (
    <div className="space-y-10">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-[0.7rem] uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
            {t('catalog.eyebrow')}
          </p>
          <h1 className="mt-2 break-words text-balance font-display text-3xl font-semibold text-ink dark:text-white">
            {t('catalog.title')}
          </h1>
          <p className="mt-2 text-pretty max-w-2xl text-sm text-slate-600 dark:text-slate-300">
            {t('catalog.subtitle')}
          </p>
        </div>
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={t('catalog.searchPlaceholder')}
            className="pl-9"
          />
        </div>
      </div>

      {categories.map((category) => {
        const categoryCourses = filteredCourses.filter((course) => course.category === category)
        if (categoryCourses.length === 0) return null

        return (
          <section key={category} className="space-y-5">
            <div>
              <h2 className="break-words font-display text-2xl font-semibold text-ink dark:text-white">
                {categoryLabels[category]}
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                {categoryCourses.length} {t('catalog.available')}
              </p>
            </div>
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {categoryCourses.map((course) => (
                <CourseCard key={course.id} course={course} />
              ))}
            </div>
          </section>
        )
      })}
    </div>
  )
}
