'use client'

import * as React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
  LayoutDashboard,
  Calculator,
  User,
  Wallet,
  FileText,
  Settings,
  ChevronRight,
  Zap,
} from 'lucide-react'
import { ThemeToggle } from '@/components/ui/theme-toggle'


/**
 * Sidebar — Design System BOB.OS
 *
 * DNA Visual:
 * - Fundo #0A0A0A (mais escuro que o body)
 * - Borda direita sutil
 * - Item ativo: fundo vermelho sólido
 * - Logo em Barlow Condensed
 * - Sem icons redondos ou coloridos — austeros
 */

const NAV_ITEMS = [
  {
    group: 'PRINCIPAL',
    items: [
      { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
      { href: '/calcular', icon: Calculator, label: 'Calculadora' },
      { href: '/custos', icon: Wallet, label: 'Meus Custos' },
    ],
  },
  {
    group: 'CONTA',
    items: [
      { href: '/perfil', icon: User, label: 'Perfil' },
      { href: '/propostas', icon: FileText, label: 'Propostas' },
      { href: '/configuracoes', icon: Settings, label: 'Configurações' },
    ],
  },
]

interface SidebarProps {
  className?: string
}

function Sidebar({ className }: SidebarProps) {
  const pathname = usePathname()

  return (
    <aside
      className={cn(
        'flex flex-col w-56 min-h-screen',
        'bg-[var(--color-bg)] border-r border-[var(--color-border)] transition-colors duration-200',
        'fixed left-0 top-0 bottom-0 z-30',
        className
      )}
    >
      {/* Header com Logo */}
      <div className="flex items-center gap-2 px-6 h-14 border-b border-[var(--color-border-subtle)]">
        <div className="flex items-center justify-center w-6 h-6 bg-[var(--color-brand-red)] rounded-[var(--radius-sm)]">
          <Zap size={13} className="text-white" fill="white" />
        </div>
        <Link href="/" className="font-display font-900 text-sm tracking-tight text-[var(--color-text)]">
          BOB.OS
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 px-3 flex flex-col gap-6 overflow-y-auto">
        {NAV_ITEMS.map((group) => (
          <div key={group.group} className="flex flex-col gap-1">
            <span className="px-3 text-[0.65rem] font-600 tracking-wider text-[var(--color-text-muted)] uppercase mb-1">
              {group.group}
            </span>

            {group.items.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'flex items-center gap-3 px-3 py-2 rounded-[var(--radius-md)] text-xs font-500 transition-colors',
                    isActive
                      ? 'bg-[var(--color-brand-red)] text-white font-600'
                      : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-surface)] hover:text-[var(--color-text)]'
                  )}
                >
                  <Icon size={15} className="flex-shrink-0" />
                  <span>{item.label}</span>
                </Link>
              )
            })}
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="px-3 pb-4 pt-3 border-t border-[var(--color-border-subtle)] flex flex-col gap-3">
        <div className="flex items-center justify-between px-2 py-1">
          <span className="text-xs text-[var(--color-text-muted)] font-500">Tema visual</span>
          <ThemeToggle />
        </div>
        <div className="px-2.5 py-2.5 rounded-[var(--radius-md)] bg-[var(--color-surface)] border border-[var(--color-border)]">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-4 h-4 rounded-full bg-[var(--color-brand-yellow)] flex items-center justify-center text-black text-[0.55rem] font-900 flex-shrink-0">
              V1
            </div>
            <span className="text-xs font-600 text-[var(--color-text)]">Plano Gratuito</span>
          </div>
          <p className="text-[0.65rem] text-[var(--color-text-muted)] leading-relaxed">
            Motor em 3 camadas sempre gratuito.
          </p>
        </div>
      </div>
    </aside>
  )
}

export { Sidebar }
