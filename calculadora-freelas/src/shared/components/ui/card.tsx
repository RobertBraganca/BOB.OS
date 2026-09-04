import * as React from 'react'
import { cn } from '@/shared/lib/utils'

/**
 * Card — Design System BOB.OS (alinhado ao BOB Finanças)
 *
 * DNA Visual:
 * - Raio de card dedicado (16px, --radius-card), maior que o de qualquer
 *   bloco interno
 * - Fundo --color-surface, borda --color-border — sem shadow ornamental
 * - Padding generoso e consistente (p-5)
 * - `variant="slab"`: card de DESTAQUE, fundo escuro sólido — regra do
 *   Finanças é usar no máximo UM por tela (o "card mais importante"),
 *   nunca uma barra colorida por card (isso saiu, ver `accent` abaixo)
 */

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  /** @deprecated Sem equivalente no BOB Finanças — nenhum card novo deveria
   *  usar isto. Mantido só para não quebrar call sites antigos; prefira
   *  `variant="slab"` para o card de destaque de uma tela. */
  accent?: 'red' | 'yellow' | 'green' | 'blue' | 'pink' | 'purple' | 'none'
  /** Card de destaque escuro — no máximo um por tela. */
  variant?: 'default' | 'slab'
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

function Card({ className, accent = 'none', variant = 'default', hoverable = false, children, ...props }: CardProps) {
  return (
    <div
      className={cn(
        'relative rounded-[var(--radius-card)]',
        'overflow-hidden',
        variant === 'default' && 'bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-text)]',
        /* Re-aponta --color-text/-secondary/-muted para os tons "on-accent"
           dentro do escopo do card — mesma técnica do `.on-slab` do BOB
           Finanças: filhos (CardTitle, CardDescription, MetricCard) usam os
           tokens normais e se adaptam ao fundo escuro sem saber disso. */
        variant === 'slab' && [
          'bg-[var(--color-slab-accent-bg)] border border-[var(--color-slab-accent-line)]',
          '[--color-text:var(--color-on-accent-1)]',
          '[--color-text-secondary:var(--color-on-accent-2)]',
          '[--color-text-muted:var(--color-on-accent-3)]',
          'text-[var(--color-on-accent-1)]',
        ],
        hoverable && 'transition-colors duration-150 hover:border-[var(--color-border-strong)] cursor-pointer',
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
      className={cn('h2 text-[var(--color-text)]', className)}
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
