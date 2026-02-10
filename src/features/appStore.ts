import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { attempts, courses, leaderboard, progressRecords, user } from '../data/catalog'
import type {
  Attempt,
  Course,
  LeaderboardEntry,
  LessonProgress,
  Progress,
  User,
} from '../types'

type AppState = {
  user: User
  courses: Course[]
  progress: Progress[]
  attempts: Attempt[]
  leaderboard: LeaderboardEntry[]
  lessonProgress: Record<string, LessonProgress>
  activeCourseId: string | null
  setActiveCourse: (courseId: string) => void
  updateProgress: (courseId: string, data: Partial<Progress>) => void
  addAttempt: (attempt: Attempt) => void
  recordExercises: (lessonId: string, submissions: LessonProgress['exercises']) => void
  recordQuizScore: (
    courseId: string,
    lessonId: string,
    quizId: string,
    score: number,
    maxScore: number,
  ) => void
}

const completionThreshold = 70

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      user,
      courses,
      progress: progressRecords,
      attempts,
      leaderboard,
      lessonProgress: {},
      activeCourseId: null,
      setActiveCourse: (courseId) => set(() => ({ activeCourseId: courseId })),
      updateProgress: (courseId, data) =>
        set((state) => ({
          progress: state.progress.map((record) =>
            record.courseId === courseId ? { ...record, ...data } : record,
          ),
        })),
      addAttempt: (attempt) =>
        set((state) => ({
          attempts: [...state.attempts, attempt],
        })),
      recordExercises: (lessonId, submissions) =>
        set((state) => {
          const current = state.lessonProgress[lessonId]
          return {
            lessonProgress: {
              ...state.lessonProgress,
              [lessonId]: {
                lessonId,
                exercises: submissions,
                quizScore: current?.quizScore,
                quizMaxScore: current?.quizMaxScore,
                completedAt: current?.completedAt,
              },
            },
          }
        }),
      recordQuizScore: (courseId, lessonId, quizId, score, maxScore) =>
        set((state) => {
          const now = new Date().toISOString()
          const attempt: Attempt = {
            id: `${lessonId}-${Date.now()}`,
            quizId,
            score,
            maxScore,
            completedAt: now,
          }

          const lessonRecord: LessonProgress = {
            lessonId,
            exercises: state.lessonProgress[lessonId]?.exercises ?? [],
            quizScore: score,
            quizMaxScore: maxScore,
            completedAt: score >= completionThreshold ? now : undefined,
          }

          const updatedProgress = state.progress.map((record) => {
            if (record.courseId !== courseId) return record

            const completed = new Set(record.completedLessonIds)
            if (score >= completionThreshold) {
              completed.add(lessonId)
            }

            return {
              ...record,
              completedLessonIds: Array.from(completed),
              averageScore: Math.round(
                (record.averageScore + score) / 2,
              ),
              lastStudiedAt: now.slice(0, 10),
            }
          })

          return {
            attempts: [...state.attempts, attempt],
            lessonProgress: {
              ...state.lessonProgress,
              [lessonId]: lessonRecord,
            },
            progress: updatedProgress,
          }
        }),
    }),
    {
      name: 'skynetic-store',
      partialize: (state) => ({
        progress: state.progress,
        attempts: state.attempts,
        lessonProgress: state.lessonProgress,
        activeCourseId: state.activeCourseId,
        user: state.user,
      }),
    },
  ),
)
