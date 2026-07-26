'use client'

import { useState } from 'react'
import type { Metadata } from 'next'
import { PageHeader, PageContent } from '@/components/layout/shell'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input, CurrencyInput } from '@/components/ui/input'
import { StepIndicator, StepHeader } from '@/components/ui/stepper'
import { Progress } from '@/components/ui/progress'
import {
  COMPLEXITY_MULTIPLIERS,
  URGENCY_MULTIPLIERS,
  CLIENT_SIZE_MULTIPLIERS,
  USAGE_RIGHTS_MULTIPLIERS,
  type ComplexityLevel,
  type UrgencyLevel,
  type ClientSize,
  type UsageRights,
  type PricingMethod,
  calculateFullQuote,
  getServicesByCategory,
  getBenchmarkServiceById,
  compareQuoteWithBenchmark,
} from '@/lib/pricing'
import { formatCurrency } from '@/lib/utils'
import { ArrowLeft, ArrowRight, AlertTriangle, CheckCircle2, TrendingUp, Info } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'

// ─── Constantes ───────────────────────────────────────────────────────────────

const STEPS = [
  { label: 'Serviço' },
  { label: 'Tempo' },
  { label: 'Complexidade' },
  { label: 'Urgência' },
  { label: 'Cliente' },
  { label: 'Direitos' },
  { label: 'Extras' },
  { label: 'Resultado' },
]

const PRICING_METHODS: { value: PricingMethod; label: string; description: string }[] = [
  { value: 'hourly',      label: 'Valor/hora',     description: 'Ideal para ajustes pontuais e consultorias curtas' },
  { value: 'daily',       label: 'Diária',          description: 'Fotografia, filmagem em locação' },
  { value: 'fixed_scope', label: 'Escopo fechado',  description: 'Identidade visual, sites, landing pages' },
  { value: 'value_based', label: 'Baseado em valor', description: 'Consultoria estratégica, branding de alto impacto' },
  { value: 'package',     label: 'Pacote',          description: 'Social media, produção de conteúdo recorrente' },
  { value: 'retainer',    label: 'Retainer/Mensal', description: 'Gestão de tráfego, manutenção, consultoria contínua' },
]

// Valor-hora padrão para demonstração (em produção virá do perfil salvo)
const DEMO_HOURLY_RATE = 64.8

// ─── Estado inicial ───────────────────────────────────────────────────────────

const INITIAL_STATE = {
  projectName: '',
  benchmarkId: 'id_completa',
  pricingMethod: 'fixed_scope' as PricingMethod,
  estimatedHours: 40,
  revisions: 2,
  complexity: 'standard' as ComplexityLevel,
  urgency: 'normal' as UrgencyLevel,
  clientSize: 'small_business' as ClientSize,
  usageRights: 'limited' as UsageRights,
  directCosts: [] as { id: string; label: string; amount: number }[],
  extraMargin: 0,
}

// ─── Componente seletor de opção ──────────────────────────────────────────────

function OptionCard({
  selected,
  onClick,
  title,
  description,
  badge,
}: {
  selected: boolean
  onClick: () => void
  title: string
  description?: string
  badge?: string
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'flex flex-col gap-1.5 p-4 rounded-[var(--radius-lg)] border text-left w-full',
        'transition-all duration-150 cursor-pointer',
        selected
          ? 'border-[var(--color-brand-red)] bg-[var(--color-brand-red)]/8'
          : 'border-[var(--color-border)] bg-[var(--color-surface)] hover:border-[var(--color-text-muted)]'
      )}
    >
      <div className="flex items-center justify-between">
        <span className={cn(
          'text-sm font-600',
          selected ? 'text-[var(--color-text)]' : 'text-[var(--color-text-secondary)]'
        )}>
          {title}
        </span>
        {selected && (
          <CheckCircle2 size={14} className="text-[var(--color-brand-red)] flex-shrink-0" />
        )}
      </div>
      {description && (
        <span className="text-xs text-[var(--color-text-muted)] leading-relaxed">
          {description}
        </span>
      )}
    </button>
  )
}

// ─── Componente principal ─────────────────────────────────────────────────────

