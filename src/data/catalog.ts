import type {
  Attempt,
  Course,
  CourseCategory,
  LeaderboardEntry,
  Progress,
  User,
} from '../types'

const sourcePool = [
  'MDN Web Docs',
  'Khan Academy',
  'MIT OpenCourseWare',
  'Wikipedia (API)',
  'FreeCodeCamp',
]

const categoryLessonThemes: Record<CourseCategory, string[]> = {
  Programming: [
    'Foundations & tooling',
    'Core syntax patterns',
    'Data structures & flow',
    'Working with real data',
    'Mini project walkthrough',
  ],
  Languages: [
    'Sounds & essential phrases',
    'Everyday conversations',
    'Grammar building blocks',
    'Listening and reading practice',
    'Speaking confidence drills',
  ],
  'School subjects': [
    'Conceptual overview',
    'Key formulas & facts',
    'Worked examples',
    'Practice set',
    'Checkpoint review',
  ],
}

const courseDefinitions = [
  {
    title: 'Python basics',
    category: 'Programming' as const,
    level: 'Beginner',
    description:
      'Learn Python syntax, data types, and the building blocks for automation and data work.',
    tags: ['Python', 'Beginner', 'Automation'],
  },
  {
    title: 'SQL basics',
    category: 'Programming' as const,
    level: 'Beginner',
    description: 'Write queries, filter data, and understand relational database thinking.',
    tags: ['SQL', 'Data', 'Databases'],
  },
  {
    title: 'PostgreSQL',
    category: 'Programming' as const,
    level: 'Intermediate',
    description:
      'Model data, optimize queries, and explore PostgreSQL features used in production.',
    tags: ['PostgreSQL', 'Indexes', 'Performance'],
  },
  {
    title: 'Django web apps',
    category: 'Programming' as const,
    level: 'Intermediate',
    description:
      'Build full-stack Django applications with models, views, templates, and REST APIs.',
    tags: ['Django', 'Web', 'Backend'],
  },
  {
    title: 'HTML/CSS',
    category: 'Programming' as const,
    level: 'Beginner',
    description:
      'Craft accessible layouts, responsive pages, and modern styling foundations.',
    tags: ['HTML', 'CSS', 'Responsive'],
  },
  {
    title: 'Bootstrap',
    category: 'Programming' as const,
    level: 'Beginner',
    description:
      'Rapidly prototype interfaces using Bootstrap utility classes and components.',
    tags: ['Bootstrap', 'UI', 'Components'],
  },
  {
    title: 'JavaScript',
    category: 'Programming' as const,
    level: 'Beginner',
    description:
      'Understand JavaScript fundamentals, the DOM, and async programming.',
    tags: ['JavaScript', 'Frontend', 'DOM'],
  },
  {
    title: 'React',
    category: 'Programming' as const,
    level: 'Intermediate',
    description:
      'Build component-driven interfaces with state, effects, and modern React patterns.',
    tags: ['React', 'Components', 'Hooks'],
  },
  {
    title: 'English A1–B2',
    category: 'Languages' as const,
    level: 'Beginner to Intermediate',
    description:
      'Structured English learning path from fundamentals to independent communication.',
    tags: ['English', 'A1', 'B2'],
  },
  {
    title: 'Russian beginner',
    category: 'Languages' as const,
    level: 'Beginner',
    description:
      'Learn Cyrillic, survival phrases, and essential grammar for Russian learners.',
    tags: ['Russian', 'Beginner', 'Grammar'],
  },
  {
    title: 'Russian intermediate',
    category: 'Languages' as const,
    level: 'Intermediate',
    description:
      'Expand fluency with complex grammar, reading comprehension, and speaking drills.',
    tags: ['Russian', 'Intermediate', 'Fluency'],
  },
  {
    title: 'Math',
    category: 'School subjects' as const,
    level: 'Core',
    description:
      'Arithmetic, algebra, geometry, and trigonometry with practice-focused guidance.',
    tags: ['Math', 'Algebra', 'Geometry'],
  },
  {
    title: 'Chemistry',
    category: 'School subjects' as const,
    level: 'Core',
    description:
      'Explore atoms, reactions, and lab reasoning with structured explanations.',
    tags: ['Chemistry', 'Lab', 'Reactions'],
  },
  {
    title: 'Biology',
    category: 'School subjects' as const,
    level: 'Core',
    description:
      'Understand cells, ecosystems, and human systems with guided practice.',
    tags: ['Biology', 'Cells', 'Systems'],
  },
]

