import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

/**
 * Badge — Design System BOB.OS
 *
 * DNA Visual:
 * - Fundo sólido por cor semântica
 * - Caixa alta + tracking amplo
 * - Compacto, sem border-radius excessivo
 */
const badgeVariants = cva(
  [
    'inline-flex items-center gap-1',
    'font-body font-600 uppercase',
    'text-[0.6rem] tracking-[0.12em]',
    'px-2 py-0.5 rounded-[var(--radius-sm)]',
    'whitespace-nowrap',
  ].join(' '),
  {
    variants: {
      variant: {
        default:  'bg-[var(--color-surface-raised)] text-[var(--color-text-secondary)] border border-[var(--color-border)]',
        red:      'bg-[var(--color-brand-red)] text-white',
        yellow:   'bg-[var(--color-brand-yellow)] text-black',
        green:    'bg-[var(--color-brand-green)] text-black',
        blue:     'bg-[var(--color-brand-blue)] text-white',
        pink:     'bg-[var(--color-brand-pink)] text-white',
        purple:   'bg-[var(--color-brand-purple)] text-white',
        outline:  'bg-transparent text-[var(--color-text-secondary)] border border-[var(--color-border)]',
        success:  'bg-[var(--color-success)]/15 text-[var(--color-success)] border border-[var(--color-success)]/30',
        warning:  'bg-[var(--color-warning)]/15 text-[var(--color-warning)] border border-[var(--color-warning)]/30',
        danger:   'bg-[var(--color-danger)]/15 text-[var(--color-danger)] border border-[var(--color-danger)]/30',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {
  dot?: boolean
}

function Badge({ className, variant, dot, children, ...props }: BadgeProps) {
  return (
    <span className={cn(badgeVariants({ variant, className }))} {...props}>
      {dot && (
        <span
          className={cn(
            'w-1.5 h-1.5 rounded-full flex-shrink-0',
            variant === 'success' && 'bg-[var(--color-success)]',
            variant === 'warning' && 'bg-[var(--color-warning)]',
            variant === 'danger' && 'bg-[var(--color-danger)]',
            !variant || variant === 'default' && 'bg-[var(--color-text-muted)]',
          )}
        />
      )}
      {children}
    </span>
  )
}

export { Badge, badgeVariants }
