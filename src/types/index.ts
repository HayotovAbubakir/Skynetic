export type CourseCategory = 'Programming' | 'Languages' | 'School subjects'

export type QuizType = 'lesson-review' | 'mid-course' | 'final'

export type InteractiveTask =
  | {
      type: 'math'
      /** High-level description of the task, can include LaTeX like \\(x^2\\). */
      prompt: string
      /** Optional worked example or hint, usually also shown in plain text. */
      hint?: string
      /** Optional LaTeX snippet that can be rendered with a math component. */
      latexExample?: string
      /** Short textual description of the expected solution or rubric. */
      solution: string
    }
  | {
      type: 'code'
      /** Target environment for the playground or code snippet. */
      language: 'html-css' | 'git' | 'firebase' | 'mui'
      /** Natural-language instructions for the task. */
      instructions: string
      /** Starter code that will be loaded into a playground or editor. */
      starterCode: string
      /** Optional notes about what a good solution should look like. */
      solutionNotes?: string
    }

export interface Exercise {
  id: string
  prompt: string
  type: 'short-answer' | 'practice' | 'quiz'
  hint?: string
}

export interface QuizQuestion {
  id: string
  prompt: string
  options: string[]
  answerIndex: number
  explanation: string
}

export interface Quiz {
  id: string
  title: string
  type: QuizType
  questions: QuizQuestion[]
}

export interface Lesson {
  id: string
  courseId: string
  title: string
  summary: string
  durationMinutes: number
  theory: string[]
  examples: string[]
  exercises: Exercise[]
  quiz: Quiz
  sources: string[]
  /**
   * Rich lesson content blocks used by the new course engine.
   * When present, this should be considered the source of truth for text rendering.
   */
  fullContent?: string[]
  /**
   * A narration-friendly version of the lesson text, optimized for TTS.
   */
  voiceScript?: string
  /**
   * Optional structured interactive task used for grading and playgrounds.
   */
  interactiveTask?: InteractiveTask
}

export interface Course {
  id: string
  title: string
  category: CourseCategory
  level: string
  description: string
  tags: string[]
  lessons: Lesson[]
  midCourseExam: Quiz
  finalExam: Quiz
  totalLessons: number
  estimatedHours: number
}

export interface Attempt {
  id: string
  quizId: string
  score: number
  maxScore: number
  completedAt: string
}

export interface ExerciseSubmission {
  exerciseId: string
  answer: string
  submittedAt: string
}

export interface LessonProgress {
  lessonId: string
  exercises: ExerciseSubmission[]
  quizScore?: number
  quizMaxScore?: number
  completedAt?: string
}

export interface Progress {
  id: string
  userId: string
  courseId: string
  completedLessonIds: string[]
  averageScore: number
  nextLessonId: string
  lastStudiedAt: string
  examResults: {
    lessonReview: number
    midCourse: number
    final: number
  }
}

export interface User {
  id: string
  name: string
  email: string
  role: 'Learner' | 'Instructor' | 'Admin'
  enrolledCourseIds: string[]
  badges: string[]
  rank: number
  streakDays: number
  avatarColor: string
}

export interface LeaderboardEntry {
  id: string
  name: string
  points: number
}
