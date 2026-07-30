'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { PageHeader, PageContent } from '@/shared/components/layout/shell'
import {
  calculateLayer1,
  calculateHourlyRateScenarios,
  getBenchmarkServiceById,
} from '@/modules/pricing/lib'
import {
  DEFAULT_COSTS,
  loadCosts,
  loadProfile,
  loadPrefs,
  loadProposals,
  hasSavedCosts,
  saveCosts,
  totalMonthlyExpenses,
  type SavedCosts,
  type SavedProposal,
} from '@/shared/lib/storage'
import { formatCurrency } from '@/shared/lib/utils'
import {
  Wallet,
  AlertTriangle,
  ArrowRight,
  Zap,
  Layers,
  TrendingUp,
  BarChart3,
  Info,
  FileText,
} from 'lucide-react'

/**
 * Dashboard — design_handoff_bobos_redesign/design/AppScreen.dc.html (linhas 338-507)
 * Pergunta que a tela responde: quanto vale minha hora agora.
 */

const COMP_COLORS = {
  expenses: 'var(--color-brand-blue)',
  salary: 'var(--color-brand-yellow)',
  reserve: 'var(--color-brand-purple)',
  profit: 'var(--color-brand-green)',
} as const

const MONTH_LABELS = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez']

function buildPipeline(proposals: SavedProposal[]) {
  const now = new Date()
  const buckets = Array.from({ length: 6 }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1)
    return { year: d.getFullYear(), month: d.getMonth(), label: MONTH_LABELS[d.getMonth()], total: 0, count: 0 }
  })
  for (const p of proposals) {
    const d = new Date(p.createdAt)
    if (Number.isNaN(d.getTime())) continue
    const bucket = buckets.find((b) => b.year === d.getFullYear() && b.month === d.getMonth())
    if (bucket) {
      bucket.total += p.result.quote.recommended
      bucket.count += 1
    }
  }
  return buckets
}

