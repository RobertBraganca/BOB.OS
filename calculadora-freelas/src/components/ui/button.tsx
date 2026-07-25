import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

/**
 * Button — Design System BOB.OS
 *
 * DNA Visual:
 * - Fundo sólido vermelho (#FF0000) no variant primary
 * - Sem border-radius excessivo (4px — var(--radius-md))
 * - Tipografia Barlow Condensed em caixa alta
 * - Hover: ligeiro brightness
 * - Sem shadows ornamentais
 */
const buttonVariants = cva(
  [
    'inline-flex items-center justify-center gap-2',
    'font-display font-700 uppercase tracking-wider',
    'select-none whitespace-nowrap',
    'transition-all duration-150 ease-out',
    'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-brand-red)]',
    'disabled:opacity-40 disabled:pointer-events-none',
    'cursor-pointer',
  ].join(' '),
  {
    variants: {
      variant: {
        primary: [
          'bg-[var(--color-brand-red)] text-white',
          'hover:brightness-110 active:brightness-90',
        ],
        secondary: [
          'bg-transparent text-[var(--color-text)] border border-[var(--color-border)]',
          'hover:bg-[var(--color-surface-raised)] hover:border-[var(--color-text-muted)]',
        ],
        ghost: [
          'bg-transparent text-[var(--color-text-secondary)]',
          'hover:bg-[var(--color-surface)] hover:text-[var(--color-text)]',
        ],
        danger: [
          'bg-transparent text-[var(--color-brand-red)] border border-[var(--color-brand-red)]',
          'hover:bg-[var(--color-brand-red)] hover:text-white',
        ],
        yellow: [
          'bg-[var(--color-brand-yellow)] text-black',
          'hover:brightness-105 active:brightness-95',
        ],
      },
      size: {
        sm: 'h-8 px-4 text-xs rounded-[var(--radius-md)]',
        md: 'h-10 px-6 text-sm rounded-[var(--radius-md)]',
        lg: 'h-12 px-8 text-base rounded-[var(--radius-md)]',
        xl: 'h-14 px-10 text-lg rounded-[var(--radius-md)]',
        icon: 'h-10 w-10 rounded-[var(--radius-md)]',
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
