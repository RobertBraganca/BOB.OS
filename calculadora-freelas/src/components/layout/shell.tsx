'use client'

import * as React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, Plus } from 'lucide-react'
import { Sidebar } from './sidebar'
import { cn } from '@/lib/utils'

/**
 * AppShell — Layout da aplicação autenticada (design_handoff_bobos_redesign)
 *
 * Estrutura: sidebar fixa 248px (>=1024px) / drawer overlay abaixo disso,
 * + barra utilitária fina e persistente (burger mobile + nome da tela +
 * "Novo orçamento") + conteúdo com padding 24/20px e max-width 1240px.
 */

const ROUTE_LABELS: Record<string, { eyebrow: string; title: string }> = {
  '/dashboard': { eyebrow: 'Principal', title: 'Dashboard' },
  '/calcular': { eyebrow: 'Principal', title: 'Calculadora' },
  '/custos': { eyebrow: 'Principal', title: 'Meus Custos' },
  '/perfil': { eyebrow: 'Conta', title: 'Perfil' },
  '/propostas': { eyebrow: 'Conta', title: 'Propostas' },
  '/propostas/preview': { eyebrow: 'Conta', title: 'Proposta' },
  '/configuracoes': { eyebrow: 'Conta', title: 'Configurações' },
}

interface AppShellProps {
  children: React.ReactNode
  className?: string
}

function AppShell({ children, className }: AppShellProps) {
  const [mobileNavOpen, setMobileNavOpen] = React.useState(false)
  const pathname = usePathname()
  const route = ROUTE_LABELS[pathname] ?? { eyebrow: 'BOB.OS', title: 'Sistema' }

  return (
    <div className="min-h-screen bg-[var(--color-bg)] flex print:block print:bg-white print:min-h-0">
      {mobileNavOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/60 lg:hidden"
          onClick={() => setMobileNavOpen(false)}
          aria-hidden="true"
        />
      )}
      <Sidebar open={mobileNavOpen} onClose={() => setMobileNavOpen(false)} />
      <main
        className={cn(
          'flex-1 min-h-screen min-w-0 overflow-x-hidden print:min-h-0 print:overflow-visible print:block print:w-full',
          'flex flex-col',
          className
        )}
      >
        {/* Barra utilitária — persistente em todas as telas do app */}
        <header className="sticky top-0 z-20 flex items-center gap-3 h-14 px-5 border-b border-[var(--color-border)] bg-[var(--color-bg)] print:hidden">
          <button
            type="button"
            onClick={() => setMobileNavOpen(true)}
            className="lg:hidden flex items-center justify-center w-10 h-10 -ml-1 rounded-[var(--radius-md)] border border-[var(--color-border)] text-[var(--color-text)] hover:bg-[var(--color-surface)] transition-colors flex-shrink-0"
            aria-label="Abrir menu"
          >
            <Menu size={18} />
          </button>
          <div className="flex flex-col min-w-0">
            <span className="label-uppercase leading-none">{route.eyebrow}</span>
            <span className="font-display font-800 text-lg uppercase tracking-tight text-[var(--color-text)] whitespace-nowrap overflow-hidden text-ellipsis">
              {route.title}
            </span>
          </div>
          <div className="flex items-center gap-2 ml-auto flex-shrink-0">
            <Link
              href="/calcular"
              className="flex items-center gap-2 h-10 px-4 rounded-[var(--radius-md)] bg-[var(--color-brand-red)] text-white text-xs font-800 tracking-wide uppercase hover:brightness-110 transition-[filter]"
            >
              <Plus size={15} />
              <span className="hidden sm:inline">Novo orçamento</span>
            </Link>
          </div>
        </header>
        {children}
      </main>
    </div>
  )
}

// ─── PageHeader ──────────────────────────────────────────────────────────────
// Bloco de título em fluxo (não fixo, sem cartão) — eyebrow + h1 + descrição + ações.

interface PageHeaderProps {
  title: string
  description?: string
  actions?: React.ReactNode
  label?: string
  className?: string
}

function PageHeader({ title, description, actions, label, className }: PageHeaderProps) {
  return (
    <header
      className={cn(
        'flex flex-wrap items-end justify-between gap-4',
        className
      )}
    >
      <div className="flex flex-col gap-1.5 min-w-0">
        {label && <span className="label-uppercase text-[var(--color-brand-red)]">{label}</span>}
        <h1 className="text-display-md text-[var(--color-text)]">{title}</h1>
        {description && (
          <p className="text-sm text-[var(--color-text-secondary)] max-w-xl leading-relaxed">
            {description}
          </p>
        )}
      </div>
      {actions && (
        <div className="flex items-center gap-2 flex-wrap flex-shrink-0">
          {actions}
        </div>
      )}
    </header>
  )
}

// ─── PageContent ─────────────────────────────────────────────────────────────

function PageContent({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn('flex-1 w-full max-w-[1240px] px-5 py-6', className)}>
      {children}
    </div>
  )
}

export { AppShell, PageHeader, PageContent }
