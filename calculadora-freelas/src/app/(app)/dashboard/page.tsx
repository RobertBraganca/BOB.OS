import type { Metadata } from 'next'
import Link from 'next/link'
import { PageHeader, PageContent } from '@/components/layout/shell'
import { MetricCard } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ArrowRight, Calculator, TrendingUp, Clock, FileText } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Dashboard',
}

export default function DashboardPage() {
  // TODO: Substituir pelos dados reais via TanStack Query
  const hasProfile = false
  const hasExpenses = false

  return (
    <>
      <PageHeader
        label="Início"
        title="Dashboard"
        description="Visão geral da sua precificação"
        actions={
          <Button asChild size="md">
            <Link href="/calcular" className="flex items-center gap-2">
              <Calculator size={15} />
              Novo orçamento
            </Link>
          </Button>
        }
      />

      <PageContent>
        {/* ─── Estado vazio — sem perfil configurado ──────────────────────── */}
        {!hasProfile && (
          <div className="mb-8 flex flex-col gap-3 p-6 border border-[var(--color-brand-yellow)]/30 rounded-[var(--radius-lg)] bg-[var(--color-brand-yellow)]/5">
            <div className="flex items-center gap-2">
              <Badge variant="warning" dot>Configuração necessária</Badge>
            </div>
            <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed max-w-xl">
              Para calcular seu valor-hora real, você precisa configurar seu perfil e cadastrar
              seus custos mensais. Leva menos de 5 minutos.
            </p>
            <div className="flex gap-3 mt-1">
              <Button asChild size="sm">
                <Link href="/perfil" className="flex items-center gap-1.5">
                  Configurar perfil
                  <ArrowRight size={13} />
                </Link>
              </Button>
            </div>
          </div>
        )}

        {/* ─── Métricas principais ─────────────────────────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
          <MetricCard
            label="Valor-hora Real"
            value="—"
            sublabel="Configure seus custos para calcular"
            accent="red"
            size="md"
          />
          <MetricCard
            label="Horas Faturáveis"
            value="—"
            sublabel="horas / mês"
            accent="yellow"
            size="md"
          />
          <MetricCard
            label="Custo Mensal Total"
            value="—"
            sublabel="Despesas + pró-labore + reserva"
            size="md"
          />
          <MetricCard
            label="Orçamentos Gerados"
            value="0"
            sublabel="Nenhum ainda"
            size="md"
          />
        </div>

        {/* ─── Ações rápidas ───────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            {
              href: '/calcular',
              icon: Calculator,
              title: 'Calcular Orçamento',
              description: 'Monte um orçamento completo com o motor de cálculo em 3 camadas.',
              cta: 'Iniciar cálculo',
              accent: 'red' as const,
            },
            {
              href: '/custos',
              icon: TrendingUp,
              title: 'Cadastrar Custos',
              description: 'Registre suas despesas fixas e defina seu pró-labore desejado.',
              cta: 'Cadastrar custos',
              accent: 'yellow' as const,
            },
            {
              href: '/propostas',
              icon: FileText,
              title: 'Minhas Propostas',
              description: 'Acesse e exporte as propostas geradas anteriormente em PDF.',
              cta: 'Ver propostas',
              accent: 'none' as const,
            },
          ].map((action) => {
            const Icon = action.icon
            return (
              <div
                key={action.href}
                className="relative flex flex-col gap-4 p-6 rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] overflow-hidden"
              >
                {action.accent !== 'none' && (
                  <div
                    className="absolute top-0 left-0 right-0 h-[2px]"
                    style={{
                      backgroundColor: action.accent === 'red'
                        ? 'var(--color-brand-red)'
                        : 'var(--color-brand-yellow)',
                    }}
                  />
                )}
                <div className="flex flex-col gap-2">
                  <Icon size={18} className="text-[var(--color-text-secondary)]" />
                  <h3 className="font-display font-800 text-lg uppercase tracking-tight text-[var(--color-text)]">
                    {action.title}
                  </h3>
                  <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed">
                    {action.description}
                  </p>
                </div>
                <Button asChild variant="secondary" size="sm" className="self-start">
                  <Link href={action.href} className="flex items-center gap-1.5">
                    {action.cta}
                    <ArrowRight size={12} />
                  </Link>
                </Button>
              </div>
            )
          })}
        </div>

        {/* ─── Empty state: sem orçamentos ────────────────────────────────── */}
        <div className="mt-8 flex flex-col items-center justify-center py-16 border border-dashed border-[var(--color-border)] rounded-[var(--radius-lg)]">
          <Clock size={24} className="text-[var(--color-text-muted)] mb-3" />
          <h3 className="font-display font-800 text-sm uppercase tracking-wide text-[var(--color-text-muted)] mb-1">
            Nenhum orçamento ainda
          </h3>
          <p className="text-xs text-[var(--color-text-muted)] text-center max-w-xs leading-relaxed mb-4">
            Seus orçamentos calculados aparecerão aqui. Comece pelo botão acima.
          </p>
        </div>
      </PageContent>
    </>
  )
}
