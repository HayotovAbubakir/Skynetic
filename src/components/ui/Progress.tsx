import * as React from 'react'
import { cn } from './utils'

export const Progress = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { value: number }
>(({ className, value, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('h-3 w-full rounded-full bg-slate-200/70 dark:bg-slate-800/80', className)}
    {...props}
  >
    <div
      className="h-full rounded-full bg-teal transition-all dark:bg-teal-400"
      style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
    />
  </div>
))

Progress.displayName = 'Progress'
