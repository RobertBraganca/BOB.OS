'use client'

import * as React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/shared/lib/utils'
import { loadProposals } from '@/shared/lib/storage'
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
  PanelLeft,
} from 'lucide-react'
import { useTheme } from 'next-themes'
import { Logo } from '@/shared/components/ui/logo'
import { Tooltip, TooltipTrigger, TooltipContent } from '@/shared/components/ui/tooltip'

/**
 * Sidebar — Design System BOB.OS (mesma estrutura do BOB Finanças:
 * src/components/shell/Shell.tsx + src/components/ui/sidebar.tsx)
 *
 * Fixa em >=1024px (232px, --sidebar-width), recolhível para ícone só
 * (56px) com o mesmo padrão do Finanças — atalho Cmd/Ctrl+B, estado
 * lembrado (aqui em localStorage; lá é cookie, mesma ideia), rótulo
 * de cada item vira tooltip ao passar o mouse quando recolhida.
 * Abaixo de 1024px vira drawer (mesmo efeito do Sheet do Finanças:
 * painel desliza da esquerda sobre um backdrop).
 * Item ativo: pílula preta sólida (#080808) + texto branco — mesmo
 * padrão de `.nav__item[aria-current='page']` do Finanças (chrome, não
 * card: fica preto sempre, claro ou escuro).
 */

