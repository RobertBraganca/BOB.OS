'use client'

import * as React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/shared/lib/utils'
import {
  LayoutDashboard,
  Calculator,
  Wallet,
  User,
  FileText,
  Settings,
  X,
  Sun,
  Moon,
} from 'lucide-react'
import { useTheme } from 'next-themes'
import { Logo } from '@/shared/components/ui/logo'

/**
 * Sidebar — Design System BOB.OS (design_handoff_bobos_redesign)
 *
 * Fixa em >=1024px (248px), drawer overlay abaixo disso.
 * Item ativo: régua de 3px à esquerda + wash vermelho 10% + tipografia display.
 * Sem recolhimento — não existe no design de referência.
 */

const NAV_ITEMS = [
  {
    group: 'Principal',
    items: [
      { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
      { href: '/calcular', icon: Calculator, label: 'Calculadora' },
      { href: '/custos', icon: Wallet, label: 'Meus Custos' },
    ],
  },
  {
    group: 'Conta',
    items: [
      { href: '/perfil', icon: User, label: 'Perfil' },
      { href: '/propostas', icon: FileText, label: 'Propostas' },
      { href: '/configuracoes', icon: Settings, label: 'Configurações' },
    ],
  },
]

interface SidebarProps {
  className?: string
  /** Estado do drawer em telas < lg (mobile/tablet). Ignorado em lg+, onde a sidebar é estática. */
  open?: boolean
  onClose?: () => void
}

function Sidebar({ className, open = false, onClose }: SidebarProps) {
  const pathname = usePathname()
  const { resolvedTheme, setTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  const isDark = !mounted || resolvedTheme !== 'light'

  return (
    <aside
      className={cn(
        'fixed inset-y-0 left-0 lg:sticky lg:top-0 h-screen w-[var(--sidebar-width)] flex-shrink-0 z-40 lg:z-30 flex flex-col print:hidden',
        'bg-[var(--color-surface)] border-r border-[var(--color-border)]',
        'transition-transform duration-[var(--duration-slow)] ease-in-out select-none',
        open ? 'translate-x-0' : '-translate-x-full',
        'lg:translate-x-0',
        className
      )}
    >
      {/* Header com Logo */}
      <div className="flex items-center justify-between gap-2 h-[var(--sidebar-header-height)] border-b border-[var(--color-border)] px-[18px]">
        <Link href="/" className="flex items-center gap-2.5 overflow-hidden group" title="Ir para o topo · página inicial">
          <Logo height={80} className="group-hover:scale-105 transition-transform" />
        </Link>

        <button
          type="button"
          onClick={onClose}
          className="lg:hidden flex items-center justify-center w-8 h-8 border border-[var(--color-border)] rounded-[var(--radius-md)] text-[var(--color-text-secondary)] hover:text-[var(--color-text)] hover:bg-[var(--color-surface-raised)] transition-colors"
          title="Fechar menu"
          aria-label="Fechar menu"
        >
          <X size={16} />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-[18px] px-3 flex flex-col gap-[22px] overflow-y-auto overflow-x-hidden">
        {NAV_ITEMS.map((group) => (
          <div key={group.group} className="flex flex-col gap-1">
            <span className="label-uppercase px-2.5 pb-2">{group.group}</span>
            {group.items.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => onClose?.()}
                  className={cn(
                    'flex items-center gap-3 w-full min-h-11 px-3 rounded-r-[var(--radius-md)] font-display uppercase tracking-[0.01em] text-left transition-colors',
                    'border-l-[3px]',
                    isActive
                      ? 'border-l-[var(--color-brand-red)] bg-[var(--color-brand-red)]/10 text-[var(--color-text)] font-800 text-base'
                      : 'border-l-transparent text-[var(--color-text-secondary)] font-700 text-base hover:bg-[var(--color-surface-raised)] hover:text-[var(--color-text)]'
                  )}
                >
                  <Icon size={18} className={cn('flex-shrink-0', isActive && 'text-[var(--color-brand-red)]')} />
                  <span className="truncate">{item.label}</span>
                </Link>
              )
            })}
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="px-4 pt-[14px] pb-[18px] border-t border-[var(--color-border)] flex flex-col gap-3">
        <button
          type="button"
          onClick={() => setTheme(isDark ? 'light' : 'dark')}
          className="flex items-center justify-between gap-2 min-h-11 px-3 border border-[var(--color-border)] rounded-[var(--radius-md)] text-[var(--color-text-secondary)] text-xs font-600 tracking-wide uppercase hover:text-[var(--color-text)] hover:border-[var(--color-text-muted)] transition-colors"
          aria-label="Alternar tema"
        >
          {isDark ? 'Modo escuro' : 'Modo claro'}
          {isDark ? <Moon size={16} /> : <Sun size={16} />}
        </button>

        <div className="p-3 bg-[var(--color-bg)] border border-[var(--color-border)] rounded-[var(--radius-md)] flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <span className="flex items-center justify-center w-5 h-5 rounded-full bg-[var(--color-brand-yellow)] text-black font-display font-900 text-[10px]">
              V1
            </span>
            <span className="text-xs font-700 text-[var(--color-text)]">Plano gratuito</span>
          </div>
          <p className="text-[0.6875rem] leading-relaxed text-[var(--color-text-muted)]">
            Motor em 3 camadas sempre gratuito.
          </p>
        </div>
      </div>
    </aside>
  )
}

export { Sidebar }
