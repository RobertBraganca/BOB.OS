import * as React from 'react'
import { cn } from '@/shared/lib/utils'

/**
 * Input — Design System BOB.OS
 *
 * DNA Visual:
 * - Borda sutil #222, fundo #101010
 * - Focus: borda vermelha, sem glow
 * - Tipografia Inter, sem ornamentos
 * - Label Barlow Condensed em caixa alta e pequena
 */

export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'prefix'> {
  label?: string
  hint?: string
  error?: string
  prefix?: React.ReactNode
  suffix?: React.ReactNode
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, hint, error, prefix, suffix, id, ...props }, ref) => {
    const generatedId = React.useId()
    const inputId = id || generatedId

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="label-uppercase"
          >
            {label}
          </label>
        )}

        <div className="relative flex items-center">
          {prefix && (
            <div className="absolute left-3 flex items-center text-[var(--color-text-muted)] text-sm pointer-events-none">
              {prefix}
            </div>
          )}

          <input
            id={inputId}
            ref={ref}
            className={cn(
              'w-full bg-[var(--color-surface)] text-[var(--color-text)]',
              'border border-[var(--color-border)]',
              'h-10 px-3 text-sm rounded-[var(--radius-md)]',
              'placeholder:text-[var(--color-text-muted)]',
              'transition-colors duration-150',
              'focus:outline-none focus:border-[var(--color-brand-red)]',
              'disabled:opacity-40 disabled:cursor-not-allowed',
              prefix && 'pl-9',
              suffix && 'pr-9',
              error && 'border-[var(--color-brand-red)]',
              className
            )}
            {...props}
          />

          {suffix && (
            <div className="absolute right-3 flex items-center text-[var(--color-text-muted)] text-sm pointer-events-none">
              {suffix}
            </div>
          )}
        </div>

        {error && (
          <p className="text-[0.6875rem] text-[var(--color-brand-red)] font-medium">
            {error}
          </p>
        )}

        {hint && !error && (
          <p className="text-[0.6875rem] text-[var(--color-text-muted)]">
            {hint}
          </p>
        )}
      </div>
    )
  }
)
Input.displayName = 'Input'

// ─── CurrencyInput ─────────────────────────────────────────────────────────

export interface CurrencyInputProps extends Omit<InputProps, 'onChange' | 'value' | 'type'> {
  value: number
  onChange: (value: number) => void
}

const CurrencyInput = React.forwardRef<HTMLInputElement, CurrencyInputProps>(
  ({ value, onChange, ...props }, ref) => {
    const [displayValue, setDisplayValue] = React.useState(
      value > 0 ? value.toFixed(2).replace('.', ',') : ''
    )
    // Rastreia o último valor emitido por este input para diferenciar uma
    // mudança externa de `value` (ex.: custos carregados do localStorage após
    // o mount) — que deve resincronizar o texto — de uma mudança originada
    // pela própria digitação, que já está refletida em `displayValue`.
    const lastEmitted = React.useRef(value)

    React.useEffect(() => {
      if (value !== lastEmitted.current) {
        setDisplayValue(value > 0 ? value.toFixed(2).replace('.', ',') : '')
        lastEmitted.current = value
      }
    }, [value])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const raw = e.target.value.replace(/[^\d,]/g, '')
      setDisplayValue(raw)

      const numeric = parseFloat(raw.replace(',', '.'))
      if (!isNaN(numeric)) {
        lastEmitted.current = numeric
        onChange(numeric)
      } else if (raw === '' || raw === ',') {
        lastEmitted.current = 0
        onChange(0)
      }
    }

    const handleBlur = () => {
      if (value > 0) {
        setDisplayValue(value.toFixed(2).replace('.', ','))
      }
    }

    return (
      <Input
        ref={ref}
        type="text"
        inputMode="decimal"
        prefix={<span className="font-medium text-xs">R$</span>}
        value={displayValue}
        onChange={handleChange}
        onBlur={handleBlur}
        {...props}
      />
    )
  }
)
CurrencyInput.displayName = 'CurrencyInput'

// ─── PercentInput ──────────────────────────────────────────────────────────

export interface PercentInputProps extends Omit<InputProps, 'onChange' | 'value' | 'type'> {
  value: number
  onChange: (value: number) => void
  min?: number
  max?: number
}

const PercentInput = React.forwardRef<HTMLInputElement, PercentInputProps>(
  ({ value, onChange, min = 0, max = 100, ...props }, ref) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const raw = parseFloat(e.target.value)
      if (!isNaN(raw)) {
        onChange(Math.min(Math.max(raw, min), max))
      }
    }

    return (
      <Input
        ref={ref}
        type="number"
        inputMode="decimal"
        suffix={<span className="font-medium text-xs">%</span>}
        value={value || ''}
        onChange={handleChange}
        min={min}
        max={max}
        {...props}
      />
    )
  }
)
PercentInput.displayName = 'PercentInput'

export { Input, CurrencyInput, PercentInput }
