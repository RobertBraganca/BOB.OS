import * as React from 'react'
import { cn } from '@/lib/utils'

/**
 * Card — Design System BOB.OS
 *
 * DNA Visual:
 * - Fundo #101010, borda #222
 * - Sem shadow ornamental
 * - Padding generoso e consistente
 * - Linha superior colorida opcional (accent)
 */

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  accent?: 'red' | 'yellow' | 'green' | 'blue' | 'pink' | 'purple' | 'none'
  hoverable?: boolean
}

const ACCENT_COLORS = {
  red:    'before:bg-[var(--color-brand-red)]',
  yellow: 'before:bg-[var(--color-brand-yellow)]',
  green:  'before:bg-[var(--color-brand-green)]',
  blue:   'before:bg-[var(--color-brand-blue)]',
  pink:   'before:bg-[var(--color-brand-pink)]',
  purple: 'before:bg-[var(--color-brand-purple)]',
  none:   '',
}

function Card({ className, accent = 'none', hoverable = false, children, ...props }: CardProps) {
  return (
    <div
      className={cn(
        'relative bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-lg)]',
        'overflow-hidden',
        hoverable && 'transition-colors duration-150 hover:border-[var(--color-text-muted)] cursor-pointer',
        accent !== 'none' && [
          'before:absolute before:top-0 before:left-0 before:right-0 before:h-[2px]',
          ACCENT_COLORS[accent],
        ],
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

function CardHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('flex flex-col gap-1 p-5 pb-0', className)}
      {...props}
    />
  )
}

function CardTitle({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3
      className={cn('font-display font-700 text-display-sm text-[var(--color-text)]', className)}
      {...props}
    />
  )
}

function CardDescription({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p
      className={cn('text-xs text-[var(--color-text-muted)] leading-relaxed', className)}
      {...props}
    />
  )
}

function CardContent({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('p-5', className)}
      {...props}
    />
  )
}

function CardFooter({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('flex items-center gap-3 p-5 pt-0', className)}
      {...props}
    />
  )
}

// ─── MetricCard ─────────────────────────────────────────────────────────────
// Card especializado para exibição de métricas numéricas grandes

interface MetricCardProps {
  label: string
  value: string
  sublabel?: string
  trend?: { direction: 'up' | 'down' | 'neutral'; label: string }
  accent?: CardProps['accent']
  className?: string
  size?: 'sm' | 'md' | 'lg'
}

function MetricCard({ label, value, sublabel, trend, accent, className, size = 'md' }: MetricCardProps) {
  return (
    <Card accent={accent} className={className}>
      <CardContent className={cn(
        'flex flex-col',
        size === 'sm' && 'p-4 gap-2',
        size === 'md' && 'p-5 gap-3',
        size === 'lg' && 'p-6 gap-4',
      )}>
        <span className="label-uppercase">{label}</span>
        <div className="flex items-end gap-2">
          <span
            className={cn(
              'numeric-display font-900 text-[var(--color-text)] leading-none',
              size === 'sm' && 'text-2xl',
              size === 'md' && 'text-display-md',
              size === 'lg' && 'text-display-lg',
            )}
          >
            {value}
          </span>
          {trend && (
            <span
              className={cn(
                'text-xs font-600 mb-1',
                trend.direction === 'up' && 'text-[var(--color-success)]',
                trend.direction === 'down' && 'text-[var(--color-danger)]',
                trend.direction === 'neutral' && 'text-[var(--color-text-muted)]',
              )}
            >
              {trend.direction === 'up' ? '↑' : trend.direction === 'down' ? '↓' : '→'} {trend.label}
            </span>
          )}
        </div>
        {sublabel && (
          <span className="text-xs text-[var(--color-text-muted)]">{sublabel}</span>
        )}
      </CardContent>
    </Card>
  )
}

export { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter, MetricCard }