export function Dashboard() {
  const [costs, setCosts] = useState<SavedCosts>(DEFAULT_COSTS)
  const [hasCosts, setHasCosts] = useState(false)
  const [profile, setProfile] = useState<ReturnType<typeof loadProfile>>(null)
  const [showBenchmark, setShowBenchmark] = useState(true)
  const [proposals, setProposals] = useState<SavedProposal[]>([])

  useEffect(() => {
    setCosts(loadCosts())
    setHasCosts(hasSavedCosts())
    setProfile(loadProfile())
    setShowBenchmark(loadPrefs().showBenchmark)
    setProposals(loadProposals())
  }, [])

  const seedDemo = () => {
    saveCosts(DEFAULT_COSTS)
    setCosts(DEFAULT_COSTS)
    setHasCosts(true)
  }

  const layer1 = useMemo(
    () =>
      calculateLayer1({
        monthlyExpenses: totalMonthlyExpenses(costs),
        desiredSalary: costs.desiredSalary,
        technicalReserve: costs.technicalReserve,
        profitMargin: costs.profitMargin / 100,
        availableHours: costs.availableHours,
        billablePercentage: costs.billablePercentage,
      }),
    [costs]
  )

  const capacityPct = costs.availableHours > 0 ? (layer1.billableHours / costs.availableHours) * 100 : 0
  const deadHours = costs.availableHours - layer1.billableHours

  const comp = [
    { key: 'expenses', label: 'Despesas', value: layer1.breakdown.expenses, color: COMP_COLORS.expenses },
    { key: 'salary', label: 'Pró-labore', value: layer1.breakdown.salary, color: COMP_COLORS.salary },
    { key: 'reserve', label: 'Reserva', value: layer1.breakdown.reserve, color: COMP_COLORS.reserve },
    { key: 'profit', label: 'Margem', value: layer1.breakdown.profit, color: COMP_COLORS.profit },
  ].map((c) => ({ ...c, pct: layer1.totalMonthlyCost > 0 ? (c.value / layer1.totalMonthlyCost) * 100 : 0 }))

  const scenarios = calculateHourlyRateScenarios({
    monthlyExpenses: totalMonthlyExpenses(costs),
    desiredSalary: costs.desiredSalary,
    technicalReserve: costs.technicalReserve,
    profitMargin: costs.profitMargin / 100,
    availableHours: costs.availableHours,
  })
  const scenList = [
    { label: 'Conservador', pctLabel: '50%', rate: scenarios.conservative.realHourlyRate, color: 'var(--color-text-muted)' },
    { label: 'Padrão', pctLabel: '60%', rate: scenarios.standard.realHourlyRate, color: 'var(--color-brand-yellow)' },
    { label: 'Otimista', pctLabel: '70%', rate: scenarios.optimistic.realHourlyRate, color: 'var(--color-brand-green)' },
  ]
  const scenMax = Math.max(...scenList.map((s) => s.rate), 1)

  const benchmarkRef = getBenchmarkServiceById('consultoria_hora')
  const tiers = benchmarkRef
    ? [
        { label: 'Júnior / Iniciante', rate: benchmarkRef.minRate, labelColor: 'var(--color-text-secondary)', barColor: 'var(--color-text-muted)' },
        { label: 'Você · calculado', rate: layer1.realHourlyRate, labelColor: 'var(--color-brand-red)', barColor: 'var(--color-brand-red)' },
        { label: 'Pleno / Sênior', rate: benchmarkRef.recommendedRate, labelColor: 'var(--color-text-secondary)', barColor: 'var(--color-brand-yellow)' },
        { label: 'Estúdio / Agência', rate: benchmarkRef.maxRate, labelColor: 'var(--color-text-secondary)', barColor: 'var(--color-brand-green)' },
      ].sort((a, b) => a.rate - b.rate)
    : []
  const tiersMax = Math.max(...tiers.map((t) => t.rate), 1)

  const pipeline = buildPipeline(proposals)
  const chartTotal = pipeline.reduce((s, b) => s + b.total, 0)
  const chartCount = pipeline.reduce((s, b) => s + b.count, 0)
  const chartAvg = chartCount > 0 ? chartTotal / chartCount : 0
  const chartMax = Math.max(...pipeline.map((b) => b.total), 1)
  const baseline = 150
  const top = 12
  const points = pipeline.map((b, i) => ({
    cx: pipeline.length > 1 ? (i / (pipeline.length - 1)) * 620 : 310,
    cy: baseline - (b.total / chartMax) * (baseline - top),
    label: b.label,
    valueFmt: formatCurrency(b.total),
  }))
  const linePath = points.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.cx.toFixed(1)},${p.cy.toFixed(1)}`).join(' ')
  const areaPath = points.length
    ? `M${points[0].cx},${baseline} ${points.map((p) => `L${p.cx.toFixed(1)},${p.cy.toFixed(1)}`).join(' ')} L${points[points.length - 1].cx},${baseline} Z`
    : ''
  const bestMonth = pipeline.reduce((best, b) => (b.total > best.total ? b : best), pipeline[0])

  const pipelineOpen = proposals.reduce((s, p) => s + p.result.quote.recommended, 0)

  return (
    <>
      <PageContent>
        <div className="flex flex-col gap-6">
          <PageHeader
            label="Centro de comando"
            title="Dashboard"
            description="Visão geral do seu valor-hora, capacidade e pipeline de propostas."
            actions={
              <Link
                href="/custos"
                className="flex items-center gap-2 h-10 px-3.5 border border-[var(--color-border)] text-[var(--color-text)] text-xs font-700 tracking-wide uppercase rounded-[var(--radius-md)] hover:bg-[var(--color-surface)] transition-colors"
              >
                <Wallet size={15} />
                Ajustar custos
              </Link>
            }
          />

          {!hasCosts && (
            <div
              className="flex flex-col gap-5 p-9 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-lg)]"
              style={{ borderTop: '2px solid var(--color-brand-red)' }}
            >
              <div className="flex items-center gap-3">
                <span className="flex items-center justify-center w-10 h-10 bg-[var(--color-brand-red)]/10 border border-[var(--color-brand-red)]/30 text-[var(--color-brand-red)] rounded-[var(--radius-md)]">
                  <AlertTriangle size={19} />
                </span>
                <span className="label-uppercase text-[var(--color-brand-red)]">Primeiro acesso</span>
              </div>
              <h2 className="text-display-sm text-[var(--color-text)] max-w-[26ch]">Seu valor-hora ainda não existe.</h2>
              <p className="text-sm leading-relaxed text-[var(--color-text-secondary)] max-w-[60ch]">
                Nenhum custo configurado — então nenhum número aqui seria verdade. Preencha despesas, pró-labore e horas faturáveis: leva três minutos e libera todo o resto do sistema.
              </p>
              <div className="flex flex-wrap gap-2.5">
                <Link
                  href="/custos"
                  className="flex items-center gap-2.5 h-[46px] px-5 bg-[var(--color-brand-red)] text-white font-display font-900 text-sm tracking-wide uppercase rounded-[var(--radius-md)] hover:brightness-110 transition-[filter]"
                >
                  Configurar meus custos
                  <ArrowRight size={16} />
                </Link>
                <button
                  type="button"
                  onClick={seedDemo}
                  className="h-[46px] px-[18px] border border-[var(--color-border)] text-[var(--color-text)] font-display font-800 text-sm tracking-wide uppercase rounded-[var(--radius-md)] hover:bg-[var(--color-surface-raised)] transition-colors"
                >
                  Ver com dados de exemplo
                </button>
              </div>
              <div className="grid gap-3 pt-2 border-t border-[var(--color-border)]" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))' }}>
                {['Configure custos e horas', 'Defina regime tributário no perfil', 'Calcule o primeiro orçamento'].map((t, i) => (
                  <div key={t} className="flex flex-col gap-1">
                    <span className="numeric-display text-2xl text-[var(--color-text-muted)]">{String(i + 1).padStart(2, '0')}</span>
                    <span className="text-xs text-[var(--color-text-secondary)]">{t}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {hasCosts && (
            <div className="flex flex-col gap-6">
              {/* Hero + capacidade */}
              <div className="grid gap-4" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
                <div
                  className="flex flex-col gap-[18px] p-7 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-lg)]"
                  style={{ borderTop: '2px solid var(--color-brand-red)' }}
                >
                  <div className="flex items-start justify-between gap-3">
                    <span className="label-uppercase">Valor-hora real · piso técnico</span>
                    <Zap size={18} className="text-[var(--color-brand-red)]" />
                  </div>
                  <div className="flex items-baseline gap-2 flex-wrap">
                    <span className="numeric-display leading-[.9] text-[var(--color-text)]" style={{ fontSize: 'clamp(48px,9vw,84px)' }}>
                      {formatCurrency(layer1.realHourlyRate)}
                    </span>
                    <span className="font-display font-800 text-xl uppercase text-[var(--color-text-muted)]">/ hora</span>
                  </div>
                  <p className="text-sm leading-relaxed text-[var(--color-text-secondary)]">
                    Abaixo disso você paga para trabalhar. Calculado sobre {layer1.billableHours.toFixed(0)}h faturáveis e {formatCurrency(layer1.totalMonthlyCost)} de custo mensal.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[var(--color-brand-green)]/[.15] border border-[var(--color-brand-green)]/30 text-[var(--color-brand-green)] text-2xs font-700 tracking-wide uppercase rounded-[var(--radius-sm)]">
                      Piso técnico ativo
                    </span>
                    {profile && (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[var(--color-surface-raised)] border border-[var(--color-border)] text-[var(--color-text-secondary)] text-2xs font-700 tracking-wide uppercase rounded-[var(--radius-sm)]">
                        Regime {profile.taxRegime.replace('_', ' ')}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex flex-col gap-4 p-7 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-lg)]">
                  <span className="label-uppercase">Capacidade faturável</span>
                  <div className="flex items-center gap-5 flex-wrap">
                    <div className="relative w-[132px] h-[132px] flex-shrink-0">
                      <svg viewBox="0 0 42 42" width={132} height={132} style={{ transform: 'rotate(-90deg)' }}>
                        <circle cx="21" cy="21" r="15.9155" fill="none" stroke="var(--color-surface-raised)" strokeWidth="4" />
                        <circle
                          cx="21" cy="21" r="15.9155" fill="none"
                          stroke="var(--color-brand-yellow)" strokeWidth="4" strokeLinecap="butt"
                          strokeDasharray={`${Math.max(0, Math.min(100, capacityPct))} 100`}
                          pathLength={100}
                        />
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center gap-0.5">
                        <span className="numeric-display text-[30px] text-[var(--color-text)]">{capacityPct.toFixed(0)}%</span>
                        <span className="text-2xs tracking-wide uppercase text-[var(--color-text-muted)]">faturável</span>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2.5 min-w-[140px]">
                      <div className="flex flex-col gap-0.5">
                        <span className="numeric-display text-2xl text-[var(--color-text)]">{layer1.billableHours.toFixed(0)}h</span>
                        <span className="text-xs text-[var(--color-text-secondary)]">faturáveis de {costs.availableHours}h disponíveis</span>
                      </div>
                      <div className="flex flex-col gap-0.5">
                        <span className="numeric-display text-2xl text-[var(--color-text-muted)]">{deadHours.toFixed(0)}h</span>
                        <span className="text-xs text-[var(--color-text-secondary)]">horas não faturáveis · orçamento, admin, prospecção</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Composição + cenários */}
              <div className="grid gap-4" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))' }}>
                <div className="flex flex-col gap-5 p-7 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-lg)]">
                  <div className="flex items-start justify-between gap-3 pb-3.5 border-b border-[var(--color-border)]">
                    <div className="flex flex-col gap-1">
                      <span className="label-uppercase text-[var(--color-brand-red)]">Composição do custo mensal</span>
                      <h3 className="text-display-sm text-[var(--color-text)]">Para onde vai cada real</h3>
                    </div>
                    <Layers size={20} className="text-[var(--color-text-muted)]" />
                  </div>
                  <div className="flex h-[26px] w-full bg-[var(--color-bg)] border border-[var(--color-border)] rounded-[var(--radius-sm)] overflow-hidden gap-0.5 p-0.5">
                    {comp.map((c) => (
                      <div key={c.key} style={{ width: `${c.pct}%`, backgroundColor: c.color }} className="h-full rounded-[1px]" title={c.label} />
                    ))}
                  </div>
                  <div className="grid gap-3" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))' }}>
                    {comp.map((c) => (
                      <div key={c.key} className="flex flex-col gap-1 p-3 bg-[var(--color-bg)] border border-[var(--color-border)] rounded-[var(--radius-md)]">
                        <div className="flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: c.color }} />
                          <span className="text-2xs font-700 tracking-wide uppercase text-[var(--color-text-secondary)]">{c.label}</span>
                        </div>
                        <span className="numeric-display text-[19px] text-[var(--color-text)]">{formatCurrency(c.value)}</span>
                        <span className="text-2xs text-[var(--color-text-muted)]">{c.pct.toFixed(0)}% do total</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col gap-5 p-7 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-lg)]">
                  <div className="flex items-start justify-between gap-3 pb-3.5 border-b border-[var(--color-border)]">
                    <div className="flex flex-col gap-1">
                      <span className="label-uppercase text-[var(--color-brand-yellow)]">Cenários de aproveitamento</span>
                      <h3 className="text-display-sm text-[var(--color-text)]">Se você faturar menos horas</h3>
                    </div>
                    <TrendingUp size={20} className="text-[var(--color-text-muted)]" />
                  </div>
                  <div className="flex items-end gap-3.5 h-[180px] pb-0.5">
                    {scenList.map((s) => (
                      <div key={s.label} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                        <span className="numeric-display text-base" style={{ color: s.color }}>{formatCurrency(s.rate)}</span>
                        <div
                          className="w-full rounded-t-[var(--radius-sm)]"
                          style={{ height: `${Math.max(8, (s.rate / scenMax) * 130)}px`, backgroundColor: s.color, minHeight: 8 }}
                        />
                        <span className="text-2xs font-700 tracking-wide uppercase text-[var(--color-text-secondary)] text-center">{s.label}</span>
                        <span className="text-2xs text-[var(--color-text-muted)]">{s.pctLabel}</span>
                      </div>
                    ))}
                  </div>
                  <p className="text-xs leading-relaxed text-[var(--color-text-muted)]">
                    Mês fraco de captação? O piso sobe. Use o cenário conservador para negociar contratos longos.
                  </p>
                </div>
              </div>

              {/* Benchmark ADG */}
              {showBenchmark && tiers.length > 0 && (
                <div className="flex flex-col gap-4 p-7 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-lg)]">
                  <div className="flex items-start justify-between gap-3 pb-3.5 border-b border-[var(--color-border)]">
                    <div className="flex flex-col gap-1">
                      <span className="label-uppercase text-[var(--color-brand-yellow)]">Referência de mercado · ADG Brasil / Adegraf</span>
                      <h3 className="text-display-sm text-[var(--color-text)]">Onde seu valor-hora se posiciona</h3>
                    </div>
                    <BarChart3 size={20} className="text-[var(--color-text-muted)]" />
                  </div>
                  <div className="flex flex-col gap-2.5">
                    {tiers.map((t) => (
                      <div key={t.label} className="flex flex-col gap-1.5">
                        <div className="flex items-center justify-between gap-3">
                          <span className="text-xs font-700" style={{ color: t.labelColor }}>{t.label}</span>
                          <span className="numeric-display text-base" style={{ color: t.labelColor }}>{formatCurrency(t.rate)}</span>
                        </div>
                        <div className="h-2 w-full bg-[var(--color-bg)] border border-[var(--color-border)] rounded-full overflow-hidden">
                          <div className="h-full" style={{ width: `${(t.rate / tiersMax) * 100}%`, backgroundColor: t.barColor }} />
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center gap-2.5 p-3 bg-[var(--color-bg)] border border-[var(--color-border)] rounded-[var(--radius-md)]">
                    <Info size={16} className="text-[var(--color-brand-blue)] flex-shrink-0" />
                    <span className="text-2xs leading-relaxed text-[var(--color-text-secondary)]">
                      As tabelas não são travas fixas: servem para ancoragem e negociação. Seu piso continua sendo o cálculo da Camada 1.
                    </span>
                  </div>
                </div>
              )}

              {/* Evolução do pipeline */}
              <div className="flex flex-col gap-4 p-7 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-lg)]">
                <div className="flex flex-wrap items-start justify-between gap-3.5 pb-3.5 border-b border-[var(--color-border)]">
                  <div className="flex flex-col gap-1">
                    <span className="label-uppercase text-[var(--color-brand-red)]">Últimos 6 meses</span>
                    <h3 className="text-display-sm text-[var(--color-text)]">Evolução do pipeline</h3>
                  </div>
                  <div className="flex flex-wrap gap-5">
                    <div className="flex flex-col">
                      <span className="label-uppercase">Total</span>
                      <span className="numeric-display text-xl text-[var(--color-text)]">{formatCurrency(chartTotal)}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="label-uppercase">Ticket médio</span>
                      <span className="numeric-display text-xl text-[var(--color-text)]">{formatCurrency(chartAvg)}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="label-uppercase">Propostas</span>
                      <span className="numeric-display text-xl text-[var(--color-text)]">{chartCount}</span>
                    </div>
                  </div>
                </div>

                {chartCount === 0 ? (
                  <div className="flex flex-col gap-2.5 items-start p-8 border border-dashed border-[var(--color-border)] rounded-[var(--radius-md)]">
                    <span className="font-display font-800 text-[17px] uppercase tracking-tight text-[var(--color-text)]">Sem histórico ainda</span>
                    <span className="text-xs leading-relaxed text-[var(--color-text-secondary)] max-w-[50ch]">
                      A curva aparece a partir da primeira proposta salva. Cada orçamento entra no mês em que foi calculado.
                    </span>
                  </div>
                ) : (
                  <div className="flex flex-col gap-2.5">
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-2xs font-mono text-[var(--color-text-muted)]">{formatCurrency(chartMax)}</span>
                      <span className="text-2xs text-[var(--color-text-muted)]">pico do período · melhor mês {bestMonth?.label} com {formatCurrency(bestMonth?.total ?? 0)}</span>
                    </div>
                    <svg viewBox="0 0 620 170" preserveAspectRatio="none" style={{ width: '100%', height: 190, display: 'block', overflow: 'visible' }}>
                      <line x1="0" y1={baseline} x2="620" y2={baseline} stroke="var(--color-border)" strokeWidth={1} vectorEffect="non-scaling-stroke" />
                      <line x1="0" y1={top + (baseline - top) * 0.33} x2="620" y2={top + (baseline - top) * 0.33} stroke="var(--color-border-subtle)" strokeWidth={1} strokeDasharray="3 4" vectorEffect="non-scaling-stroke" />
                      <line x1="0" y1={top + (baseline - top) * 0.66} x2="620" y2={top + (baseline - top) * 0.66} stroke="var(--color-border-subtle)" strokeWidth={1} strokeDasharray="3 4" vectorEffect="non-scaling-stroke" />
                      <path d={areaPath} fill="rgba(255,0,0,.14)" />
                      <path d={linePath} fill="none" stroke="var(--color-brand-red)" strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
                      {points.map((p) => (
                        <circle key={p.label} cx={p.cx} cy={p.cy} r={4} fill="var(--color-bg)" stroke="var(--color-brand-red)" strokeWidth={2} vectorEffect="non-scaling-stroke" />
                      ))}
                    </svg>
                    <div className="grid gap-1.5" style={{ gridTemplateColumns: 'repeat(6, 1fr)' }}>
                      {points.map((p) => (
                        <div key={p.label} className="flex flex-col items-center gap-0.5">
                          <span className="text-2xs font-700 tracking-wide uppercase text-[var(--color-text-secondary)]">{p.label}</span>
                          <span className="font-mono text-[10px] text-[var(--color-text-muted)] text-center">{p.valueFmt}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Orçamentos salvos */}
              <div className="flex flex-col bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-lg)] overflow-hidden">
                <div className="flex flex-wrap items-center justify-between gap-3.5 px-6 py-5 border-b border-[var(--color-border)]">
                  <div className="flex flex-col gap-1">
                    <span className="label-uppercase text-[var(--color-brand-red)]">Pipeline · {formatCurrency(pipelineOpen)}</span>
                    <h3 className="text-display-sm text-[var(--color-text)]">Orçamentos salvos</h3>
                  </div>
                  <Link
                    href="/propostas"
                    className="flex items-center gap-2 h-[38px] px-3.5 border border-[var(--color-border)] text-[var(--color-text)] text-xs font-700 tracking-wide uppercase rounded-[var(--radius-md)] hover:bg-[var(--color-surface-raised)] transition-colors"
                  >
                    Ver todas
                    <ArrowRight size={14} />
                  </Link>
                </div>
                {proposals.length === 0 ? (
                  <div className="flex flex-col items-start gap-3.5 px-6 py-9">
                    <FileText size={26} className="text-[var(--color-text-muted)]" />
                    <h4 className="font-display font-800 text-[19px] uppercase tracking-tight text-[var(--color-text)]">Nenhum orçamento ainda</h4>
                    <p className="text-sm text-[var(--color-text-secondary)] max-w-[48ch] leading-relaxed">
                      Seus orçamentos calculados aparecerão aqui. Comece pelo botão acima.
                    </p>
                    <Link
                      href="/calcular"
                      className="flex items-center gap-2 h-[42px] px-[18px] bg-[var(--color-brand-red)] text-white font-display font-900 text-sm tracking-wide uppercase rounded-[var(--radius-md)] hover:brightness-110 transition-[filter]"
                    >
                      Calcular primeiro orçamento
                    </Link>
                  </div>
                ) : (
                  <div className="flex flex-col">
                    {proposals.slice(0, 5).map((p) => (
                      <div key={p.id} className="flex flex-wrap items-center gap-3.5 px-6 py-4 border-b border-[var(--color-border-subtle)] last:border-b-0">
                        <div className="flex flex-col gap-0.5 flex-1 min-w-[180px]">
                          <span className="font-display font-800 text-base uppercase tracking-tight text-[var(--color-text)]">
                            {p.clientName || p.projectName}
                          </span>
                          <span className="text-xs text-[var(--color-text-secondary)]">{p.projectName}</span>
                        </div>
                        <div className="flex flex-col gap-0.5 min-w-[96px]">
                          <span className="label-uppercase">Horas</span>
                          <span className="text-sm font-700 text-[var(--color-text)]">{p.form.estimatedHours}h</span>
                        </div>
                        <div className="flex flex-col gap-0.5 min-w-[130px]">
                          <span className="label-uppercase">Recomendado</span>
                          <span className="numeric-display text-xl text-[var(--color-text)]">{formatCurrency(p.result.quote.recommended)}</span>
                        </div>
                        <div className="flex flex-col gap-0.5 min-w-[110px]">
                          <span className="label-uppercase">Data</span>
                          <span className="text-xs text-[var(--color-text-muted)]">{p.date}</span>
                        </div>
                        <Link
                          href={`/propostas/preview?id=${p.id}`}
                          className="flex items-center gap-1.5 h-9 px-3 border border-[var(--color-border)] text-[var(--color-text)] text-[11px] font-700 tracking-wide uppercase rounded-[var(--radius-md)] hover:bg-[var(--color-surface-raised)] transition-colors"
                        >
                          Abrir
                        </Link>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </PageContent>
    </>
  )
}
