import type { ReactNode } from 'react'
import { Card, CardContent } from './ui/Card'

interface StatCardProps {
  label: string
  value: string
  helper?: string
  icon?: ReactNode
}

export const StatCard = ({ label, value, helper, icon }: StatCardProps) => (
  <Card>
    <CardContent className="flex items-start justify-between gap-4 pt-6">
      <div className="min-w-0">
        <p className="text-[0.7rem] uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
          {label}
        </p>
        <p className="mt-2 break-words font-display text-2xl font-semibold text-ink dark:text-white">
          {value}
        </p>
        {helper && (
          <p className="mt-2 break-words text-sm text-moss dark:text-slate-300">{helper}</p>
        )}
      </div>
      {icon && (
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-teal/10 text-teal dark:bg-teal-500/20 dark:text-teal-200">
          {icon}
        </div>
      )}
    </CardContent>
  </Card>
)
