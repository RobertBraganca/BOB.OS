'use client'

import { useEffect, useState } from 'react'
import { PageContent } from '@/shared/components/layout/shell'
import { calculateLayer1, calculateHourlyRateScenarios } from '@/modules/pricing/lib'
import { formatCurrency } from '@/shared/lib/utils'
import { DEFAULT_COSTS, loadCosts, saveCosts, type SavedExpense } from '@/shared/lib/storage'
import { Plus, Trash2, Clock, CheckCircle2 } from 'lucide-react'

const COMP_COLORS = {
  expenses: 'var(--color-brand-blue)',
  salary: 'var(--color-brand-yellow)',
  reserve: 'var(--color-brand-purple)',
  profit: 'var(--color-brand-green)',
} as const

export default function CustosPage() {
  const [expenses, setExpenses] = useState<SavedExpense[]>(DEFAULT_COSTS.expenses)
  const [desiredSalary, setDesiredSalary] = useState(DEFAULT_COSTS.desiredSalary)
  const [technicalReserve, setTechnicalReserve] = useState(DEFAULT_COSTS.technicalReserve)
  const [profitMargin, setProfitMargin] = useState(DEFAULT_COSTS.profitMargin)
  const [availableHours, setAvailableHours] = useState(DEFAULT_COSTS.availableHours)
  const [billablePercentage, setBillablePercentage] = useState(DEFAULT_COSTS.billablePercentage)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    const costs = loadCosts()
    setExpenses(costs.expenses)
    setDesiredSalary(costs.desiredSalary)
    setTechnicalReserve(costs.technicalReserve)
    setProfitMargin(costs.profitMargin)
    setAvailableHours(costs.availableHours)
    setBillablePercentage(costs.billablePercentage)
  }, [])

  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0)

  const result = calculateLayer1({
    monthlyExpenses: totalExpenses,
    desiredSalary,
    technicalReserve,
    profitMargin: profitMargin / 100,
    availableHours,
    billablePercentage,
  })

  const comp = [
    { key: 'expenses', label: 'Despesas fixas', value: result.breakdown.expenses, color: COMP_COLORS.expenses },
    { key: 'salary', label: 'Pró-labore', value: result.breakdown.salary, color: COMP_COLORS.salary },
    { key: 'reserve', label: 'Reserva técnica', value: result.breakdown.reserve, color: COMP_COLORS.reserve },
    { key: 'profit', label: 'Margem de lucro', value: result.breakdown.profit, color: COMP_COLORS.profit },
  ].map((c) => ({ ...c, pct: result.totalMonthlyCost > 0 ? (c.value / result.totalMonthlyCost) * 100 : 0 }))

  const scenarios = calculateHourlyRateScenarios({
    monthlyExpenses: totalExpenses,
    desiredSalary,
    technicalReserve,
    profitMargin: profitMargin / 100,
    availableHours,
  })
  const scenList = [
    { label: 'Conservador', pctLabel: '50% faturável', rate: scenarios.conservative.realHourlyRate },
    { label: 'Padrão', pctLabel: '60% faturável', rate: scenarios.standard.realHourlyRate },
    { label: 'Otimista', pctLabel: '70% faturável', rate: scenarios.optimistic.realHourlyRate },
  ]

  const addExpense = () => setExpenses((prev) => [...prev, { id: Date.now().toString(), label: '', amount: 0, category: 'other' }])
  const removeExpense = (id: string) => setExpenses((prev) => prev.filter((e) => e.id !== id))
  const updateExpense = (id: string, patch: Partial<SavedExpense>) =>
    setExpenses((prev) => prev.map((e) => (e.id === id ? { ...e, ...patch } : e)))

  const handleReset = () => {
    setExpenses(DEFAULT_COSTS.expenses)
    setDesiredSalary(DEFAULT_COSTS.desiredSalary)
    setTechnicalReserve(DEFAULT_COSTS.technicalReserve)
    setProfitMargin(DEFAULT_COSTS.profitMargin)
    setAvailableHours(DEFAULT_COSTS.availableHours)
    setBillablePercentage(DEFAULT_COSTS.billablePercentage)
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
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="flex flex-col gap-1.5">
            <span className="label-uppercase text-[var(--color-brand-red)]">Camada 01 · custo de existência</span>
            <h1 className="text-display-md text-[var(--color-text)]">Meus custos</h1>
            <p className="text-sm leading-relaxed text-[var(--color-text-secondary)] max-w-[56ch]">
              Tudo que você paga para existir como profissional, dividido pelas horas que realmente fatura. É daqui que sai o seu piso.
            </p>
          </div>
          <div className="flex gap-2.5 flex-wrap">
            <button
              type="button"
              onClick={handleReset}
              className="h-[42px] px-3.5 border border-[var(--color-border)] text-[var(--color-text-secondary)] text-xs font-700 tracking-wide uppercase rounded-[var(--radius-md)] hover:text-[var(--color-text)] hover:border-[var(--color-text-muted)] transition-colors"
            >
              Limpar
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="flex items-center gap-2 h-[42px] px-[18px] bg-[var(--color-brand-red)] text-white text-xs font-800 tracking-wide uppercase rounded-[var(--radius-md)] hover:brightness-110 transition-[filter]"
            >
              <CheckCircle2 size={15} />
              {saved ? 'Custos salvos' : 'Salvar custos'}
            </button>
          </div>
        </div>

        <div className="grid gap-4 items-start" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
          <div className="flex flex-col gap-4">
            <section className="flex flex-col gap-3.5 p-6 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-lg)]">
              <div className="flex flex-col gap-1">
                <span className="label-uppercase text-[var(--color-brand-blue)]">Despesas fixas mensais</span>
                <h3 className="text-display-sm text-[var(--color-text)]">O que sai da conta todo mês</h3>
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
                        className="h-[46px] w-full px-3 bg-[var(--color-bg)] border border-[var(--color-border)] text-sm text-[var(--color-text)] rounded-[var(--radius-md)] outline-none focus:border-[var(--color-brand-red)]"
                      />
                    </label>
                    <label className="flex flex-col gap-1.5 w-[140px]">
                      <span className="label-uppercase">Valor / mês</span>
                      <input
                        type="number"
                        value={e.amount || ''}
                        onChange={(ev) => updateExpense(e.id, { amount: parseFloat(ev.target.value) || 0 })}
                        placeholder="0"
                        className="h-[46px] w-full px-3 bg-[var(--color-bg)] border border-[var(--color-border)] font-mono text-sm text-[var(--color-text)] rounded-[var(--radius-md)] outline-none focus:border-[var(--color-brand-red)]"
                      />
                    </label>
                    <button
                      type="button"
                      onClick={() => removeExpense(e.id)}
                      title="Remover despesa"
                      className="flex items-center justify-center w-[46px] h-[46px] border border-[var(--color-border)] text-[var(--color-text-muted)] rounded-[var(--radius-md)] hover:text-[var(--color-brand-red)] hover:border-[var(--color-brand-red)] transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
              <button
                type="button"
                onClick={addExpense}
                className="flex items-center gap-2 self-start h-[42px] px-4 border border-dashed border-[var(--color-border)] text-[var(--color-text-secondary)] text-xs font-700 tracking-wide uppercase rounded-[var(--radius-md)] hover:text-[var(--color-text)] hover:border-[var(--color-brand-red)] transition-colors"
              >
                <Plus size={15} />
                Adicionar despesa
              </button>
              <div className="flex items-center justify-between gap-3 pt-3.5 border-t border-[var(--color-border)]">
                <span className="label-uppercase">Total de despesas</span>
                <span className="numeric-display text-2xl text-[var(--color-text)]">{formatCurrency(totalExpenses)}</span>
              </div>
            </section>

            <section className="flex flex-col gap-3.5 p-6 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-lg)]">
              <div className="flex flex-col gap-1">
                <span className="label-uppercase text-[var(--color-brand-yellow)]">Remuneração e reservas</span>
                <h3 className="text-display-sm text-[var(--color-text)]">Quanto você quer receber</h3>
              </div>
              <div className="grid gap-3.5" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))' }}>
                <label className="flex flex-col gap-1.5">
                  <span className="label-uppercase">Pró-labore desejado</span>
                  <input
                    type="number"
                    value={desiredSalary || ''}
                    onChange={(e) => setDesiredSalary(parseFloat(e.target.value) || 0)}
                    placeholder="0"
                    className="h-[46px] px-3 bg-[var(--color-bg)] border border-[var(--color-border)] font-mono text-sm text-[var(--color-text)] rounded-[var(--radius-md)] outline-none focus:border-[var(--color-brand-red)]"
                  />
                  <span className="text-2xs text-[var(--color-text-muted)]">O que você quer depositar na sua conta todo mês</span>
                </label>
                <label className="flex flex-col gap-1.5">
                  <span className="label-uppercase">Reserva técnica / mês</span>
                  <input
                    type="number"
                    value={technicalReserve || ''}
                    onChange={(e) => setTechnicalReserve(parseFloat(e.target.value) || 0)}
                    placeholder="0"
                    className="h-[46px] px-3 bg-[var(--color-bg)] border border-[var(--color-border)] font-mono text-sm text-[var(--color-text)] rounded-[var(--radius-md)] outline-none focus:border-[var(--color-brand-red)]"
                  />
                  <button
                    type="button"
                    onClick={() => setTechnicalReserve(Math.round(desiredSalary * 0.1))}
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
                    className="h-[46px] px-3 bg-[var(--color-bg)] border border-[var(--color-border)] font-mono text-sm text-[var(--color-text)] rounded-[var(--radius-md)] outline-none focus:border-[var(--color-brand-red)]"
                  />
                  <span className="text-2xs text-[var(--color-text-muted)]">Lucro sobre o custo base · reinvestimento</span>
                </label>
              </div>
            </section>

            <section className="flex flex-col gap-3.5 p-6 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-lg)]">
              <div className="flex flex-col gap-1">
                <span className="label-uppercase text-[var(--color-brand-green)]">Capacidade de trabalho</span>
                <h3 className="text-display-sm text-[var(--color-text)]">Horas que existem × horas que faturam</h3>
              </div>
              <div className="grid gap-3.5" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))' }}>
                <label className="flex flex-col gap-1.5">
                  <span className="label-uppercase">Horas disponíveis / mês</span>
                  <input
                    type="number"
                    value={availableHours}
                    onChange={(e) => setAvailableHours(parseFloat(e.target.value) || 0)}
                    className="h-[46px] px-3 bg-[var(--color-bg)] border border-[var(--color-border)] font-mono text-sm text-[var(--color-text)] rounded-[var(--radius-md)] outline-none focus:border-[var(--color-brand-red)]"
                  />
                  <span className="text-2xs text-[var(--color-text-muted)]">Padrão: 176h = 22 dias × 8h</span>
                </label>
                <label className="flex flex-col gap-1.5">
                  <span className="label-uppercase">Aproveitamento faturável (%)</span>
                  <input
                    type="number"
                    value={billablePercentage}
                    onChange={(e) => setBillablePercentage(parseFloat(e.target.value) || 0)}
                    className="h-[46px] px-3 bg-[var(--color-bg)] border border-[var(--color-border)] font-mono text-sm text-[var(--color-text)] rounded-[var(--radius-md)] outline-none focus:border-[var(--color-brand-red)]"
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
              className="flex flex-col gap-3.5 p-6 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-lg)]"
              style={{ borderTop: '2px solid var(--color-brand-red)' }}
            >
              <span className="label-uppercase">Valor-hora real · em tempo real</span>
              <span className="numeric-display leading-[.9] text-[var(--color-text)]" style={{ fontSize: 'clamp(40px,7vw,62px)' }}>
                {formatCurrency(result.realHourlyRate)}
              </span>
              <div className="flex flex-col gap-2 pt-3 border-t border-[var(--color-border)]">
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

            <div className="flex flex-col gap-3 p-6 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-lg)]">
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

            <div className="flex flex-col gap-3 p-6 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-lg)]">
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
