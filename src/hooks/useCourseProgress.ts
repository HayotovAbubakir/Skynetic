import { useMemo } from 'react'
import { useAppStore } from '../features/appStore'

export const useCourseProgress = (courseId: string) => {
  const { courses, progress } = useAppStore()

  return useMemo(() => {
    const course = courses.find((item) => item.id === courseId)
    const record = progress.find((item) => item.courseId === courseId)
    if (!course || !record) {
      return { percentage: 0, completed: 0, total: 0 }
    }

    const total = course.lessons.length
    const completed = record.completedLessonIds.length
    const percentage = total === 0 ? 0 : Math.round((completed / total) * 100)

    return { percentage, completed, total }
  }, [courses, progress, courseId])
}
