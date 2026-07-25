'use client'

import React, { useState, useCallback } from 'react'
import type { Metadata } from 'next'
import { PageHeader, PageContent } from '@/components/layout/shell'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input, CurrencyInput, PercentInput } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { calculateLayer1 } from '@/lib/pricing'
import { formatCurrency } from '@/lib/utils'
import type { ExpenseItem } from '@/schemas'
import { Plus, Trash2, Info, TrendingUp, Clock } from 'lucide-react'

// ─── Tipos locais ─────────────────────────────────────────────────────────────

interface ExpenseItemLocal extends ExpenseItem {
  id: string
}

const DEFAULT_EXPENSES: ExpenseItemLocal[] = [
  { id: '1', label: 'Internet', amount: 150, category: 'structure' },
  { id: '2', label: 'Adobe Creative Cloud', amount: 300, category: 'software' },
]

// ─── Componente principal ─────────────────────────────────────────────────────

export default function CustosPage() {
  const [expenses, setExpenses] = useState<ExpenseItemLocal[]>(DEFAULT_EXPENSES)
  const [desiredSalary, setDesiredSalary] = useState(5000)
  const [technicalReserve, setTechnicalReserve] = useState(500)
  const [profitMargin, setProfitMargin] = useState(15)
  const [availableHours, setAvailableHours] = useState(176)
  const [billablePercentage, setBillablePercentage] = useState(60)

  // Cálculo em tempo real (< 300ms — PRD RNF-01)
  const result = calculateLayer1({
    monthlyExpenses: expenses.reduce((sum, e) => sum + e.amount, 0),
    desiredSalary,
    technicalReserve,
    profitMargin: profitMargin / 100,
    availableHours,
    billablePercentage,
  })

  const addExpense = useCallback(() => {
    setExpenses(prev => [...prev, {
      id: Date.now().toString(),
      label: '',
      amount: 0,
      category: 'other',
    }])
  }, [])

  const removeExpense = useCallback((id: string) => {
    setExpenses(prev => prev.filter(e => e.id !== id))
  }, [])

  const updateExpense = useCallback((id: string, field: keyof ExpenseItemLocal, value: string | number) => {
    setExpenses(prev => prev.map(e => e.id === id ? { ...e, [field]: value } : e))
  }, [])

  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0)

  // Breakdown percentual da composição do custo
  const breakdownItems = [
    { label: 'Despesas Fixas', value: result.breakdown.expenses, color: 'blue' as const },
    { label: 'Pró-labore', value: result.breakdown.salary, color: 'yellow' as const },
    { label: 'Reserva Técnica', value: result.breakdown.reserve, color: 'purple' as const },
    { label: 'Margem de Lucro', value: result.breakdown.profit, color: 'green' as const },
  ]

  return (
    <>
      <PageHeader
        label="Configuração"
        title="Meus Custos"
        description="Configure seus custos mensais para calcular seu valor-hora real. Este dado é salvo no seu perfil e usado em todos os orçamentos."
      />

      <PageContent className="grid grid-cols-1 xl:grid-cols-[1fr_360px] gap-6 items-start">

        {/* ─── Coluna principal ──────────────────────────────────────────────── */}
        <div className="flex flex-col gap-6">

          {/* Despesas Fixas */}
          <Card>
            <CardHeader>
              <CardTitle>Despesas Fixas Mensais</CardTitle>
              <CardDescription>
                Tudo que você paga todo mês para existir como profissional: internet, softwares,
                equipamentos amortizados, contador, impostos fixos.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              {expenses.map((expense) => (
                <div key={expense.id} className="flex items-end gap-3">
                  <Input
                    label={expenses.indexOf(expense) === 0 ? 'Descrição' : undefined}
                    placeholder="Ex.: Adobe Creative Cloud"
                    value={expense.label}
                    onChange={(e) => updateExpense(expense.id, 'label', e.target.value)}
                    className="flex-1"
                  />
                  <CurrencyInput
                    label={expenses.indexOf(expense) === 0 ? 'Valor / mês' : undefined}
                    value={expense.amount}
                    onChange={(v) => updateExpense(expense.id, 'amount', v)}
                    className="w-36"
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeExpense(expense.id)}
                    className="text-[var(--color-text-muted)] hover:text-[var(--color-brand-red)] mb-0"
                    aria-label="Remover despesa"
                  >
                    <Trash2 size={14} />
                  </Button>
                </div>
              ))}

              <Button
                variant="ghost"
                size="sm"
                onClick={addExpense}
                className="self-start mt-1 text-[var(--color-text-muted)]"
              >
                <Plus size={14} className="mr-1.5" />
                Adicionar despesa
              </Button>

              <div className="flex items-center justify-between pt-3 border-t border-[var(--color-border)] mt-1">
                <span className="label-uppercase">Total de despesas</span>
                <span className="numeric-display text-xl text-[var(--color-text)]">
                  {formatCurrency(totalExpenses)}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Remuneração */}
          <Card>
            <CardHeader>
              <CardTitle>Remuneração e Reservas</CardTitle>
              <CardDescription>
                Quanto você quer receber por mês (pró-labore) e quanto precisa reservar para
                imprevistos e crescimento.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <CurrencyInput
                label="Pró-labore desejado"
                hint="Quanto você quer depositar na sua conta todo mês"
                value={desiredSalary}
                onChange={setDesiredSalary}
              />
              <CurrencyInput
                label="Reserva técnica / mês"
                hint="Fundo de emergência, férias, 13º — sugestão: 10% do pró-labore"
                value={technicalReserve}
                onChange={setTechnicalReserve}
              />
              <PercentInput
                label="Margem de lucro desejada"
                hint="Aplicada sobre o total de custos"
                value={profitMargin}
                onChange={setProfitMargin}
                min={0}
                max={100}
              />
            </CardContent>
          </Card>

          {/* Horas */}
          <Card>
            <CardHeader>
              <CardTitle>Capacidade de Trabalho</CardTitle>
              <CardDescription>
                Horas disponíveis ≠ horas faturáveis. Este é o conceito mais importante do motor
                de cálculo. Nem toda hora trabalhada é vendável.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-5">

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Horas disponíveis por mês"
                  hint="Padrão: 176h = 22 dias × 8h"
                  type="number"
                  value={availableHours}
                  onChange={(e) => setAvailableHours(parseInt(e.target.value) || 176)}
                  min={40}
                  max={744}
                />
                <PercentInput
                  label="% de aproveitamento faturável"
                  hint="Quanto das suas horas é realmente vendável (sugerido: 55-65%)"
                  value={billablePercentage}
                  onChange={setBillablePercentage}
                  min={10}
                  max={100}
                />
              </div>

              {/* Visualização das horas */}
              <div className="flex flex-col gap-3 p-4 bg-[var(--color-surface-raised)] rounded-[var(--radius-md)]">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[var(--color-text-muted)]">
                    Horas disponíveis: <strong className="text-[var(--color-text)]">{availableHours}h</strong>
                  </span>
                  <span className="text-[var(--color-text-muted)]">
                    Horas faturáveis: <strong className="text-[var(--color-brand-red)]">{result.billableHours.toFixed(0)}h</strong>
                  </span>
                </div>
                <Progress value={billablePercentage} color="red" size="md" />
                <div className="flex items-start gap-2">
                  <Info size={12} className="text-[var(--color-text-muted)] mt-0.5 flex-shrink-0" />
                  <p className="text-[0.65rem] text-[var(--color-text-muted)] leading-relaxed">
                    As {availableHours - result.billableHours}h restantes são consumidas por reuniões,
                    tarefas administrativas, prospecção, estudo e elaboração de propostas.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

        </div>

        {/* ─── Coluna lateral: resultado em tempo real ──────────────────────── */}
        <div className="flex flex-col gap-4 sticky top-6">

          {/* Valor-hora resultado */}
          <Card accent="red">
            <CardContent className="flex flex-col gap-4 p-6">
              <div className="flex items-center justify-between">
                <span className="label-uppercase">Sua hora vale</span>
                <Badge variant="red">Tempo real</Badge>
              </div>

              <div className="flex flex-col gap-1">
                <span className="numeric-display text-5xl font-900 text-[var(--color-brand-red)] leading-none price-animate">
                  {formatCurrency(result.realHourlyRate)}
                </span>
                <span className="text-xs text-[var(--color-text-muted)]">por hora faturável</span>
              </div>

              <div className="divider" />

              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[var(--color-text-secondary)]">Custo mensal total</span>
                  <span className="font-600 text-[var(--color-text)]">
                    {formatCurrency(result.totalMonthlyCost)}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[var(--color-text-secondary)]">Horas faturáveis</span>
                  <span className="font-600 text-[var(--color-text)]">
                    {result.billableHours.toFixed(0)}h / mês
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle>Composição do custo</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              {breakdownItems.map((item) => {
                const pct = result.totalMonthlyCost > 0
                  ? (item.value / result.totalMonthlyCost) * 100
                  : 0
                return (
                  <div key={item.label} className="flex flex-col gap-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-[var(--color-text-secondary)]">{item.label}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-[var(--color-text-muted)]">{pct.toFixed(0)}%</span>
                        <span className="font-600 text-[var(--color-text)] tabular-nums">
                          {formatCurrency(item.value)}
                        </span>
                      </div>
                    </div>
                    <Progress value={pct} color={item.color} size="xs" />
                  </div>
                )
              })}
            </CardContent>
          </Card>

          {/* Cenários */}
          <Card>
            <CardHeader>
              <CardTitle>Cenários de aproveitamento</CardTitle>
              <CardDescription>Como o % faturável impacta seu valor-hora</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-2">
              {([
                { label: 'Conservador', pct: 50, color: 'text-[var(--color-text-muted)]' },
                { label: 'Padrão', pct: 60, color: 'text-[var(--color-brand-yellow)]' },
                { label: 'Otimista', pct: 70, color: 'text-[var(--color-brand-green)]' },
              ] as const).map(({ label, pct, color }) => {
                const scenarioRate = result.totalMonthlyCost / (availableHours * (pct / 100))
                return (
                  <div key={label} className="flex items-center justify-between text-xs py-1">
                    <div className="flex items-center gap-2">
                      <span className={`font-600 ${color}`}>{pct}%</span>
                      <span className="text-[var(--color-text-muted)]">{label}</span>
                    </div>
                    <span className={`numeric-display font-700 ${color}`}>
                      {formatCurrency(scenarioRate)}/h
                    </span>
                  </div>
                )
              })}
            </CardContent>
          </Card>

          <Button className="w-full" size="lg">
            <TrendingUp size={15} className="mr-2" />
            Salvar configuração
          </Button>
        </div>

      </PageContent>
    </>
  )
}
