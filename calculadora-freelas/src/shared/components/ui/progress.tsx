'use client'

import * as React from 'react'
import * as ProgressPrimitive from '@radix-ui/react-progress'
import { cn } from '@/shared/lib/utils'

/**
 * Progress — Design System BOB.OS
 * Track escura, fill por cor semântica
 */

interface ProgressProps extends React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root> {
  color?: 'red' | 'yellow' | 'green' | 'blue' | 'purple'
  size?: 'xs' | 'sm' | 'md'
  showValue?: boolean
  label?: string
}

const COLOR_CLASSES = {
  red:    'bg-[var(--color-brand-red)]',
  yellow: 'bg-[var(--color-brand-yellow)]',
  green:  'bg-[var(--color-brand-green)]',
  blue:   'bg-[var(--color-brand-blue)]',
  purple: 'bg-[var(--color-brand-purple)]',
}

const SIZE_CLASSES = {
  xs: 'h-0.5',
  sm: 'h-1',
  md: 'h-1.5',
}

const Progress = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  ProgressProps
>(({ className, value, color = 'red', size = 'sm', showValue = false, label, ...props }, ref) => (
  <div className="flex flex-col gap-1.5">
    {(label || showValue) && (
      <div className="flex items-center justify-between">
        {label && <span className="label-uppercase">{label}</span>}
        {showValue && (
          <span className="text-xs text-[var(--color-text-secondary)] font-600 tabular-nums">
            {value ?? 0}%
          </span>
        )}
      </div>
    )}
    <ProgressPrimitive.Root
      ref={ref}
      className={cn(
        'relative w-full overflow-hidden rounded-full',
        'bg-[var(--color-border)]',
        SIZE_CLASSES[size],
        className
      )}
      {...props}
    >
      <ProgressPrimitive.Indicator
        className={cn(
          'h-full w-full flex-1 transition-all duration-500 ease-out',
          COLOR_CLASSES[color]
        )}
        style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
      />
    </ProgressPrimitive.Root>
  </div>
))
Progress.displayName = 'Progress'

export { Progress }