export default function CalcularPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(0)
  const [form, setForm] = useState(INITIAL_STATE)
  const serviceCategories = getServicesByCategory()

  const update = <K extends keyof typeof INITIAL_STATE>(key: K, value: typeof INITIAL_STATE[K]) =>
    setForm(prev => ({ ...prev, [key]: value }))

  const handleServiceSelect = (serviceId: string) => {
    const service = getBenchmarkServiceById(serviceId)
    if (service) {
      setForm(prev => ({
        ...prev,
        benchmarkId: service.id,
        pricingMethod: service.defaultMethod,
        projectName: prev.projectName || service.name
      }))
    }
  }

  const canAdvance = () => {
    if (currentStep === 0) return form.projectName.trim().length > 0
    if (currentStep === 1) return form.estimatedHours > 0
    return true
  }

  const next = () => { if (currentStep < STEPS.length - 1) setCurrentStep(s => s + 1) }
  const prev = () => { if (currentStep > 0) setCurrentStep(s => s - 1) }

  // Calcula resultado ao chegar no step 7
  const result = currentStep === 7 ? calculateFullQuote({
    layer1: {
      monthlyExpenses: 450,
      desiredSalary: 5000,
      technicalReserve: 500,
      profitMargin: 0.15,
      availableHours: 176,
      billablePercentage: 60,
    },
    layer2: {
      pricingMethod: form.pricingMethod,
      estimatedHours: form.estimatedHours,
      revisions: form.revisions,
      directCosts: form.directCosts,
      extraCosts: [],
    },
    layer3: {
      complexity: form.complexity,
      urgency: form.urgency,
      clientSize: form.clientSize,
      usageRights: form.usageRights,
      taxRegime: 'mei',
      extraMargin: form.extraMargin / 100,
    },
  }) : null

  return (
    <>
      <PageHeader
        label="Motor de precificação"
        title="Calcular Orçamento"
        description="Preencha as etapas para gerar seu preço com metodologia profissional."
      />

      <PageContent>
        {/* Step indicator */}
        <div className="mb-8 overflow-x-auto pb-2">
          <StepIndicator steps={STEPS} currentStep={currentStep} />
        </div>

        <div className="max-w-2xl mx-auto flex flex-col gap-6">

          {/* ─── Step 0: Serviço ─────────────────────────────────────────────── */}
          {currentStep === 0 && (
            <Card>
              <CardContent className="flex flex-col gap-5 p-6">
                <StepHeader
                  step={1}
                  total={8}
                  title="Qual o projeto?"
                  description="Dê um nome ao projeto e escolha o método de precificação mais adequado para este tipo de entrega."
                />

                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <span className="label-uppercase">Serviço de referência (ADG Brasil / Adegraf)</span>
                    <span className="text-[0.65rem] text-[var(--color-brand-red)] font-600">RF-09 · Calibração de mercado</span>
                  </div>
                  <select
                    value={form.benchmarkId}
                    onChange={e => handleServiceSelect(e.target.value)}
                    className="w-full h-11 px-3 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] text-sm text-[var(--color-text)] focus:border-[var(--color-brand-red)] outline-none"
                  >
                    {serviceCategories.map(cat => (
                      <optgroup key={cat.label} label={cat.label}>
                        {cat.services.map(s => (
                          <option key={s.id} value={s.id}>
                            {s.name} ({formatCurrency(s.recommendedRate)})
                          </option>
                        ))}
                      </optgroup>
                    ))}
                  </select>
                  {getBenchmarkServiceById(form.benchmarkId) && (
                    <p className="text-xs text-[var(--color-text-muted)] leading-relaxed mt-0.5">
                      {getBenchmarkServiceById(form.benchmarkId)?.description}
                    </p>
                  )}
                </div>

                <Input
                  label="Nome do projeto"
                  placeholder="Ex.: Identidade Visual Marca X"
                  value={form.projectName}
                  onChange={e => update('projectName', e.target.value)}
                  id="project-name"
                />

                <div className="flex flex-col gap-2">
                  <span className="label-uppercase">Método de precificação</span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {PRICING_METHODS.map(m => (
                      <OptionCard
                        key={m.value}
                        selected={form.pricingMethod === m.value}
                        onClick={() => update('pricingMethod', m.value)}
                        title={m.label}
                        description={m.description}
                      />
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* ─── Step 1: Tempo ───────────────────────────────────────────────── */}
          {currentStep === 1 && (
            <Card>
              <CardContent className="flex flex-col gap-5 p-6">
                <StepHeader
                  step={2}
                  total={8}
                  title="Quanto tempo leva?"
                  description="Estime o total de horas dedicadas ao projeto, incluindo pesquisa, execução e revisões."
                />

                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="Horas estimadas"
                    type="number"
                    min={0.5}
                    value={form.estimatedHours}
                    onChange={e => update('estimatedHours', parseFloat(e.target.value) || 0)}
                    suffix={<span className="text-xs">h</span>}
                    id="estimated-hours"
                    hint="Inclua pesquisa, execução e entregas"
                  />
                  <Input
                    label="Revisões inclusas"
                    type="number"
                    min={0}
                    max={20}
                    value={form.revisions}
                    onChange={e => update('revisions', parseInt(e.target.value) || 0)}
                    id="revisions"
                    hint="Rodadas de ajuste já no escopo"
                  />
                </div>

                {/* Preview do custo de mão de obra */}
                {form.estimatedHours > 0 && (
                  <div className="flex items-center justify-between p-4 bg-[var(--color-surface-raised)] rounded-[var(--radius-md)]">
                    <div className="flex flex-col gap-0.5">
                      <span className="label-uppercase">Custo de mão de obra (estimativa)</span>
                      <span className="text-xs text-[var(--color-text-muted)]">
                        {form.estimatedHours}h × {formatCurrency(DEMO_HOURLY_RATE)}/h
                      </span>
                    </div>
                    <span className="numeric-display text-xl font-900 text-[var(--color-text)]">
                      {formatCurrency(form.estimatedHours * DEMO_HOURLY_RATE)}
                    </span>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* ─── Step 2: Complexidade ─────────────────────────────────────────── */}
          {currentStep === 2 && (
            <Card>
              <CardContent className="flex flex-col gap-5 p-6">
                <StepHeader
                  step={3}
                  total={8}
                  title="Qual a complexidade?"
                  description="Projetos mais complexos exigem mais esforço, pesquisa e gestão de risco. Isso precisa estar no preço."
                />
                <div className="flex flex-col gap-2">
                  {(Object.entries(COMPLEXITY_MULTIPLIERS) as [ComplexityLevel, typeof COMPLEXITY_MULTIPLIERS[ComplexityLevel]][]).map(([key, val]) => (
                    <OptionCard
                      key={key}
                      selected={form.complexity === key}
                      onClick={() => update('complexity', key)}
                      title={`${val.label} — ×${val.multiplier}`}
                      description={val.description}
                    />
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* ─── Step 3: Urgência ─────────────────────────────────────────────── */}
          {currentStep === 3 && (
            <Card>
              <CardContent className="flex flex-col gap-5 p-6">
                <StepHeader
                  step={4}
                  total={8}
                  title="Qual a urgência?"
                  description="Prazos apertados reorganizam sua agenda e têm custo real. A urgência precisa ser monetizada."
                />
                <div className="flex flex-col gap-2">
                  {(Object.entries(URGENCY_MULTIPLIERS) as [UrgencyLevel, typeof URGENCY_MULTIPLIERS[UrgencyLevel]][]).map(([key, val]) => (
                    <OptionCard
                      key={key}
                      selected={form.urgency === key}
                      onClick={() => update('urgency', key)}
                      title={`${val.label} — ×${val.multiplier}`}
                      description={val.description}
                    />
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* ─── Step 4: Porte do cliente ─────────────────────────────────────── */}
          {currentStep === 4 && (
            <Card>
              <CardContent className="flex flex-col gap-5 p-6">
                <StepHeader
                  step={5}
                  total={8}
                  title="Qual o porte do cliente?"
                  description="O valor gerado pelo seu trabalho é diferente para uma startup e para uma multinacional. O preço deve refletir isso."
                />
                <div className="flex flex-col gap-2">
                  {(Object.entries(CLIENT_SIZE_MULTIPLIERS) as [ClientSize, typeof CLIENT_SIZE_MULTIPLIERS[ClientSize]][]).map(([key, val]) => (
                    <OptionCard
                      key={key}
                      selected={form.clientSize === key}
                      onClick={() => update('clientSize', key)}
                      title={`${val.label} — ×${val.multiplier}`}
                      description={val.description}
                    />
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* ─── Step 5: Direitos de uso ──────────────────────────────────────── */}
          {currentStep === 5 && (
            <Card>
              <CardContent className="flex flex-col gap-5 p-6">
                <StepHeader
                  step={6}
                  total={8}
                  title="Direitos de uso"
                  description="Quanto mais ampla a exploração comercial do seu trabalho, maior deve ser a remuneração."
                />
                <div className="flex flex-col gap-2">
                  {(Object.entries(USAGE_RIGHTS_MULTIPLIERS) as [UsageRights, typeof USAGE_RIGHTS_MULTIPLIERS[UsageRights]][]).map(([key, val]) => (
                    <OptionCard
                      key={key}
                      selected={form.usageRights === key}
                      onClick={() => update('usageRights', key)}
                      title={`${val.label} — ×${val.multiplier}`}
                      description={val.description}
                    />
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* ─── Step 6: Custos extras ────────────────────────────────────────── */}
          {currentStep === 6 && (
            <Card>
              <CardContent className="flex flex-col gap-5 p-6">
                <StepHeader
                  step={7}
                  total={8}
                  title="Custos extras"
                  description="Terceiros, licenças, deslocamento — tudo que você vai desembolsar especificamente por este projeto."
                />

                {form.directCosts.length === 0 ? (
                  <div className="flex flex-col items-center gap-2 py-8 border border-dashed border-[var(--color-border)] rounded-[var(--radius-md)]">
                    <span className="text-xs text-[var(--color-text-muted)]">Nenhum custo extra cadastrado</span>
                    <span className="text-[0.65rem] text-[var(--color-text-muted)]">
                      Se não houver, avance para o próximo passo
                    </span>
                  </div>
                ) : (
                  <div className="flex flex-col gap-3">
                    {form.directCosts.map((cost, i) => (
                      <div key={cost.id} className="flex items-end gap-3">
                        <Input
                          label={i === 0 ? 'Descrição' : undefined}
                          placeholder="Ex.: Licença de fonte"
                          value={cost.label}
                          onChange={e => {
                            const updated = [...form.directCosts]
                            updated[i] = { ...updated[i], label: e.target.value }
                            update('directCosts', updated)
                          }}
                          className="flex-1"
                        />
                        <CurrencyInput
                          label={i === 0 ? 'Valor' : undefined}
                          value={cost.amount}
                          onChange={v => {
                            const updated = [...form.directCosts]
                            updated[i] = { ...updated[i], amount: v }
                            update('directCosts', updated)
                          }}
                          className="w-32"
                        />
                      </div>
                    ))}
                  </div>
                )}

                <Button
                  variant="ghost"
                  size="sm"
                  className="self-start text-[var(--color-text-muted)]"
                  onClick={() => update('directCosts', [
                    ...form.directCosts,
                    { id: Date.now().toString(), label: '', amount: 0 }
                  ])}
                >
                  + Adicionar custo
                </Button>

                <div className="flex flex-col gap-1.5">
                  <Input
                    label="Margem extra desejada (%)"
                    type="number"
                    min={0}
                    max={100}
                    value={form.extraMargin}
                    onChange={e => update('extraMargin', parseFloat(e.target.value) || 0)}
                    suffix={<span className="text-xs">%</span>}
                    hint="Adicione margem de negociação ou de crescimento ao preço final"
                    id="extra-margin"
                  />
                </div>
              </CardContent>
            </Card>
          )}

          {/* ─── Step 7: Resultado ───────────────────────────────────────────── */}
          {currentStep === 7 && result && (
            <div className="flex flex-col gap-4">

              <StepHeader
                step={8}
                total={8}
                title="Seu orçamento"
                description="Com base na metodologia em 3 camadas. O preço recomendado cobre 100% dos seus custos reais mais a margem configurada."
              />

              {/* Alerta de preço abaixo do piso */}
              {result.belowFloor && (
                <div className="flex items-start gap-3 p-4 border border-[var(--color-brand-yellow)]/40 bg-[var(--color-brand-yellow)]/8 rounded-[var(--radius-lg)]">
                  <AlertTriangle size={16} className="text-[var(--color-brand-yellow)] flex-shrink-0 mt-0.5" />
                  <div className="flex flex-col gap-1">
                    <span className="text-sm font-600 text-[var(--color-brand-yellow)]">Atenção: abaixo do piso técnico</span>
                    <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed">
                      O preço calculado está abaixo do mínimo necessário para cobrir seus custos operacionais.
                      Revise os multiplicadores ou aumente as horas estimadas.
                    </p>
                  </div>
                </div>
              )}

              {/* 3 faixas de resultado */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  { label: 'Mínimo', sublabel: 'Piso técnico', value: result.quote.minimum, color: 'border-[var(--color-border)]', textColor: 'text-[var(--color-text-secondary)]', accent: 'none' as const },
                  { label: 'Recomendado', sublabel: 'Com todos os custos cobertos', value: result.quote.recommended, color: 'border-[var(--color-brand-red)]', textColor: 'text-[var(--color-brand-red)]', accent: 'red' as const },
                  { label: 'Premium', sublabel: 'Valor percebido alto', value: result.quote.premium, color: 'border-[var(--color-border)]', textColor: 'text-[var(--color-text-secondary)]', accent: 'none' as const },
                ].map(tier => (
                  <div
                    key={tier.label}
                    className={cn(
                      'flex flex-col gap-3 p-5 rounded-[var(--radius-lg)] border bg-[var(--color-surface)]',
                      tier.color,
                      tier.accent === 'red' && 'bg-[var(--color-brand-red)]/5'
                    )}
                  >
                    <div className="flex flex-col gap-0.5">
                      <span className={cn('label-uppercase', tier.accent === 'red' ? 'text-[var(--color-brand-red)]' : '')}>
                        {tier.label}
                      </span>
                      <span className="text-[0.65rem] text-[var(--color-text-muted)]">{tier.sublabel}</span>
                    </div>
                    <span className={cn('numeric-display font-900 text-3xl leading-none', tier.textColor)}>
                      {formatCurrency(tier.value)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Breakdown dos multiplicadores */}
              <Card>
                <CardHeader>
                  <CardTitle>Composição do preço</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col gap-3">
                  {[
                    { label: 'Custo base (horas × valor-hora)', value: result.basePrice },
                    { label: 'Ajuste de mercado (multiplicadores)', value: result.quote.adjustedPrice - result.basePrice },
                    { label: `Impostos (${(result.quote.taxDetail.rate * 100).toFixed(1)}% gross-up)`, value: result.quote.taxDetail.taxAmount },
                  ].map(item => {
                    const pct = result.quote.recommended > 0
                      ? Math.abs(item.value / result.quote.recommended * 100)
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
                        <Progress value={pct} color="red" size="xs" />
                      </div>
                    )
                  })}

                  <div className="divider mt-1" />

                  {/* Detalhes dos multiplicadores */}
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    {[
                      { label: 'Complexidade', detail: result.quote.multiplierDetail.complexity },
                      { label: 'Urgência', detail: result.quote.multiplierDetail.urgency },
                      { label: 'Porte do cliente', detail: result.quote.multiplierDetail.clientSize },
                      { label: 'Direitos de uso', detail: result.quote.multiplierDetail.usageRights },
                    ].map(m => (
                      <div key={m.label} className="flex items-center justify-between text-xs py-1 px-2 rounded-[var(--radius-sm)] bg-[var(--color-surface-raised)]">
                        <span className="text-[var(--color-text-muted)]">{m.label}</span>
                        <div className="flex items-center gap-1.5">
                          <span className="text-[0.65rem] text-[var(--color-text-muted)]">{m.detail.label}</span>
                          <Badge variant={m.detail.multiplier > 1 ? 'warning' : m.detail.multiplier < 1 ? 'default' : 'default'}>
                            ×{m.detail.multiplier}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Comparativo com Adegraf / ADG Brasil */}
              {(() => {
                const bmark = compareQuoteWithBenchmark(result.quote.recommended, form.benchmarkId)
                if (!bmark) return null
                return (
                  <Card accent="red">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-sm">Comparativo com Mercado (ADG Brasil / Adegraf)</CardTitle>
                        <Badge variant={bmark.status === 'below' ? 'warning' : bmark.status === 'premium' ? 'warning' : 'default'}>
                          {bmark.status === 'below' ? 'Abaixo da referência' : bmark.status === 'premium' ? 'Faixa Superior / Sênior' : 'Média de Mercado'}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="flex flex-col gap-3">
                      <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed">
                        Para o serviço <strong className="text-[var(--color-text)]">{bmark.service.name}</strong>, a referência praticada por agências e profissionais plenos/sêniores varia de <strong className="text-[var(--color-text)]">{formatCurrency(bmark.service.minRate)}</strong> a <strong className="text-[var(--color-text)]">{formatCurrency(bmark.service.maxRate)}</strong>.
                      </p>

                      <div className="grid grid-cols-3 gap-2 py-2 px-3 rounded-[var(--radius-md)] bg-[var(--color-surface-raised)] text-center">
                        <div className="flex flex-col">
                          <span className="text-[0.65rem] text-[var(--color-text-muted)] uppercase">Piso ADG</span>
                          <span className="text-xs font-700 text-[var(--color-text-secondary)]">{formatCurrency(bmark.service.minRate)}</span>
                        </div>
                        <div className="flex flex-col border-x border-[var(--color-border)]">
                          <span className="text-[0.65rem] text-[var(--color-brand-red)] font-600 uppercase">Média Recomendada</span>
                          <span className="text-xs font-700 text-[var(--color-text)]">{formatCurrency(bmark.service.recommendedRate)}</span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[0.65rem] text-[var(--color-text-muted)] uppercase">Teto Comum</span>
                          <span className="text-xs font-700 text-[var(--color-text-secondary)]">{formatCurrency(bmark.service.maxRate)}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 pt-1">
                        <Info size={13} className="text-[var(--color-text-muted)] flex-shrink-0" />
                        <span className="text-[0.7rem] text-[var(--color-text-muted)]">
                          {bmark.statusText}. Lembre-se: tabelas não são travas fixas, servem para ancoragem e negociação.
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                )
              })()}

              <Button
                size="lg"
                className="w-full"
                onClick={() => {
                  const proposalData = {
                    id: Date.now().toString(),
                    projectName: form.projectName || 'Projeto sem título',
                    date: new Date().toLocaleDateString('pt-BR'),
                    form,
                    result,
                    benchmark: compareQuoteWithBenchmark(result.quote.recommended, form.benchmarkId)
                  }
                  localStorage.setItem('bob_last_proposal', JSON.stringify(proposalData))
                  router.push('/propostas/preview')
                }}
              >
                <TrendingUp size={15} className="mr-2" />
                Gerar Proposta PDF
              </Button>
            </div>
          )}

          {/* ─── Navegação ───────────────────────────────────────────────────── */}
          <div className="flex items-center justify-between pt-2">
            <Button
              variant="ghost"
              size="md"
              onClick={prev}
              disabled={currentStep === 0}
              className="flex items-center gap-2"
            >
              <ArrowLeft size={15} />
              Voltar
            </Button>

            <div className="flex items-center gap-2">
              <span className="text-xs text-[var(--color-text-muted)]">
                {currentStep + 1} / {STEPS.length}
              </span>
            </div>

            {currentStep < STEPS.length - 1 ? (
              <Button
                size="md"
                onClick={next}
                disabled={!canAdvance()}
                className="flex items-center gap-2"
              >
                Avançar
                <ArrowRight size={15} />
              </Button>
            ) : (
              <Button variant="secondary" size="md" onClick={() => setCurrentStep(0)}>
                Novo orçamento
              </Button>
            )}
          </div>

        </div>
      </PageContent>
    </>
  )
}
