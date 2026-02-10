import type { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { TopNav } from './TopNav'

interface AppShellProps {
  children: ReactNode
}

export const AppShell = ({ children }: AppShellProps) => {
  const { t } = useTranslation()

  return (
    <div className="min-h-screen break-words text-slate-900 antialiased transition-colors dark:text-slate-100">
      <TopNav />
      <main className="mx-auto w-full max-w-6xl px-6 py-10 lg:py-14">{children}</main>
      <footer className="border-t border-slate-200/60 bg-white/70 transition-colors dark:border-slate-800/70 dark:bg-slate-950/70">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-3 px-6 py-8 text-sm text-slate-500 dark:text-slate-400 md:flex-row md:items-center md:justify-between">
          <span>{t('app.footerLeft')}</span>
          <span>{t('app.footerRight')}</span>
        </div>
      </footer>
    </div>
  )
}
