import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { Menu, Moon, Sparkles, Sun, X } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Button } from '../ui/Button'
import { cn } from '../ui/utils'
import { useTheme } from '../../contexts/ThemeContext'
import { useAuth } from '../../contexts/AuthContext'

export const TopNav = () => {
  const [open, setOpen] = useState(false)
  const { t, i18n } = useTranslation()
  const { theme, toggleTheme } = useTheme()
  const { user, signOut } = useAuth()

  const navItems = [
    { label: t('nav.home'), to: '/' },
    { label: t('nav.catalog'), to: '/catalog' },
    { label: t('nav.lesson'), to: '/lesson' },
    { label: t('nav.dashboard'), to: '/dashboard' },
    { label: t('nav.profile'), to: '/profile' },
  ]

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/60 bg-white/75 backdrop-blur-xl shadow-[0_10px_30px_-22px_rgba(15,23,42,0.35)] transition-colors dark:border-slate-800/70 dark:bg-slate-950/70 dark:shadow-[0_12px_30px_-20px_rgba(0,0,0,0.7)]">
      <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center gap-4 px-6 py-4 lg:flex-nowrap">
        <Link to="/" className="flex min-w-0 items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal text-white shadow-soft dark:bg-teal-400 dark:text-slate-900">
            <Sparkles size={20} />
          </span>
          <div className="min-w-0">
            <p className="font-display text-lg font-semibold tracking-tight text-ink dark:text-white">
              {t('app.name')}
            </p>
            <p className="text-xs text-moss text-pretty dark:text-slate-400">
              {t('app.tagline')}
            </p>
          </div>
        </Link>

        <nav className="hidden min-w-0 flex-1 flex-wrap items-center gap-4 text-sm font-semibold text-slate-600 lg:flex lg:justify-center">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                cn(
                  'break-words text-pretty leading-snug transition-colors hover:text-ink dark:hover:text-white',
                  isActive ? 'text-ink dark:text-white' : 'text-slate-600 dark:text-slate-300',
                )
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden shrink-0 items-center gap-3 lg:flex">
          <select
            value={i18n.language}
            onChange={(event) => i18n.changeLanguage(event.target.value)}
            className="rounded-full border border-slate-200/70 bg-white/80 px-3 py-2 text-xs font-semibold text-slate-600 shadow-sm transition-colors dark:border-slate-700/80 dark:bg-slate-900/80 dark:text-slate-200"
            aria-label={t('language.label')}
          >
            <option value="en">{t('language.english')}</option>
            <option value="ru">{t('language.russian')}</option>
            <option value="uz">{t('language.uzbek')}</option>
          </select>
          <button
            onClick={toggleTheme}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200/70 text-slate-600 transition-colors hover:text-ink dark:border-slate-700/80 dark:text-slate-200 dark:hover:text-white"
            aria-label={t('theme.toggle')}
          >
            {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
          </button>
          {user ? (
            <Button variant="outline" size="sm" onClick={() => void signOut()}>
              {t('nav.logout')}
            </Button>
          ) : (
            <>
              <Button variant="ghost" size="sm" asChild>
                <Link to="/login">{t('nav.login')}</Link>
              </Button>
              <Button size="sm" asChild>
                <Link to="/register">{t('nav.register')}</Link>
              </Button>
            </>
          )}
        </div>

        <button
          className="ml-auto rounded-full border border-slate-200/70 p-2 text-slate-600 transition hover:text-ink dark:border-slate-700/80 dark:text-slate-200 dark:hover:text-white lg:hidden"
          onClick={() => setOpen((state) => !state)}
          aria-label={t('nav.toggle')}
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {open && (
        <div className="border-t border-slate-200/60 bg-white/95 px-6 pb-6 pt-4 shadow-soft dark:border-slate-800/70 dark:bg-slate-950/90 lg:hidden">
          <div className="flex flex-col gap-4 text-sm font-semibold text-slate-600 dark:text-slate-300">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  cn(
                    'break-words text-pretty leading-snug transition-colors hover:text-ink dark:hover:text-white',
                    isActive ? 'text-ink dark:text-white' : '',
                  )
                }
              >
                {item.label}
              </NavLink>
            ))}
          </div>
          <div className="mt-5 flex flex-col gap-3">
            <div className="flex gap-3">
              <select
                value={i18n.language}
                onChange={(event) => i18n.changeLanguage(event.target.value)}
                className="flex-1 rounded-full border border-slate-200/70 bg-white/80 px-3 py-2 text-xs font-semibold text-slate-600 shadow-sm transition-colors dark:border-slate-700/80 dark:bg-slate-900/80 dark:text-slate-200"
                aria-label={t('language.label')}
              >
                <option value="en">{t('language.english')}</option>
                <option value="ru">{t('language.russian')}</option>
                <option value="uz">{t('language.uzbek')}</option>
              </select>
              <button
                onClick={toggleTheme}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200/70 text-slate-600 transition-colors hover:text-ink dark:border-slate-700/80 dark:text-slate-200 dark:hover:text-white"
                aria-label={t('theme.toggle')}
              >
                {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
              </button>
            </div>
            {user ? (
              <Button variant="outline" size="sm" onClick={() => void signOut()}>
                {t('nav.logout')}
              </Button>
            ) : (
              <div className="flex gap-3">
                <Button variant="outline" size="sm" className="w-full" asChild>
                  <Link to="/login">{t('nav.login')}</Link>
                </Button>
                <Button size="sm" className="w-full" asChild>
                  <Link to="/register">{t('nav.register')}</Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  )
}
