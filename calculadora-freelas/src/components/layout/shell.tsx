import * as React from 'react'
import { Sidebar } from './sidebar'
import { cn } from '@/lib/utils'

/**
 * AppShell — Layout da aplicação autenticada
 *
 * Estrutura: sidebar fixa esquerda + área de conteúdo com scroll
 */

interface AppShellProps {
  children: React.ReactNode
  className?: string
}

function AppShell({ children, className }: AppShellProps) {
  return (
    <div className="min-h-screen bg-[var(--color-bg)] flex">
      <Sidebar />
      <main
        className={cn(
          'flex-1 min-h-screen min-w-0',
          'flex flex-col',
          className
        )}
      >
        {children}
      </main>
    </div>
  )
}

// ─── PageHeader ──────────────────────────────────────────────────────────────

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
        'flex items-start justify-between',
        'px-8 py-6',
        'border-b border-[var(--color-border)]',
        className
      )}
    >
      <div className="flex flex-col gap-1">
        {label && <span className="label-uppercase">{label}</span>}
        <h1 className="text-display-md text-[var(--color-text)]">{title}</h1>
        {description && (
          <p className="text-sm text-[var(--color-text-secondary)] max-w-lg leading-relaxed mt-1">
            {description}
          </p>
        )}
      </div>
      {actions && (
        <div className="flex items-center gap-3 flex-shrink-0">
          {actions}
        </div>
      )}
    </header>
  )
}

// ─── PageContent ─────────────────────────────────────────────────────────────

function PageContent({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn('flex-1 px-8 py-6', className)}>
      {children}
    </div>
  )
}

export { AppShell, PageHeader, PageContent }
