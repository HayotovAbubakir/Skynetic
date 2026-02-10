import * as React from 'react'
import { cn } from './utils'

export const Badge = React.forwardRef<HTMLSpanElement, React.HTMLAttributes<HTMLSpanElement>>(
  ({ className, ...props }, ref) => (
    <span
      ref={ref}
      className={cn(
        'inline-flex items-center rounded-full border border-slate-200/70 bg-slate-50/80 px-3 py-1 text-center text-xs font-semibold text-slate-600 transition-colors break-words dark:border-slate-700/80 dark:bg-slate-900/60 dark:text-slate-100',
        className,
      )}
      {...props}
    />
  ),
)

Badge.displayName = 'Badge'
