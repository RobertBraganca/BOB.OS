import React from 'react'
import Link from 'next/link'
import { Logo } from '@/components/ui/logo'

const BULLETS = [
  { color: 'var(--color-brand-red)', text: 'Valor-hora real calculado sobre os seus custos' },
  { color: 'var(--color-brand-yellow)', text: 'Multiplicadores de complexidade, urgência e direitos' },
  { color: 'var(--color-brand-green)', text: 'Gross-up tributário por regime · MEI, Simples, PJ, PF' },
]

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-[var(--color-bg)] grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))' }}>
      <div className="hidden lg:flex flex-col justify-between gap-10 p-12 bg-[var(--color-surface)] border-r border-[var(--color-border)]">
        <Link href="/" className="flex items-center gap-2">
          <Logo height={28} />
        </Link>

        <div className="flex flex-col gap-5">
          <h2 className="text-display-lg text-[var(--color-text)] max-w-[18ch]">
            O preço certo não é o mais alto. É o defensável.
          </h2>
          <div className="flex flex-col gap-3">
            {BULLETS.map((b) => (
              <div key={b.text} className="flex items-center gap-3 text-sm text-[var(--color-text-secondary)]">
                <span className="w-1.5 h-1.5 flex-shrink-0" style={{ backgroundColor: b.color }} />
                {b.text}
              </div>
            ))}
          </div>
        </div>

        <span className="text-2xs tracking-widest uppercase text-[var(--color-text-muted)]">
          BOB.OS · Calculadora de Freelas
        </span>
      </div>

      <div className="flex items-center justify-center p-6 sm:p-8 lg:p-12">
        <div className="w-full max-w-[400px]">{children}</div>
      </div>
    </div>
  )
}
