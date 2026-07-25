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
        'bg-[#060606] border-r border-[var(--color-border-subtle)]',
        'fixed left-0 top-0 bottom-0 z-30',
        className
      )}
    >
      {/* Logo */}
      <div className="flex items-center gap-2 px-5 h-14 border-b border-[var(--color-border-subtle)]">
        <div className="flex items-center justify-center w-7 h-7 bg-[var(--color-brand-red)] rounded-[var(--radius-sm)]">
          <Zap size={14} className="text-white" fill="white" />
        </div>
        <div className="flex flex-col leading-none">
          <span className="font-display font-900 text-sm uppercase tracking-tight text-[var(--color-text)]">
            BOB.OS
          </span>
          <span className="text-[0.55rem] text-[var(--color-text-muted)] uppercase tracking-widest font-600">
            Precificação
          </span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex flex-col flex-1 py-4 px-3 gap-5 overflow-y-auto">
        {NAV_ITEMS.map((group) => (
          <div key={group.group} className="flex flex-col gap-0.5">
            <span className="px-2 mb-1 text-[0.6rem] font-700 uppercase tracking-widest text-[var(--color-text-muted)]">
              {group.group}
            </span>

            {group.items.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
              const Icon = item.icon

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'flex items-center gap-2.5 px-2 h-9 rounded-[var(--radius-md)]',
                    'text-sm font-500 transition-colors duration-100',
                    isActive
                      ? 'bg-[var(--color-brand-red)] text-white'
                      : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-surface)] hover:text-[var(--color-text)]'
                  )}
                >
                  <Icon size={15} className="flex-shrink-0" />
                  <span>{item.label}</span>
                  {isActive && (
                    <ChevronRight size={12} className="ml-auto opacity-60" />
                  )}
                </Link>
              )
            })}
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="px-3 pb-4 pt-3 border-t border-[var(--color-border-subtle)]">
        <div className="px-2 py-2 rounded-[var(--radius-md)] bg-[var(--color-surface)]">
          <div className="flex items-center gap-2 mb-1.5">
            <div className="w-5 h-5 rounded-full bg-[var(--color-brand-yellow)] flex items-center justify-center text-black text-[0.55rem] font-900 flex-shrink-0">
              V1
            </div>
            <span className="text-xs font-600 text-[var(--color-text)]">Plano Gratuito</span>
          </div>
          <p className="text-[0.65rem] text-[var(--color-text-muted)] leading-relaxed">
            Motor de cálculo completo sempre gratuito.
          </p>
        </div>
      </div>
    </aside>
  )
}

export { Sidebar }
