'use client'

import { useEffect, useState } from 'react'
import { PageContent, PageHeader } from '@/shared/components/layout/shell'
import { calculateLayer1Action, calculateHourlyRateScenariosAction } from '@/modules/pricing/lib/actions'
import { formatCurrency } from '@/shared/lib/utils'
import { DEFAULT_COSTS, loadCosts, saveCosts, type SavedExpense } from '@/shared/lib/storage'
import { Button } from '@/shared/components/ui/button'
import { Plus, Trash2, Clock, CheckCircle2 } from 'lucide-react'

const COMP_COLORS = {
  expenses: 'var(--color-brand-blue)',
  salary: 'var(--color-brand-yellow)',
  reserve: 'var(--color-brand-purple)',
  profit: 'var(--color-brand-green)',
} as const

const EMPTY_LAYER1 = {
  billableHours: 0,
  totalMonthlyCost: 0,
  realHourlyRate: 0,
  breakdown: { expenses: 0, salary: 0, reserve: 0, profit: 0 },
}

export default function CustosPage() {
  const [expenses, setExpenses] = useState<SavedExpense[]>(DEFAULT_COSTS.expenses)
  const [desiredSalary, setDesiredSalary] = useState(DEFAULT_COSTS.desiredSalary)
  const [technicalReserve, setTechnicalReserve] = useState(DEFAULT_COSTS.technicalReserve)
  const [profitMargin, setProfitMargin] = useState(DEFAULT_COSTS.profitMargin)
  const [availableHours, setAvailableHours] = useState(DEFAULT_COSTS.availableHours)
  const [billablePercentage, setBillablePercentage] = useState(DEFAULT_COSTS.billablePercentage)
  const [saved, setSaved] = useState(false)

  const [result, setResult] = useState<Awaited<ReturnType<typeof calculateLayer1Action>>>(EMPTY_LAYER1)
  const [scenarios, setScenarios] = useState<Awaited<ReturnType<typeof calculateHourlyRateScenariosAction>> | null>(null)
  const [calculating, setCalculating] = useState(false)

  useEffect(() => {
    const costs = loadCosts()
    setExpenses(costs.expenses)
    setDesiredSalary(costs.desiredSalary)
    setTechnicalReserve(costs.technicalReserve)
    setProfitMargin(costs.profitMargin)
    setAvailableHours(costs.availableHours)
    setBillablePercentage(costs.billablePercentage)

    const totalExpenses = costs.expenses.reduce((sum, e) => sum + e.amount, 0)
    const layer1Input = {
      monthlyExpenses: totalExpenses,
      desiredSalary: costs.desiredSalary,
      technicalReserve: costs.technicalReserve,
      profitMargin: costs.profitMargin / 100,
      availableHours: costs.availableHours,
      billablePercentage: costs.billablePercentage,
    }
    calculateLayer1Action(layer1Input).then(setResult)
    calculateHourlyRateScenariosAction(layer1Input).then(setScenarios)
  }, [])

  /** Recalcula no servidor — chamado no blur de campo e após ações discretas (adicionar/remover despesa), nunca a cada tecla. */
  const recalculate = async (overrides?: { expenses?: SavedExpense[]; desiredSalary?: number; technicalReserve?: number; profitMargin?: number; availableHours?: number; billablePercentage?: number }) => {
    const next = {
      expenses: overrides?.expenses ?? expenses,
      desiredSalary: overrides?.desiredSalary ?? desiredSalary,
      technicalReserve: overrides?.technicalReserve ?? technicalReserve,
      profitMargin: overrides?.profitMargin ?? profitMargin,
      availableHours: overrides?.availableHours ?? availableHours,
      billablePercentage: overrides?.billablePercentage ?? billablePercentage,
    }
    const totalExpenses = next.expenses.reduce((sum, e) => sum + e.amount, 0)
    const layer1Input = {
      monthlyExpenses: totalExpenses,
      desiredSalary: next.desiredSalary,
      technicalReserve: next.technicalReserve,
      profitMargin: next.profitMargin / 100,
      availableHours: next.availableHours,
      billablePercentage: next.billablePercentage,
    }
    setCalculating(true)
    try {
      const [r, s] = await Promise.all([
        calculateLayer1Action(layer1Input),
        calculateHourlyRateScenariosAction(layer1Input),
      ])
      setResult(r)
      setScenarios(s)
    } finally {
      setCalculating(false)
    }
  }

  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0)

  const comp = [
    { key: 'expenses', label: 'Despesas fixas', value: result.breakdown.expenses, color: COMP_COLORS.expenses },
    { key: 'salary', label: 'Pró-labore', value: result.breakdown.salary, color: COMP_COLORS.salary },
    { key: 'reserve', label: 'Reserva técnica', value: result.breakdown.reserve, color: COMP_COLORS.reserve },
    { key: 'profit', label: 'Margem de lucro', value: result.breakdown.profit, color: COMP_COLORS.profit },
  ].map((c) => ({ ...c, pct: result.totalMonthlyCost > 0 ? (c.value / result.totalMonthlyCost) * 100 : 0 }))

  const scenList = scenarios ? [
    { label: 'Conservador', pctLabel: '50% faturável', rate: scenarios.conservative.realHourlyRate },
    { label: 'Padrão', pctLabel: '60% faturável', rate: scenarios.standard.realHourlyRate },
    { label: 'Otimista', pctLabel: '70% faturável', rate: scenarios.optimistic.realHourlyRate },
  ] : []

  const addExpense = () => {
    const next = [...expenses, { id: Date.now().toString(), label: '', amount: 0, category: 'other' }]
    setExpenses(next)
    recalculate({ expenses: next })
  }
  const removeExpense = (id: string) => {
    const next = expenses.filter((e) => e.id !== id)
    setExpenses(next)
    recalculate({ expenses: next })
  }
  const updateExpense = (id: string, patch: Partial<SavedExpense>) =>
    setExpenses((prev) => prev.map((e) => (e.id === id ? { ...e, ...patch } : e)))

  const handleReset = () => {
    setExpenses(DEFAULT_COSTS.expenses)
    setDesiredSalary(DEFAULT_COSTS.desiredSalary)
    setTechnicalReserve(DEFAULT_COSTS.technicalReserve)
    setProfitMargin(DEFAULT_COSTS.profitMargin)
    setAvailableHours(DEFAULT_COSTS.availableHours)
    setBillablePercentage(DEFAULT_COSTS.billablePercentage)
    recalculate({
      expenses: DEFAULT_COSTS.expenses,
      desiredSalary: DEFAULT_COSTS.desiredSalary,
      technicalReserve: DEFAULT_COSTS.technicalReserve,
      profitMargin: DEFAULT_COSTS.profitMargin,
      availableHours: DEFAULT_COSTS.availableHours,
      billablePercentage: DEFAULT_COSTS.billablePercentage,
    })
  }

  const handleSave = () => {
    saveCosts({ expenses, desiredSalary, technicalReserve, profitMargin, availableHours, billablePercentage })
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const liveBillable = `${result.billableHours.toFixed(0)}h`

  return (
    <PageContent>
      <div className="flex flex-col gap-[22px]">
        <PageHeader
          label="Camada 01 · custo de existência"
          title="Meus custos"
          description="Tudo que você paga para existir como profissional, dividido pelas horas que realmente fatura. É daqui que sai o seu piso."
          actions={
            <>
              <Button type="button" variant="secondary" onClick={handleReset}>
                Limpar
              </Button>
              <Button type="button" variant="primary" onClick={handleSave}>
                <CheckCircle2 size={15} />
                {saved ? 'Custos salvos' : 'Salvar custos'}
              </Button>
            </>
          }
        />

        <div className="grid gap-4 items-start" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
          <div className="flex flex-col gap-4">
            <section className="flex flex-col gap-4 p-5 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-card)]">
              <div className="flex flex-col gap-1">
                <span className="label-uppercase text-[var(--color-brand-blue)]">Despesas fixas mensais</span>
                <h3 className="h2 text-[var(--color-text)]">O que sai da conta todo mês</h3>
                <p className="text-xs leading-relaxed text-[var(--color-text-secondary)]">
                  Internet, softwares, equipamento amortizado, contador, coworking, impostos fixos.
                </p>
              </div>
              {expenses.length === 0 && (
                <div className="flex flex-col items-start gap-2 p-6 border border-dashed border-[var(--color-border)] rounded-[var(--radius-md)]">
                  <span className="text-sm font-700 text-[var(--color-text)]">Nenhuma despesa lançada</span>
                  <span className="text-xs leading-relaxed text-[var(--color-text-secondary)] max-w-[44ch]">
                    Comece pelas três maiores: assinatura de software, estrutura e contador.
                  </span>
                </div>
              )}
              <div className="flex flex-col gap-2.5">
                {expenses.map((e) => (
                  <div key={e.id} className="flex flex-wrap gap-2.5 items-end">
                    <label className="flex flex-col gap-1.5 flex-1 min-w-[160px]">
                      <span className="label-uppercase">Descrição</span>
                      <input
                        value={e.label}
                        onChange={(ev) => updateExpense(e.id, { label: ev.target.value })}
                        placeholder="Ex.: Adobe Creative Cloud"
                        className="h-[var(--control-h)] w-full px-3 bg-[var(--color-bg)] border border-[var(--color-border-strong)] text-sm text-[var(--color-text)] rounded-[var(--radius-md)] outline-none focus:border-[var(--color-brand-red)]"
                      />
                    </label>
                    <label className="flex flex-col gap-1.5 w-[140px]">
                      <span className="label-uppercase">Valor / mês</span>
                      <input
                        type="number"
                        value={e.amount || ''}
                        onChange={(ev) => updateExpense(e.id, { amount: parseFloat(ev.target.value) || 0 })}
                        onBlur={() => recalculate()}
                        placeholder="0"
                        className="h-[var(--control-h)] w-full px-3 bg-[var(--color-bg)] border border-[var(--color-border-strong)] font-mono text-sm text-[var(--color-text)] rounded-[var(--radius-md)] outline-none focus:border-[var(--color-brand-red)]"
                      />
                    </label>
                    <Button
                      type="button"
                      variant="secondary"
                      size="icon"
                      onClick={() => removeExpense(e.id)}
                      title="Remover despesa"
                      className="text-[var(--color-text-muted)] hover:text-[var(--color-brand-red)]"
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>
                ))}
              </div>
              <Button
                type="button"
                variant="secondary"
                onClick={addExpense}
                className="self-start"
              >
                <Plus size={15} />
                Adicionar despesa
              </Button>
              <div className="flex items-center justify-between gap-3 pt-3.5 border-t border-[var(--color-border)]">
                <span className="label-uppercase">Total de despesas</span>
                <span className="numeric-display text-2xl text-[var(--color-text)]">{formatCurrency(totalExpenses)}</span>
              </div>
            </section>

            <section className="flex flex-col gap-4 p-5 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-card)]">
              <div className="flex flex-col gap-1">
                <span className="label-uppercase text-[var(--color-brand-yellow)]">Remuneração e reservas</span>
                <h3 className="h2 text-[var(--color-text)]">Quanto você quer receber</h3>
              </div>
              <div className="grid gap-3.5" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))' }}>
                <label className="flex flex-col gap-1.5">
                  <span className="label-uppercase">Pró-labore desejado</span>
                  <input
                    type="number"
                    value={desiredSalary || ''}
                    onChange={(e) => setDesiredSalary(parseFloat(e.target.value) || 0)}
                    onBlur={() => recalculate()}
                    placeholder="0"
                    className="h-[var(--control-h)] px-3 bg-[var(--color-bg)] border border-[var(--color-border-strong)] font-mono text-sm text-[var(--color-text)] rounded-[var(--radius-md)] outline-none focus:border-[var(--color-brand-red)]"
                  />
                  <span className="text-2xs text-[var(--color-text-muted)]">O que você quer depositar na sua conta todo mês</span>
                </label>
                <label className="flex flex-col gap-1.5">
                  <span className="label-uppercase">Reserva técnica / mês</span>
                  <input
                    type="number"
                    value={technicalReserve || ''}
                    onChange={(e) => setTechnicalReserve(parseFloat(e.target.value) || 0)}
                    onBlur={() => recalculate()}
                    placeholder="0"
                    className="h-[var(--control-h)] px-3 bg-[var(--color-bg)] border border-[var(--color-border-strong)] font-mono text-sm text-[var(--color-text)] rounded-[var(--radius-md)] outline-none focus:border-[var(--color-brand-red)]"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const suggested = Math.round(desiredSalary * 0.1)
                      setTechnicalReserve(suggested)
                      recalculate({ technicalReserve: suggested })
                    }}
                    className="self-start text-2xs text-[var(--color-brand-red)]"
                  >
                    Usar sugestão: 10% do pró-labore
                  </button>
                </label>
                <label className="flex flex-col gap-1.5">
                  <span className="label-uppercase">Margem de lucro (%)</span>
                  <input
                    type="number"
                    value={profitMargin}
                    onChange={(e) => setProfitMargin(parseFloat(e.target.value) || 0)}
                    onBlur={() => recalculate()}
                    className="h-[var(--control-h)] px-3 bg-[var(--color-bg)] border border-[var(--color-border-strong)] font-mono text-sm text-[var(--color-text)] rounded-[var(--radius-md)] outline-none focus:border-[var(--color-brand-red)]"
                  />
                  <span className="text-2xs text-[var(--color-text-muted)]">Lucro sobre o custo base · reinvestimento</span>
                </label>
              </div>
            </section>

            <section className="flex flex-col gap-4 p-5 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-card)]">
              <div className="flex flex-col gap-1">
                <span className="label-uppercase text-[var(--color-brand-green)]">Capacidade de trabalho</span>
                <h3 className="h2 text-[var(--color-text)]">Horas que existem × horas que faturam</h3>
              </div>
              <div className="grid gap-3.5" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))' }}>
                <label className="flex flex-col gap-1.5">
                  <span className="label-uppercase">Horas disponíveis / mês</span>
                  <input
                    type="number"
                    value={availableHours}
                    onChange={(e) => setAvailableHours(parseFloat(e.target.value) || 0)}
                    onBlur={() => recalculate()}
                    className="h-[var(--control-h)] px-3 bg-[var(--color-bg)] border border-[var(--color-border-strong)] font-mono text-sm text-[var(--color-text)] rounded-[var(--radius-md)] outline-none focus:border-[var(--color-brand-red)]"
                  />
                  <span className="text-2xs text-[var(--color-text-muted)]">Padrão: 176h = 22 dias × 8h</span>
                </label>
                <label className="flex flex-col gap-1.5">
                  <span className="label-uppercase">Aproveitamento faturável (%)</span>
                  <input
                    type="number"
                    value={billablePercentage}
                    onChange={(e) => setBillablePercentage(parseFloat(e.target.value) || 0)}
                    onBlur={() => recalculate()}
                    className="h-[var(--control-h)] px-3 bg-[var(--color-bg)] border border-[var(--color-border-strong)] font-mono text-sm text-[var(--color-text)] rounded-[var(--radius-md)] outline-none focus:border-[var(--color-brand-red)]"
                  />
                  <span className="text-2xs text-[var(--color-text-muted)]">Ninguém fatura 100%: orçamento, admin e prospecção também consomem hora</span>
                </label>
              </div>
              <div className="flex items-center gap-2.5 p-3 bg-[var(--color-bg)] border border-[var(--color-border)] rounded-[var(--radius-md)]">
                <Clock size={16} className="text-[var(--color-brand-blue)] flex-shrink-0" />
                <span className="text-2xs leading-relaxed text-[var(--color-text-secondary)]">Resultado atual: {liveBillable} faturáveis por mês.</span>
              </div>
            </section>
          </div>

          <aside className="flex flex-col gap-4 sticky" style={{ top: 88 }}>
            <div
              className="flex flex-col gap-4 p-5 rounded-[var(--radius-card)] bg-[var(--color-slab-accent-bg)] border border-[var(--color-slab-accent-line)] [--color-text:var(--color-on-accent-1)] [--color-text-secondary:var(--color-on-accent-2)] [--color-text-muted:var(--color-on-accent-3)] text-[var(--color-on-accent-1)] transition-opacity"
              style={{ opacity: calculating ? 0.6 : 1 }}
            >
              <span className="label-uppercase">Valor-hora real</span>
              <span className="numeric-display leading-[.9] text-[var(--color-text)]" style={{ fontSize: 'clamp(40px,7vw,62px)' }}>
                {formatCurrency(result.realHourlyRate)}
              </span>
              <div className="flex flex-col gap-2 pt-3 border-t border-[var(--color-slab-accent-line)]">
                <div className="flex justify-between gap-2.5 text-xs">
                  <span className="text-[var(--color-text-secondary)]">Custo mensal total</span>
                  <span className="font-mono font-700 text-[var(--color-text)]">{formatCurrency(result.totalMonthlyCost)}</span>
                </div>
                <div className="flex justify-between gap-2.5 text-xs">
                  <span className="text-[var(--color-text-secondary)]">Horas faturáveis</span>
                  <span className="font-mono font-700 text-[var(--color-text)]">{liveBillable}</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-4 p-5 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-card)]">
              <span className="label-uppercase">Composição do custo</span>
              <div className="flex flex-col gap-2.5">
                {comp.map((c) => (
                  <div key={c.key} className="flex flex-col gap-1.5">
                    <div className="flex items-center justify-between gap-2.5">
                      <div className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: c.color }} />
                        <span className="text-xs text-[var(--color-text-secondary)]">{c.label}</span>
                      </div>
                      <span className="font-mono text-2xs font-700 text-[var(--color-text)]">{formatCurrency(c.value)}</span>
                    </div>
                    <div className="h-1.5 w-full bg-[var(--color-bg)] rounded-full overflow-hidden">
                      <div className="h-full rounded-full" style={{ width: `${c.pct}%`, backgroundColor: c.color }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-4 p-5 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-card)]">
              <span className="label-uppercase">Cenários de aproveitamento</span>
              {scenList.map((s) => (
                <div key={s.label} className="flex items-center justify-between gap-2.5 p-2.5 bg-[var(--color-bg)] border border-[var(--color-border)] rounded-[var(--radius-md)]">
                  <div className="flex flex-col">
                    <span className="text-xs font-700 text-[var(--color-text)]">{s.label}</span>
                    <span className="text-2xs text-[var(--color-text-muted)]">{s.pctLabel}</span>
                  </div>
                  <span className="numeric-display text-lg text-[var(--color-text)]">{formatCurrency(s.rate)}</span>
                </div>
              ))}
            </div>
          </aside>
        </div>
      </div>
    </PageContent>
  )
}
