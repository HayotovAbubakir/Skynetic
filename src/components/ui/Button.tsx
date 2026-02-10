import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from './utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 rounded-full break-words text-center text-sm font-semibold leading-snug whitespace-normal transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal/50 focus-visible:ring-offset-2 focus-visible:ring-offset-white disabled:pointer-events-none disabled:opacity-50 dark:focus-visible:ring-teal-300/50 dark:focus-visible:ring-offset-slate-950',
  {
    variants: {
      variant: {
        primary:
          'bg-teal text-white shadow-soft hover:bg-teal/90 dark:bg-teal-400 dark:text-slate-900 dark:hover:bg-teal-300',
        secondary:
          'bg-white/80 text-ink shadow-soft hover:bg-white dark:bg-slate-900/80 dark:text-slate-100 dark:hover:bg-slate-800/70',
        ghost:
          'bg-transparent text-ink hover:bg-slate-100/70 dark:text-slate-100 dark:hover:bg-slate-800/60',
        outline:
          'border border-slate-200/70 text-ink hover:bg-white/70 dark:border-slate-700/80 dark:text-slate-100 dark:hover:bg-slate-800/60',
      },
      size: {
        sm: 'min-h-[36px] px-4 py-2',
        md: 'min-h-[44px] px-6 py-2.5',
        lg: 'min-h-[48px] px-7 py-3 text-base',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  },
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button'

    return (
      <Comp
        ref={ref}
        className={cn(buttonVariants({ variant, size }), className)}
        {...props}
      />
    )
  },
)

Button.displayName = 'Button'