const slugify = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '')

const buildLesson = (
  courseId: string,
  courseTitle: string,
  theme: string,
  index: number,
) => {
  const lessonId = `${courseId}-lesson-${index + 1}`
  const source = sourcePool[index % sourcePool.length]

  return {
    id: lessonId,
    courseId,
    title: `${courseTitle}: ${theme}`,
    summary: `A structured walkthrough of ${theme.toLowerCase()} for ${courseTitle}.`,
    durationMinutes: 18 + index * 4,
    theory: [
      `Learning focus: ${theme.toLowerCase()} in the context of ${courseTitle}.`,
      `We introduce the key terms, then connect them to real-world practice.`,
      `Use the short checks to ensure you can explain concepts in your own words.`,
      `Think about how this topic appears in daily tasks, projects, or tests.`,
      `This lesson is adapted from neutral educational references like ${source}.`,
    ],
    examples: [
      `Worked example 1: A guided scenario tailored for ${courseTitle}.`,
      `Worked example 2: A common pitfall and how to resolve it.`,
      `Worked example 3: Translating the concept into a practical task.`,
    ],
    exercises: [
      {
        id: `${lessonId}-ex-1`,
        prompt: `Summarize the key idea from ${theme.toLowerCase()} in 2 sentences.`,
        type: 'short-answer' as const,
        hint: 'Use the lesson summary as your outline.',
      },
      {
        id: `${lessonId}-ex-2`,
        prompt: `List three real-life scenarios where ${courseTitle} matters.`,
        type: 'short-answer' as const,
        hint: 'Think projects, exams, or workplace tasks.',
      },
      {
        id: `${lessonId}-ex-3`,
        prompt: `Solve a practice prompt related to ${theme.toLowerCase()}.`,
        type: 'practice' as const,
        hint: 'Follow the worked examples from this lesson.',
      },
    ],
    quiz: {
      id: `${lessonId}-quiz`,
      title: `${courseTitle} quick check`,
      type: 'lesson-review' as const,
      questions: [
        {
          id: `${lessonId}-q1`,
          prompt: `Which statement best captures the focus of ${theme.toLowerCase()}?`,
          options: [
            'It is mainly about memorization only.',
            'It connects core concepts to practical usage.',
            'It avoids real-world examples.',
            'It is optional for mastering the course.',
          ],
          answerIndex: 1,
          explanation: 'The theme connects foundational ideas with practical usage.',
        },
        {
          id: `${lessonId}-q2`,
          prompt: `What is a productive next step after this lesson?`,
          options: [
            'Skip practice tasks.',
            'Complete at least one exercise and review feedback.',
            'Wait until the final exam.',
            'Ignore the examples.',
          ],
          answerIndex: 1,
          explanation: 'Practice cements the concepts and reveals gaps early.',
        },
        {
          id: `${lessonId}-q3`,
          prompt: `Which resource style supports this lesson?`,
          options: [
            'Short, structured explanations with practice.',
            'Only long-form lectures.',
            'Only memorization drills.',
            'No external references.',
          ],
          answerIndex: 0,
          explanation: 'The lesson blends structured explanations and practice.',
        },
      ],
    },
    sources: [source, sourcePool[(index + 2) % sourcePool.length]],
  }
}

