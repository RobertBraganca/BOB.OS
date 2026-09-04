import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/shared/lib/utils'

/**
 * Button — Design System BOB.OS (alinhado ao BOB Finanças)
 *
 * DNA Visual:
 * - Pílula (rounded-full) — raio duro fica só para cards/inputs/badges
 * - Fundo sólido vermelho (#FF0000) no variant primary
 * - Tipografia de corpo (Inter), peso 600, SEM caixa alta — o Finanças não
 *   usa uppercase em botão, só em `.label`
 * - Hover: ligeiro brightness
 * - Sem shadows ornamentais
 */
const buttonVariants = cva(
  [
    'inline-flex items-center justify-center gap-2',
    'font-body font-600',
    'select-none whitespace-nowrap',
    'transition-all duration-150 ease-out',
    'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-brand-red)]',
    'disabled:opacity-40 disabled:pointer-events-none',
    'cursor-pointer',
    'rounded-full',
  ].join(' '),
  {
    variants: {
      variant: {
        primary: [
          'bg-[var(--color-brand-red)] text-white',
          'hover:brightness-110 active:brightness-90',
        ],
        secondary: [
          'bg-transparent text-[var(--color-text)] border border-[var(--color-border-strong)]',
          'hover:bg-[var(--color-surface-raised)]',
        ],
        ghost: [
          'bg-transparent text-[var(--color-text-secondary)]',
          'hover:bg-[var(--color-surface)] hover:text-[var(--color-text)]',
        ],
        danger: [
          'bg-transparent text-[var(--color-brand-red)] border border-[var(--color-brand-red)]/40',
          'hover:bg-[var(--color-brand-red)] hover:text-white',
        ],
        yellow: [
          'bg-[var(--color-brand-yellow)] text-black',
          'hover:brightness-105 active:brightness-95',
        ],
      },
      size: {
        sm: 'h-[1.875rem] px-3 text-xs',
        md: 'h-[var(--control-h)] px-4 text-sm',
        lg: 'h-11 px-6 text-base',
        xl: 'h-12 px-8 text-lg',
        icon: 'h-[var(--control-h)] w-[var(--control-h)]',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
  loading?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, loading = false, children, disabled, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button'
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={disabled || loading}
        {...props}
      >
        {loading ? (
          <>
            <LoadingDots />
            <span className="opacity-0">{children}</span>
          </>
        ) : (
          children
        )}
      </Comp>
    )
  }
)
Button.displayName = 'Button'

function LoadingDots() {
  return (
    <span className="flex items-center gap-1 absolute">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="w-1 h-1 rounded-full bg-current animate-bounce"
          style={{ animationDelay: `${i * 150}ms` }}
        />
      ))}
    </span>
  )
}

export { Button, buttonVariants }
