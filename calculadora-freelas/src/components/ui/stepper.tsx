import * as React from 'react'
import { cn } from '@/lib/utils'

/**
 * StepIndicator — Design System BOB.OS
 *
 * Navegador de etapas para o wizard de cálculo.
 * DNA Visual: numeração em Barlow Condensed, ativo em vermelho,
 * linha de progresso sólida.
 */

interface Step {
  label: string
  description?: string
}

interface StepIndicatorProps {
  steps: Step[]
  currentStep: number
  className?: string
}

function StepIndicator({ steps, currentStep, className }: StepIndicatorProps) {
  return (
    <nav aria-label="Progresso" className={cn('flex items-start gap-0 w-max min-w-full', className)}>
      {steps.map((step, index) => {
        const isCompleted = index < currentStep
        const isActive = index === currentStep
        const isUpcoming = index > currentStep

        return (
          <React.Fragment key={index}>
            <div className="flex flex-col items-center gap-1.5 flex-shrink-0">
              {/* Número do step */}
              <div
                className={cn(
                  'flex items-center justify-center flex-shrink-0',
                  'w-8 h-8 rounded-[var(--radius-md)]',
                  'font-display font-900 text-sm',
                  'transition-colors duration-[var(--duration-base)]',
                  isCompleted && 'bg-[var(--color-brand-red)] text-white',
                  isActive && 'bg-[var(--color-brand-red)] text-white ring-2 ring-[var(--color-brand-red)] ring-offset-2 ring-offset-[var(--color-bg)]',
                  isUpcoming && 'bg-[var(--color-surface-raised)] text-[var(--color-text-muted)] border border-[var(--color-border)]',
                )}
              >
                {isCompleted ? (
                  <CheckIcon />
                ) : (
                  <span>{index + 1}</span>
                )}
              </div>

              {/* Label */}
              <div className="flex flex-col items-center text-center px-1">
                <span
                  className={cn(
                    'text-[0.65rem] font-600 uppercase tracking-wide whitespace-nowrap',
                    isActive && 'text-[var(--color-text)]',
                    isCompleted && 'text-[var(--color-text-secondary)]',
                    isUpcoming && 'text-[var(--color-text-muted)]',
                  )}
                >
                  {step.label}
                </span>
              </div>
            </div>

            {/* Conector entre steps */}
            {index < steps.length - 1 && (
              <div className="flex-1 flex items-start pt-4 min-w-[24px]">
                <div
                  className={cn(
                    'w-full h-px transition-colors duration-[var(--duration-slow)]',
                    isCompleted ? 'bg-[var(--color-brand-red)]' : 'bg-[var(--color-border)]',
                  )}
                />
              </div>
            )}
          </React.Fragment>
        )
      })}
    </nav>
  )
}

function CheckIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
      <path
        d="M2 6L5 9L10 3"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

// ─── StepHeader ─────────────────────────────────────────────────────────────

interface StepHeaderProps {
  step: number
  total: number
  title: string
  description?: string
  className?: string
}

function StepHeader({ step, total, title, description, className }: StepHeaderProps) {
  return (
    <div className={cn('flex flex-col gap-2', className)}>
      <span className="label-uppercase">
        Etapa {step} de {total}
      </span>
      <h2 className="text-display-md text-[var(--color-text)]">{title}</h2>
      {description && (
        <p className="text-sm text-[var(--color-text-secondary)] max-w-lg leading-relaxed">
          {description}
        </p>
      )}
    </div>
  )
}

export { StepIndicator, StepHeader }
export type { Step }