const buildExam = (courseId: string, courseTitle: string, type: 'mid-course' | 'final') => ({
  id: `${courseId}-${type}-exam`,
  title: `${courseTitle} ${type === 'mid-course' ? 'mid-course exam' : 'final exam'}`,
  type,
  questions: [
    {
      id: `${courseId}-${type}-q1`,
      prompt: `What is the main outcome expected by the ${type} exam?`,
      options: [
        'Recall isolated facts only.',
        'Demonstrate structured understanding and applied skills.',
        'Skip practice and rely on guessing.',
        'Avoid reviewing earlier lessons.',
      ],
      answerIndex: 1,
      explanation: 'Exams measure both understanding and the ability to apply skills.',
    },
    {
      id: `${courseId}-${type}-q2`,
      prompt: `Which preparation strategy best supports success?`,
      options: [
        'Review lesson summaries and complete practice tasks.',
        'Ignore feedback and move forward quickly.',
        'Avoid quizzes to save time.',
        'Study only the last lesson.',
      ],
      answerIndex: 0,
      explanation: 'Steady review and practice deliver the strongest results.',
    },
  ],
})

export const courses: Course[] = courseDefinitions.map((course) => {
  const id = slugify(course.title)
  const lessons = categoryLessonThemes[course.category].map((theme, index) =>
    buildLesson(id, course.title, theme, index),
  )

  return {
    id,
    ...course,
    lessons,
    midCourseExam: buildExam(id, course.title, 'mid-course'),
    finalExam: buildExam(id, course.title, 'final'),
    totalLessons: lessons.length,
    estimatedHours: Math.round(lessons.reduce((sum, l) => sum + l.durationMinutes, 0) / 60),
  }
})

export const featuredCourses = courses.slice(0, 6)

export const user: User = {
  id: 'user-001',
  name: 'Abubakr Hassan',
  email: 'abubakr@skynetic.ai',
  role: 'Learner',
  enrolledCourseIds: courses.slice(0, 6).map((course) => course.id),
  badges: ['Consistency Builder', 'Fast Starter', 'Curious Mind'],
  rank: 18,
  streakDays: 12,
  avatarColor: '#0F766E',
}

export const progressRecords: Progress[] = user.enrolledCourseIds.map((courseId, index) => {
  const course = courses.find((item) => item.id === courseId)
  const completedLessons = course ? course.lessons.slice(0, 2 + (index % 3)).map((l) => l.id) : []

  return {
    id: `progress-${courseId}`,
    userId: user.id,
    courseId,
    completedLessonIds: completedLessons,
    averageScore: 78 + (index % 4) * 4,
    nextLessonId: course?.lessons[completedLessons.length]?.id ?? course?.lessons[0].id ?? '',
    lastStudiedAt: '2026-02-08',
    examResults: {
      lessonReview: 82 + (index % 3) * 3,
      midCourse: 74 + (index % 3) * 4,
      final: 88 - (index % 2) * 5,
    },
  }
})

export const attempts: Attempt[] = progressRecords.flatMap((progress) =>
  [
    {
      id: `${progress.id}-lesson-review`,
      quizId: `${progress.courseId}-lesson-review`,
      score: progress.examResults.lessonReview,
      maxScore: 100,
      completedAt: '2026-02-07',
    },
    {
      id: `${progress.id}-mid-course`,
      quizId: `${progress.courseId}-mid-course`,
      score: progress.examResults.midCourse,
      maxScore: 100,
      completedAt: '2026-02-08',
    },
    {
      id: `${progress.id}-final-exam`,
      quizId: `${progress.courseId}-final`,
      score: progress.examResults.final,
      maxScore: 100,
      completedAt: '2026-02-09',
    },
  ],
)

export const leaderboard: LeaderboardEntry[] = [
  { id: 'lb-1', name: 'Maya', points: 1840 },
  { id: 'lb-2', name: 'Rafael', points: 1725 },
  { id: 'lb-3', name: 'You', points: 1680 },
  { id: 'lb-4', name: 'Lina', points: 1600 },
  { id: 'lb-5', name: 'Jon', points: 1540 },
]