const COLLAPSED_KEY = 'bob_sidebar_collapsed'

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
  const [collapsed, setCollapsed] = React.useState(false)
  const [isDesktop, setIsDesktop] = React.useState(false)
  const [proposalCount, setProposalCount] = React.useState(0)

  React.useEffect(() => {
    setMounted(true)
    setCollapsed(localStorage.getItem(COLLAPSED_KEY) === '1')
    setProposalCount(loadProposals().length)

    // Recolhimento é só do modo desktop (sidebar fixa) — o drawer mobile
    // sempre mostra tudo, mesmo com um recolhimento salvo de uma sessão
    // anterior em telas maiores.
    const mq = window.matchMedia('(min-width: 1024px)')
    const updateIsDesktop = () => setIsDesktop(mq.matches)
    updateIsDesktop()
    mq.addEventListener('change', updateIsDesktop)
    return () => mq.removeEventListener('change', updateIsDesktop)
  }, [])

  const toggleCollapsed = React.useCallback(() => {
    setCollapsed((prev) => {
      const next = !prev
      localStorage.setItem(COLLAPSED_KEY, next ? '1' : '0')
      return next
    })
  }, [])

  // Mesmo atalho do Finanças (Cmd/Ctrl+B) para recolher/expandir a sidebar.
  React.useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === 'b' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        toggleCollapsed()
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [toggleCollapsed])

  const isDark = !mounted || resolvedTheme !== 'light'
  const isCollapsed = mounted && isDesktop && collapsed

  return (
    <aside
      className={cn(
        'fixed inset-y-0 left-0 lg:sticky lg:top-0 h-screen flex-shrink-0 z-40 lg:z-30 flex flex-col print:hidden',
        'bg-[var(--color-surface)] border-r border-[var(--color-border)]',
        'transition-[transform,width] duration-[var(--duration-slow)] ease-in-out select-none',
        open ? 'translate-x-0' : '-translate-x-full',
        'lg:translate-x-0',
        isCollapsed ? 'w-[56px]' : 'w-[var(--sidebar-width)]',
        className
      )}
    >
      {/* Header com Logo */}
      <div className={cn('flex items-center gap-2 h-[var(--sidebar-header-height)] border-b border-[var(--color-border)]', isCollapsed ? 'justify-center px-2' : 'justify-between px-[18px]')}>
        <Link href="/" className="flex items-center gap-2.5 overflow-hidden group" title="Ir para o topo · página inicial">
          <Logo height={isCollapsed ? 22 : 28} className="group-hover:scale-105 transition-transform" />
        </Link>

        {!isCollapsed && (
          <button
            type="button"
            onClick={onClose}
            className="lg:hidden flex items-center justify-center w-8 h-8 border border-[var(--color-border)] rounded-[var(--radius-md)] text-[var(--color-text-secondary)] hover:text-[var(--color-text)] hover:bg-[var(--color-surface-raised)] transition-colors"
            title="Fechar menu"
            aria-label="Fechar menu"
          >
            <X size={16} />
          </button>
        )}
      </div>

      {/* Botão de recolher — só faz sentido na sidebar fixa (lg+) */}
      <button
        type="button"
        onClick={toggleCollapsed}
        title={isCollapsed ? 'Expandir menu (Ctrl+B)' : 'Recolher menu (Ctrl+B)'}
        aria-label={isCollapsed ? 'Expandir menu' : 'Recolher menu'}
        className={cn(
          'hidden lg:flex items-center gap-2 h-9 mx-2 mt-2 px-2.5 rounded-[var(--radius-md)] text-[var(--color-text-muted)] hover:bg-[var(--color-surface-raised)] hover:text-[var(--color-text)] transition-colors',
          isCollapsed && 'justify-center mx-auto'
        )}
      >
        <PanelLeft size={16} className={cn('flex-shrink-0 transition-transform', isCollapsed && 'rotate-180')} />
        {!isCollapsed && <span className="text-xs font-500">Recolher</span>}
      </button>

      {/* Navigation */}
      <nav className="flex-1 py-[14px] px-3 flex flex-col gap-[22px] overflow-y-auto overflow-x-hidden">
        {NAV_ITEMS.map((group) => (
          <div key={group.group} className="flex flex-col gap-1">
            {!isCollapsed && <span className="label-uppercase px-2.5 pb-2">{group.group}</span>}
            {group.items.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href

              const link = (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => onClose?.()}
                  className={cn(
                    'flex items-center gap-3 w-full min-h-11 px-3 rounded-[var(--radius-md)] font-body text-left transition-colors',
                    isCollapsed && 'justify-center px-0',
                    isActive
                      ? 'bg-[#080808] text-white font-600 text-sm'
                      : 'text-[var(--color-text-secondary)] font-500 text-sm hover:bg-[var(--color-surface-raised)] hover:text-[var(--color-text)]'
                  )}
                >
                  <Icon size={18} className={cn('flex-shrink-0', isActive ? 'text-[var(--color-brand-red)]' : 'text-[var(--color-text-disabled)]')} />
                  {!isCollapsed && <span className="truncate">{item.label}</span>}
                </Link>
              )

              if (!isCollapsed) return link

              return (
                <Tooltip key={item.href}>
                  <TooltipTrigger asChild>{link}</TooltipTrigger>
                  <TooltipContent side="right">{item.label}</TooltipContent>
                </Tooltip>
              )
            })}
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className={cn('pt-[14px] pb-[18px] border-t border-[var(--color-border)] flex flex-col gap-3', isCollapsed ? 'px-2 items-center' : 'px-4')}>
        <button
          type="button"
          onClick={() => setTheme(isDark ? 'light' : 'dark')}
          className={cn(
            'flex items-center gap-2 min-h-11 border border-[var(--color-border)] rounded-[var(--radius-md)] text-[var(--color-text-secondary)] text-xs font-600 hover:text-[var(--color-text)] hover:border-[var(--color-text-muted)] transition-colors',
            isCollapsed ? 'w-11 justify-center' : 'w-full justify-between px-3'
          )}
          aria-label="Alternar tema"
        >
          {!isCollapsed && (isDark ? 'Modo escuro' : 'Modo claro')}
          {isDark ? <Moon size={16} /> : <Sun size={16} />}
        </button>

        {!isCollapsed && (
          <div className="p-3 bg-[var(--color-bg)] border border-[var(--color-border)] rounded-[var(--radius-md)] flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <span className="flex items-center justify-center w-5 h-5 rounded-full bg-[var(--color-brand-yellow)] text-black font-display font-900 text-[10px]">
                V1
              </span>
              <span className="text-xs font-700 text-[var(--color-text)]">Plano gratuito</span>
            </div>
            <p className="text-[0.6875rem] leading-relaxed text-[var(--color-text-muted)]">
              {proposalCount > 0
                ? `${proposalCount} ${proposalCount === 1 ? 'proposta salva' : 'propostas salvas'} · motor sempre gratuito.`
                : 'Motor em 3 camadas sempre gratuito.'}
            </p>
          </div>
        )}
      </div>
    </aside>
  )
}

export { Sidebar }
