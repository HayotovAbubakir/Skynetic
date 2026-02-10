import { motion } from 'framer-motion'
import { ArrowUpRight, GraduationCap, LineChart, Sparkles } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { CourseCard } from '../components/CourseCard'
import { StatCard } from '../components/StatCard'
import { Button } from '../components/ui/Button'
import { Card, CardContent } from '../components/ui/Card'
import { featuredCourses } from '../data/catalog'

export const Home = () => {
  const { t } = useTranslation()

  const stats = [
    {
      label: t('home.stats.learners.label'),
      value: '42k+',
      helper: t('home.stats.learners.helper'),
    },
    {
      label: t('home.stats.sessions.label'),
      value: '310k',
      helper: t('home.stats.sessions.helper'),
    },
    {
      label: t('home.stats.completion.label'),
      value: '86%',
      helper: t('home.stats.completion.helper'),
    },
  ]

  const valueProps = [
    {
      title: t('home.value.aiTitle'),
      description: t('home.value.aiBody'),
      icon: <Sparkles size={20} className="text-teal dark:text-teal-300" />,
    },
    {
      title: t('home.value.journeyTitle'),
      description: t('home.value.journeyBody'),
      icon: <GraduationCap size={20} className="text-teal dark:text-teal-300" />,
    },
    {
      title: t('home.value.insightTitle'),
      description: t('home.value.insightBody'),
      icon: <LineChart size={20} className="text-teal dark:text-teal-300" />,
    },
  ]

  return (
    <div className="space-y-14">
      <section className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-6"
        >
          <p className="text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-teal dark:text-teal-300">
            {t('home.eyebrow')}
          </p>
          <h1 className="text-balance font-display text-4xl font-semibold leading-[1.1] text-ink dark:text-white md:text-5xl">
            {t('home.title')}
          </h1>
          <p className="text-pretty max-w-xl text-base text-slate-600 dark:text-slate-300 md:text-lg">
            {t('home.subtitle')}
          </p>
          <div className="flex flex-wrap gap-3">
            <Button asChild size="lg">
              <Link to="/catalog">
                {t('home.ctaPrimary')} <ArrowUpRight size={18} />
              </Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link to="/dashboard">{t('home.ctaSecondary')}</Link>
            </Button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="rounded-3xl border border-slate-200/60 bg-white/70 p-6 shadow-soft transition-colors dark:border-slate-800/70 dark:bg-slate-900/70"
        >
          <div className="grid gap-4">
            {stats.map((stat) => (
              <StatCard key={stat.label} {...stat} />
            ))}
          </div>
        </motion.div>
      </section>

      <section className="grid gap-6 lg:grid-cols-3">
        {valueProps.map((item) => (
          <Card key={item.title} className="border-slate-200/60">
            <CardContent className="space-y-3 pt-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-teal/10 dark:bg-teal-500/20">
                {item.icon}
              </div>
              <h3 className="break-words font-display text-lg font-semibold text-ink dark:text-white">
                {item.title}
              </h3>
              <p className="text-pretty text-sm text-slate-600 dark:text-slate-300">
                {item.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </section>

      <section className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="min-w-0">
            <p className="text-[0.7rem] uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
              {t('home.featured')}
            </p>
            <h2 className="mt-2 break-words font-display text-2xl font-semibold text-ink dark:text-white">
              {t('home.featuredTitle')}
            </h2>
          </div>
          <Button variant="ghost" asChild>
            <Link to="/catalog">{t('home.browseAll')}</Link>
          </Button>
        </div>
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {featuredCourses.map((course) => (
            <motion.div
              key={course.id}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
            >
              <CourseCard course={course} />
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  )
}
