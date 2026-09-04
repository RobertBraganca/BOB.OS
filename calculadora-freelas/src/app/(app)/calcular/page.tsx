'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { PageContent } from '@/shared/components/layout/shell'
import type { ComplexityLevel, UrgencyLevel, ClientSize, UsageRights, PricingMethod, TaxRegime } from '@/modules/pricing/lib'
/* Tabelas de referência (não são "a fórmula") — importadas dos módulos
   específicos, nunca do barrel `lib/index.ts`, para o motor de cálculo
   (layer1/2/3) nunca entrar no grafo de módulos do cliente. */
import { COMPLEXITY_MULTIPLIERS, URGENCY_MULTIPLIERS, CLIENT_SIZE_MULTIPLIERS, USAGE_RIGHTS_MULTIPLIERS } from '@/modules/pricing/lib/multipliers'
import { ADEGRAF_BENCHMARKS } from '@/modules/pricing/lib/adegraf'
import { submitPricingEvent } from '@/modules/pricing/lib/events'
import { calculateFullQuoteAction, type FullQuoteResult } from '@/modules/pricing/lib/actions'
import { Button } from '@/shared/components/ui/button'
import { formatCurrency } from '@/shared/lib/utils'
import { DEFAULT_COSTS, loadCosts, loadPrefs, loadProfile, saveLastProposal, totalMonthlyExpenses, type SavedCosts } from '@/shared/lib/storage'
import { ArrowLeft, ArrowRight, AlertTriangle, CheckCircle2, FileText, Download, Plus, Trash2 } from 'lucide-react'

const STEPS = ['Serviço', 'Tempo', 'Complexidade', 'Urgência', 'Cliente', 'Direitos', 'Extras', 'Resultado']

const METHODS: { value: PricingMethod; label: string; desc: string }[] = [
  { value: 'hourly', label: 'Valor/hora', desc: 'Ajustes pontuais, consultorias curtas' },
  { value: 'daily', label: 'Diária', desc: 'Fotografia, filmagem em locação' },
  { value: 'fixed_scope', label: 'Escopo fechado', desc: 'Identidade visual, sites, landing pages' },
  { value: 'value_based', label: 'Baseado em valor', desc: 'Consultoria estratégica, branding de alto impacto' },
  { value: 'package', label: 'Pacote', desc: 'Social media, produção de conteúdo recorrente' },
  { value: 'retainer', label: 'Retainer/mensal', desc: 'Gestão de tráfego, manutenção, consultoria contínua' },
]

interface DirectCostRow {
  id: string
  label: string
  amount: number
}

function OptionRow<T extends string>({
  value,
  selected,
  onSelect,
  label,
  desc,
  mult,
}: {
  value: T
  selected: boolean
  onSelect: (v: T) => void
  label: string
  desc: string
  mult: string
}) {
  return (
    <button
      type="button"
      onClick={() => onSelect(value)}
      className={`flex items-center gap-3 min-h-[60px] p-3.5 rounded-[var(--radius-md)] text-left transition-colors ${
        selected
          ? 'border border-[var(--color-brand-red)] bg-[var(--color-brand-red)]/10'
          : 'border border-[var(--color-border)] bg-[var(--color-bg)] hover:border-[var(--color-text-muted)]'
      }`}
    >
      {selected ? (
        <CheckCircle2 size={18} className="text-[var(--color-brand-red)] flex-shrink-0" />
      ) : (
        <span className="w-[18px] h-[18px] rounded-full border border-[var(--color-border)] flex-shrink-0" />
      )}
      <span className="flex flex-col gap-0.5 flex-1 min-w-0">
        <span className="text-sm font-600 text-[var(--color-text)]">{label}</span>
        <span className="text-2xs text-[var(--color-text-secondary)] leading-snug">{desc}</span>
      </span>
      <span className="numeric-display text-[17px] flex-shrink-0" style={{ color: selected ? 'var(--color-brand-red)' : 'var(--color-text-muted)' }}>
        {mult}
      </span>
    </button>
  )
}

export default function CalcularPage() {
  const router = useRouter()
  const [step, setStep] = useState(0)

  const [projectName, setProjectName] = useState('')
  const [clientName, setClientName] = useState('')
  const [benchmarkId, setBenchmarkId] = useState('')
  const [pricingMethod, setPricingMethod] = useState<PricingMethod>('fixed_scope')
  const [estimatedHours, setEstimatedHours] = useState(0)
  const [revisions, setRevisions] = useState(2)
  const [complexity, setComplexity] = useState<ComplexityLevel>('standard')
  const [urgency, setUrgency] = useState<UrgencyLevel>('normal')
  const [clientSize, setClientSize] = useState<ClientSize>('small_business')
  const [usageRights, setUsageRights] = useState<UsageRights>('limited')
  const [directCosts, setDirectCosts] = useState<DirectCostRow[]>([])
  const [extraMargin, setExtraMargin] = useState(0)

  const [costs, setCosts] = useState<SavedCosts>(DEFAULT_COSTS)
  const [taxRegime, setTaxRegime] = useState<TaxRegime>('mei')
  const [authorName, setAuthorName] = useState<string>()

  const EMPTY_FQ: FullQuoteResult = {
    hourlyRate: 0,
    billableHours: 0,
    totalMonthlyCost: 0,
    basePrice: 0,
    laborCost: 0,
    revisionCost: 0,
    totalDirectCosts: 0,
    quote: {
      minimum: 0,
      recommended: 0,
      premium: 0,
      multiplierDetail: {
        complexity: { level: 'standard', multiplier: 1, label: '' },
        urgency: { level: 'normal', multiplier: 1, label: '' },
        clientSize: { level: 'small_business', multiplier: 1, label: '' },
        usageRights: { level: 'limited', multiplier: 1, label: '' },
        combined: 1,
      },
      taxDetail: { regime: 'mei', rate: 0, taxAmount: 0 },
      adjustedPrice: 0,
      priceWithTax: 0,
      extraMarginAmount: 0,
    },
    belowFloor: false,
    benchmark: null,
  }
  const [fq, setFq] = useState<FullQuoteResult>(EMPTY_FQ)
  const [calculating, setCalculating] = useState(false)

  /** Recalcula o orçamento completo no servidor — no blur de campo e no clique de cada escolha, nunca a cada tecla. */
  const recalcQuote = async (overrides?: {
    costs?: SavedCosts
    taxRegime?: TaxRegime
    pricingMethod?: PricingMethod
    estimatedHours?: number
    revisions?: number
    directCosts?: DirectCostRow[]
    complexity?: ComplexityLevel
    urgency?: UrgencyLevel
    clientSize?: ClientSize
    usageRights?: UsageRights
    extraMargin?: number
    benchmarkId?: string
  }) => {
    const next = {
      costs: overrides?.costs ?? costs,
      taxRegime: overrides?.taxRegime ?? taxRegime,
      pricingMethod: overrides?.pricingMethod ?? pricingMethod,
      estimatedHours: overrides?.estimatedHours ?? estimatedHours,
      revisions: overrides?.revisions ?? revisions,
      directCosts: overrides?.directCosts ?? directCosts,
      complexity: overrides?.complexity ?? complexity,
      urgency: overrides?.urgency ?? urgency,
      clientSize: overrides?.clientSize ?? clientSize,
      usageRights: overrides?.usageRights ?? usageRights,
      extraMargin: overrides?.extraMargin ?? extraMargin,
      benchmarkId: overrides?.benchmarkId ?? benchmarkId,
    }
    setCalculating(true)
    try {
      const r = await calculateFullQuoteAction({
        layer1: {
          monthlyExpenses: totalMonthlyExpenses(next.costs),
          desiredSalary: next.costs.desiredSalary,
          technicalReserve: next.costs.technicalReserve,
          profitMargin: next.costs.profitMargin / 100,
          availableHours: next.costs.availableHours,
          billablePercentage: next.costs.billablePercentage,
        },
        layer2: {
          pricingMethod: next.pricingMethod,
          estimatedHours: next.estimatedHours,
          revisions: next.revisions,
          directCosts: next.directCosts.map((c) => ({ label: c.label, amount: c.amount })),
          extraCosts: [],
        },
        layer3: {
          complexity: next.complexity,
          urgency: next.urgency,
          clientSize: next.clientSize,
          usageRights: next.usageRights,
          taxRegime: next.taxRegime,
          extraMargin: next.extraMargin / 100,
        },
        benchmarkId: next.benchmarkId || null,
      })
      setFq(r)
    } finally {
      setCalculating(false)
    }
  }

  useEffect(() => {
    const loadedCosts = loadCosts()
    setCosts(loadedCosts)
    const profile = loadProfile()
    let loadedTaxRegime: TaxRegime = 'mei'
    if (profile) {
      loadedTaxRegime = profile.taxRegime
      setTaxRegime(profile.taxRegime)
      setAuthorName(profile.name || undefined)
    }
    recalcQuote({ costs: loadedCosts, taxRegime: loadedTaxRegime })
  }, [])

  const noRateWarning = fq.hourlyRate === 0

  const canAdvance = step === 0 ? projectName.trim().length > 0 : step === 1 ? estimatedHours > 0 : true
  const advanceHint = step === 0 ? 'Dê um nome ao projeto para continuar' : 'Informe as horas estimadas para continuar'

  const addDirectCost = () => {
    const next = [...directCosts, { id: Date.now().toString(), label: '', amount: 0 }]
    setDirectCosts(next)
    recalcQuote({ directCosts: next })
  }
  const removeDirectCost = (id: string) => {
    const next = directCosts.filter((c) => c.id !== id)
    setDirectCosts(next)
    recalcQuote({ directCosts: next })
  }
  const updateDirectCost = (id: string, patch: Partial<DirectCostRow>) =>
    setDirectCosts((prev) => prev.map((c) => (c.id === id ? { ...c, ...patch } : c)))

  const handleSaveProposal = () => {
    saveLastProposal({
      id: Date.now().toString(),
      projectName: projectName || 'Projeto sem título',
      clientName: clientName || undefined,
      authorName,
      date: new Date().toLocaleDateString('pt-BR'),
      createdAt: new Date().toISOString(),
      form: {
        projectName,
        benchmarkId,
        pricingMethod,
        estimatedHours,
        revisions,
        complexity,
        urgency,
        clientSize,
        usageRights,
        directCosts,
        extraMargin,
      },
      result: {
        hourlyRate: fq.hourlyRate,
        billableHours: fq.billableHours,
        totalMonthlyCost: fq.totalMonthlyCost,
        basePrice: fq.basePrice,
        quote: fq.quote,
        belowFloor: fq.belowFloor,
      },
      laborCost: fq.laborCost,
      revisionCost: fq.revisionCost,
      totalDirectCosts: fq.totalDirectCosts,
      benchmark: fq.benchmark,
    })

    if (loadPrefs().contributeToMarketData) {
      submitPricingEvent({
        benchmarkId: benchmarkId || null,
        pricingMethod,
        estimatedHours,
        revisions,
        complexity,
        urgency,
        clientSize,
        usageRights,
        taxRegime,
        hourlyRate: fq.hourlyRate,
        basePrice: fq.basePrice,
        quote: fq.quote,
      })
    }
  }

  const benchPos = fq.benchmark
    ? `${Math.max(0, Math.min(100, ((fq.quote.recommended - fq.benchmark.service.minRate) / (fq.benchmark.service.maxRate - fq.benchmark.service.minRate)) * 100))}%`
    : '0%'
  const benchColor =
    fq.benchmark?.status === 'below'
      ? 'var(--color-brand-yellow)'
      : fq.benchmark?.status === 'above'
        ? 'var(--color-brand-red)'
        : 'var(--color-brand-green)'

  return (
    <PageContent>
      <div className="flex flex-col gap-[22px]">
        {/* Cabeçalho do wizard */}
        <div className="flex flex-col gap-3.5 p-5 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-card)]">
          <div className="flex flex-wrap items-baseline gap-3 justify-between">
            <div className="flex items-baseline gap-3">
              <span className="numeric-display text-[34px] leading-none text-[var(--color-brand-red)]">
                {String(step + 1).padStart(2, '0')}
              </span>
              <span className="font-display text-[15px] font-700 uppercase text-[var(--color-text-muted)]">/ 08</span>
              <h1 className="font-display font-900 uppercase tracking-tight text-[var(--color-text)]" style={{ fontSize: 'clamp(22px,4vw,32px)' }}>
                {STEPS[step]}
              </h1>
            </div>
            <span className="label-uppercase">{Math.round(((step + 1) / 8) * 100)}% concluído</span>
          </div>
          <div className="h-1 w-full bg-[var(--color-bg)] rounded-full overflow-hidden">
            <div
              className="h-full bg-[var(--color-brand-red)] transition-[width] duration-[var(--duration-slow)] ease-out"
              style={{ width: `${((step + 1) / 8) * 100}%` }}
            />
          </div>
          <div className="flex flex-wrap gap-1.5">
            {STEPS.map((label, i) => (
              <button
                key={label}
                type="button"
                onClick={() => setStep(i)}
                className="flex items-center gap-1.5 h-[34px] px-2.5 border border-[var(--color-border)] text-[var(--color-text-secondary)] text-[11px] font-600 rounded-full hover:border-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors"
              >
                <span className="font-mono text-[10px] text-[var(--color-text-muted)]">{String(i + 1).padStart(2, '0')}</span>
                {label}
              </button>
            ))}
          </div>
        </div>

        {noRateWarning && (
          <div className="flex flex-wrap items-center gap-3.5 p-5 bg-[var(--color-brand-yellow)]/[.12] border border-[var(--color-brand-yellow)]/30 rounded-[var(--radius-card)]">
            <AlertTriangle size={18} className="text-[var(--color-brand-yellow)] flex-shrink-0" />
            <span className="flex-1 min-w-[200px] text-sm leading-relaxed text-[var(--color-text)]">
              Seu valor-hora é R$ 0,00, sem custos configurados o orçamento não tem base. Configure a Camada 1 primeiro.
            </span>
            <Button type="button" variant="yellow" size="sm" onClick={() => router.push('/custos')}>
              Ir para meus custos
            </Button>
          </div>
        )}

        <div className="grid gap-4 items-start" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
          <div className="flex flex-col gap-4 p-5 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-card)]">
            {step === 0 && (
              <div className="flex flex-col gap-[18px]">
                <div className="flex flex-col gap-1">
                  <h2 className="h2 text-[var(--color-text)]">Qual o projeto?</h2>
                  <p className="text-sm leading-relaxed text-[var(--color-text-secondary)]">
                    Nome do trabalho, cliente e o tipo de serviço para ancorar na tabela de mercado.
                  </p>
                </div>
                <label className="flex flex-col gap-1.5">
                  <span className="label-uppercase">Nome do projeto</span>
                  <input
                    value={projectName}
                    onChange={(e) => setProjectName(e.target.value)}
                    placeholder="Ex.: Identidade visual, Cafeteria Norte"
                    className="h-[var(--control-h)] px-3.5 bg-[var(--color-bg)] border border-[var(--color-border-strong)] text-sm text-[var(--color-text)] rounded-[var(--radius-md)] outline-none focus:border-[var(--color-brand-red)]"
                  />
                </label>
                <label className="flex flex-col gap-1.5">
                  <span className="label-uppercase">Cliente</span>
                  <input
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    placeholder="Ex.: Cafeteria Norte"
                    className="h-[var(--control-h)] px-3.5 bg-[var(--color-bg)] border border-[var(--color-border-strong)] text-sm text-[var(--color-text)] rounded-[var(--radius-md)] outline-none focus:border-[var(--color-brand-red)]"
                  />
                </label>
                <label className="flex flex-col gap-1.5">
                  <span className="label-uppercase">Serviço de referência · ADG Brasil</span>
                  <select
                    value={benchmarkId}
                    onChange={(e) => {
                      setBenchmarkId(e.target.value)
                      recalcQuote({ benchmarkId: e.target.value })
                    }}
                    className="h-[var(--control-h)] px-3 bg-[var(--color-bg)] border border-[var(--color-border-strong)] text-sm text-[var(--color-text)] rounded-[var(--radius-md)] outline-none focus:border-[var(--color-brand-red)]"
                  >
                    <option value="">Sem referência de mercado</option>
                    {ADEGRAF_BENCHMARKS.map((b) => (
                      <option key={b.id} value={b.id}>{b.name}</option>
                    ))}
                  </select>
                </label>
                <div className="flex flex-col gap-2">
                  <span className="label-uppercase">Método de cobrança</span>
                  <div className="grid gap-2" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))' }}>
                    {METHODS.map((m) => {
                      const selected = pricingMethod === m.value
                      return (
                        <button
                          key={m.value}
                          type="button"
                          onClick={() => {
                            setPricingMethod(m.value)
                            recalcQuote({ pricingMethod: m.value })
                          }}
                          className={`flex flex-col gap-0.5 items-start min-h-16 p-3 rounded-[var(--radius-md)] text-left transition-colors ${
                            selected
                              ? 'border border-[var(--color-brand-red)] bg-[var(--color-brand-red)]/10'
                              : 'border border-[var(--color-border)] bg-[var(--color-bg)] hover:border-[var(--color-text-muted)]'
                          }`}
                        >
                          <span className={`text-xs font-600 ${selected ? 'text-[var(--color-text)]' : 'text-[var(--color-text-secondary)]'}`}>
                            {m.label}
                          </span>
                          <span className="text-2xs text-[var(--color-text-muted)] leading-snug">{m.desc}</span>
                        </button>
                      )
                    })}
                  </div>
                </div>
              </div>
            )}

            {step === 1 && (
              <div className="flex flex-col gap-[18px]">
                <div className="flex flex-col gap-1">
                  <h2 className="h2 text-[var(--color-text)]">Quanto tempo leva?</h2>
                  <p className="text-sm leading-relaxed text-[var(--color-text-secondary)]">
                    Estime as horas de execução reais, incluindo pesquisa, apresentação e ajustes previstos.
                  </p>
                </div>
                <label className="flex flex-col gap-1.5">
                  <span className="label-uppercase">Horas estimadas</span>
                  <input
                    type="number"
                    value={estimatedHours || ''}
                    onChange={(e) => setEstimatedHours(parseFloat(e.target.value) || 0)}
                    onBlur={() => recalcQuote()}
                    placeholder="0"
                    className="h-[var(--control-h)] px-3.5 bg-[var(--color-bg)] border border-[var(--color-border-strong)] font-display font-900 text-2xl text-[var(--color-text)] rounded-[var(--radius-md)] outline-none focus:border-[var(--color-brand-red)]"
                  />
                </label>
                <label className="flex flex-col gap-1.5">
                  <span className="label-uppercase">Rodadas de revisão inclusas</span>
                  <input
                    type="number"
                    value={revisions}
                    onChange={(e) => setRevisions(parseInt(e.target.value) || 0)}
                    onBlur={() => recalcQuote()}
                    className="h-[var(--control-h)] px-3.5 bg-[var(--color-bg)] border border-[var(--color-border-strong)] font-mono text-sm text-[var(--color-text)] rounded-[var(--radius-md)] outline-none focus:border-[var(--color-brand-red)]"
                  />
                  <span className="text-2xs text-[var(--color-text-muted)]">Cada rodada entra como meia hora de contingência por revisão.</span>
                </label>
                <div className="flex flex-col gap-1.5 p-3.5 bg-[var(--color-bg)] border border-[var(--color-border)] rounded-[var(--radius-md)] transition-opacity" style={{ opacity: calculating ? 0.6 : 1 }}>
                  <span className="label-uppercase">Mão de obra a este ritmo</span>
                  <span className="numeric-display text-2xl text-[var(--color-text)]">{formatCurrency(fq.laborCost)}</span>
                  <span className="text-2xs text-[var(--color-text-muted)]">{estimatedHours}h × {formatCurrency(fq.hourlyRate)} de valor-hora real</span>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-1">
                  <h2 className="h2 text-[var(--color-text)]">Qual a complexidade?</h2>
                  <p className="text-sm leading-relaxed text-[var(--color-text-secondary)]">Quanto mais variáveis fora do seu controle, maior o multiplicador.</p>
                </div>
                <div className="flex flex-col gap-2">
                  {(Object.entries(COMPLEXITY_MULTIPLIERS) as [ComplexityLevel, typeof COMPLEXITY_MULTIPLIERS[ComplexityLevel]][]).map(([key, val]) => (
                    <OptionRow key={key} value={key} selected={complexity === key} onSelect={(v) => { setComplexity(v); recalcQuote({ complexity: v }) }} label={val.label} desc={val.description} mult={`×${val.multiplier}`} />
                  ))}
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-1">
                  <h2 className="h2 text-[var(--color-text)]">Qual a urgência?</h2>
                  <p className="text-sm leading-relaxed text-[var(--color-text-secondary)]">Prazo curto custa agenda, madrugada e fim de semana. Isso tem preço.</p>
                </div>
                <div className="flex flex-col gap-2">
                  {(Object.entries(URGENCY_MULTIPLIERS) as [UrgencyLevel, typeof URGENCY_MULTIPLIERS[UrgencyLevel]][]).map(([key, val]) => (
                    <OptionRow key={key} value={key} selected={urgency === key} onSelect={(v) => { setUrgency(v); recalcQuote({ urgency: v }) }} label={val.label} desc={val.description} mult={`×${val.multiplier}`} />
                  ))}
                </div>
              </div>
            )}

            {step === 4 && (
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-1">
                  <h2 className="h2 text-[var(--color-text)]">Qual o porte do cliente?</h2>
                  <p className="text-sm leading-relaxed text-[var(--color-text-secondary)]">O mesmo trabalho gera retornos diferentes. Cobre proporcional ao impacto.</p>
                </div>
                <div className="flex flex-col gap-2">
                  {(Object.entries(CLIENT_SIZE_MULTIPLIERS) as [ClientSize, typeof CLIENT_SIZE_MULTIPLIERS[ClientSize]][]).map(([key, val]) => (
                    <OptionRow key={key} value={key} selected={clientSize === key} onSelect={(v) => { setClientSize(v); recalcQuote({ clientSize: v }) }} label={val.label} desc={val.description} mult={`×${val.multiplier}`} />
                  ))}
                </div>
              </div>
            )}

            {step === 5 && (
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-1">
                  <h2 className="h2 text-[var(--color-text)]">Direitos de uso</h2>
                  <p className="text-sm leading-relaxed text-[var(--color-text-secondary)]">Você não vende arquivo, vende licença. Quanto mais amplo o uso, maior o valor.</p>
                </div>
                <div className="flex flex-col gap-2">
                  {(Object.entries(USAGE_RIGHTS_MULTIPLIERS) as [UsageRights, typeof USAGE_RIGHTS_MULTIPLIERS[UsageRights]][]).map(([key, val]) => (
                    <OptionRow key={key} value={key} selected={usageRights === key} onSelect={(v) => { setUsageRights(v); recalcQuote({ usageRights: v }) }} label={val.label} desc={val.description} mult={`×${val.multiplier}`} />
                  ))}
                </div>
              </div>
            )}

            {step === 6 && (
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-1">
                  <h2 className="h2 text-[var(--color-text)]">Custos extras</h2>
                  <p className="text-sm leading-relaxed text-[var(--color-text-secondary)]">
                    Terceiros, licenças, deslocamento, equipamento alugado. Repasse sem embutir no seu lucro.
                  </p>
                </div>
                {directCosts.length === 0 && (
                  <div className="p-5 border border-dashed border-[var(--color-border)] rounded-[var(--radius-md)] text-xs leading-relaxed text-[var(--color-text-secondary)]">
                    Nenhum custo direto neste projeto. Se você vai pagar alguém ou comprar licença, lance aqui.
                  </div>
                )}
                <div className="flex flex-col gap-2.5">
                  {directCosts.map((c) => (
                    <div key={c.id} className="flex flex-wrap gap-2.5 items-end">
                      <label className="flex flex-col gap-1.5 flex-1 min-w-[150px]">
                        <span className="label-uppercase">Descrição</span>
                        <input
                          value={c.label}
                          onChange={(e) => updateDirectCost(c.id, { label: e.target.value })}
                          placeholder="Ex.: Ilustrador terceirizado"
                          className="h-[var(--control-h)] w-full px-3 bg-[var(--color-bg)] border border-[var(--color-border-strong)] text-sm text-[var(--color-text)] rounded-[var(--radius-md)] outline-none focus:border-[var(--color-brand-red)]"
                        />
                      </label>
                      <label className="flex flex-col gap-1.5 w-[140px]">
                        <span className="label-uppercase">Valor</span>
                        <input
                          type="number"
                          value={c.amount || ''}
                          onChange={(e) => updateDirectCost(c.id, { amount: parseFloat(e.target.value) || 0 })}
                          onBlur={() => recalcQuote()}
                          placeholder="0"
                          className="h-[var(--control-h)] w-full px-3 bg-[var(--color-bg)] border border-[var(--color-border-strong)] font-mono text-sm text-[var(--color-text)] rounded-[var(--radius-md)] outline-none focus:border-[var(--color-brand-red)]"
                        />
                      </label>
                      <button
                        type="button"
                        onClick={() => removeDirectCost(c.id)}
                        title="Remover"
                        className="flex items-center justify-center w-[var(--control-h)] h-[var(--control-h)] border border-[var(--color-border)] text-[var(--color-text-muted)] rounded-[var(--radius-md)] hover:text-[var(--color-brand-red)] hover:border-[var(--color-brand-red)] transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={addDirectCost}
                  className="flex items-center gap-2 self-start h-[var(--control-h)] px-4 border border-dashed border-[var(--color-border)] text-[var(--color-text-secondary)] text-xs font-600 rounded-full hover:text-[var(--color-text)] hover:border-[var(--color-brand-red)] transition-colors"
                >
                  <Plus size={15} />
                  Adicionar custo direto
                </button>
                <label className="flex flex-col gap-1.5">
                  <span className="label-uppercase">Margem adicional (%)</span>
                  <input
                    type="number"
                    value={extraMargin || ''}
                    onChange={(e) => setExtraMargin(parseFloat(e.target.value) || 0)}
                    onBlur={() => recalcQuote()}
                    className="h-[var(--control-h)] px-3 bg-[var(--color-bg)] border border-[var(--color-border-strong)] font-mono text-sm text-[var(--color-text)] rounded-[var(--radius-md)] outline-none focus:border-[var(--color-brand-red)] max-w-[200px]"
                  />
                  <span className="text-2xs text-[var(--color-text-muted)]">Espaço para negociar desconto sem furar o piso.</span>
                </label>
              </div>
            )}

            {step === 7 && (
              <div className="flex flex-col gap-5">
                <div className="flex flex-col gap-1">
                  <span className="label-uppercase text-[var(--color-brand-red)]">{projectName || 'Projeto'}{clientName ? ` · ${clientName}` : ''}</span>
                  <h2 className="h2 text-[var(--color-text)]">Seu orçamento</h2>
                </div>
                <div className="grid gap-3 transition-opacity" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', opacity: calculating ? 0.6 : 1 }}>
                  <div className="flex flex-col gap-1.5 p-[18px] bg-[var(--color-bg)] border border-[var(--color-border)] rounded-[var(--radius-md)]">
                    <span className="label-uppercase">Mínimo</span>
                    <span className="numeric-display text-2xl text-[var(--color-text-secondary)]">{formatCurrency(fq.quote.minimum)}</span>
                    <span className="text-2xs text-[var(--color-text-muted)]">Piso técnico · horas × valor-hora</span>
                  </div>
                  <div className="flex flex-col gap-1.5 p-[18px] bg-[var(--color-brand-red)]/10 border border-[var(--color-brand-red)] rounded-[var(--radius-md)]">
                    <span className="label-uppercase text-[var(--color-brand-red)]">Recomendado</span>
                    <span className="numeric-display text-[32px] text-[var(--color-brand-red)]">{formatCurrency(fq.quote.recommended)}</span>
                    <span className="text-2xs text-[var(--color-text-secondary)]">3 camadas + gross-up {taxRegime.replace('_', ' ')}</span>
                  </div>
                  <div className="flex flex-col gap-1.5 p-[18px] bg-[var(--color-bg)] border border-[var(--color-border)] rounded-[var(--radius-md)]">
                    <span className="label-uppercase">Premium</span>
                    <span className="numeric-display text-2xl text-[var(--color-text-secondary)]">{formatCurrency(fq.quote.premium)}</span>
                    <span className="text-2xs text-[var(--color-text-muted)]">Valor percebido alto</span>
                  </div>
                </div>

                <div className="flex flex-col gap-2.5 pt-4 border-t border-[var(--color-border)]">
                  <span className="label-uppercase">Composição do preço</span>
                  <div className="flex justify-between gap-3 text-xs">
                    <span className="text-[var(--color-text-secondary)]">Mão de obra · {estimatedHours}h × {formatCurrency(fq.hourlyRate)}</span>
                    <span className="font-mono text-[var(--color-text)]">{formatCurrency(fq.laborCost)}</span>
                  </div>
                  <div className="flex justify-between gap-3 text-xs">
                    <span className="text-[var(--color-text-secondary)]">Contingência de revisões</span>
                    <span className="font-mono text-[var(--color-text)]">{formatCurrency(fq.revisionCost)}</span>
                  </div>
                  <div className="flex justify-between gap-3 text-xs">
                    <span className="text-[var(--color-text-secondary)]">Custos diretos</span>
                    <span className="font-mono text-[var(--color-text)]">{formatCurrency(fq.totalDirectCosts)}</span>
                  </div>
                  <div className="flex justify-between gap-3 text-xs pt-2 border-t border-[var(--color-border-subtle)]">
                    <span className="font-700 text-[var(--color-text)]">Preço base · Camada 2</span>
                    <span className="font-mono font-700 text-[var(--color-text)]">{formatCurrency(fq.basePrice)}</span>
                  </div>
                  <div className="flex justify-between gap-3 text-xs">
                    <span className="text-[var(--color-text-secondary)]">Ajuste de mercado ×{fq.quote.multiplierDetail.combined.toFixed(2)}</span>
                    <span className="font-mono text-[var(--color-text)]">{formatCurrency(fq.quote.adjustedPrice)}</span>
                  </div>
                  <div className="flex justify-between gap-3 text-xs">
                    <span className="text-[var(--color-text-secondary)]">Gross-up tributário · {(fq.quote.taxDetail.rate * 100).toFixed(1)}%</span>
                    <span className="font-mono text-[var(--color-text)]">{formatCurrency(fq.quote.taxDetail.taxAmount)}</span>
                  </div>
                  <div className="flex justify-between gap-3 text-xs">
                    <span className="text-[var(--color-text-secondary)]">Margem adicional</span>
                    <span className="font-mono text-[var(--color-text)]">{formatCurrency(fq.quote.extraMarginAmount)}</span>
                  </div>
                </div>

                <div className="flex flex-col gap-2 pt-4 border-t border-[var(--color-border)]">
                  <span className="label-uppercase">Multiplicadores aplicados</span>
                  {[
                    { category: 'Complexidade', ...fq.quote.multiplierDetail.complexity },
                    { category: 'Urgência', ...fq.quote.multiplierDetail.urgency },
                    { category: 'Porte do cliente', ...fq.quote.multiplierDetail.clientSize },
                    { category: 'Direitos de uso', ...fq.quote.multiplierDetail.usageRights },
                  ].map((m) => (
                    <div key={m.category} className="flex items-center justify-between gap-3 p-2.5 bg-[var(--color-bg)] border border-[var(--color-border)] rounded-[var(--radius-md)]">
                      <div className="flex flex-col">
                        <span className="text-2xs tracking-wide uppercase text-[var(--color-text-muted)]">{m.category}</span>
                        <span className="text-xs font-700 text-[var(--color-text)]">{m.label}</span>
                      </div>
                      <span className="numeric-display text-base text-[var(--color-brand-red)]">×{m.multiplier}</span>
                    </div>
                  ))}
                </div>

                {fq.benchmark && (
                  <div className="flex flex-col gap-2.5 p-4 bg-[var(--color-bg)] border border-[var(--color-border)] rounded-[var(--radius-md)]">
                    <span className="label-uppercase text-[var(--color-brand-yellow)]">Comparativo ADG Brasil · {fq.benchmark.service.name}</span>
                    <div className="relative h-2.5 w-full bg-[var(--color-surface-raised)] rounded-full">
                      <div className="absolute -top-1 w-[3px] h-[18px] bg-[var(--color-brand-red)]" style={{ left: benchPos }} />
                    </div>
                    <div className="flex justify-between gap-2.5">
                      <span className="text-2xs text-[var(--color-text-muted)]">{formatCurrency(fq.benchmark.service.minRate)} – {formatCurrency(fq.benchmark.service.maxRate)}</span>
                      <span className="text-2xs text-[var(--color-text-muted)]">média {formatCurrency(fq.benchmark.service.recommendedRate)}</span>
                    </div>
                    <span className="text-xs font-700" style={{ color: benchColor }}>{fq.benchmark.statusText}</span>
                  </div>
                )}

                <div className="flex flex-wrap gap-2.5 pt-2">
                  <Button type="button" onClick={handleSaveProposal}>
                    <FileText size={16} />
                    Salvar proposta
                  </Button>
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => { handleSaveProposal(); router.push('/propostas/preview') }}
                  >
                    <Download size={16} />
                    Ver proposta em PDF
                  </Button>
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => { setStep(0); setProjectName(''); setClientName(''); setDirectCosts([]) }}
                  >
                    Novo cálculo
                  </Button>
                </div>
              </div>
            )}

            {/* Navegação */}
            <div className="flex flex-wrap gap-2.5 pt-4 border-t border-[var(--color-border)]">
              {step > 0 && (
                <Button type="button" variant="secondary" onClick={() => setStep((s) => s - 1)}>
                  <ArrowLeft size={15} />
                  Voltar
                </Button>
              )}
              {step < 7 && !canAdvance && (
                <div className="flex items-center gap-3 ml-auto flex-wrap justify-end">
                  <span className="text-2xs text-[var(--color-brand-yellow)]">{advanceHint}</span>
                  <Button type="button" disabled>
                    Continuar
                    <ArrowRight size={15} />
                  </Button>
                </div>
              )}
              {step < 7 && canAdvance && (
                <Button type="button" className="ml-auto" onClick={() => setStep((s) => s + 1)}>
                  Continuar
                  <ArrowRight size={15} />
                </Button>
              )}
            </div>
          </div>

          {/* Coluna sticky: preço recomendado */}
          <aside
            className="flex flex-col gap-3.5 p-5 rounded-[var(--radius-card)] sticky transition-opacity
              bg-[var(--color-slab-accent-bg)] border border-[var(--color-slab-accent-line)]
              [--color-text:var(--color-on-accent-1)] [--color-text-secondary:var(--color-on-accent-2)] [--color-text-muted:var(--color-on-accent-3)]
              text-[var(--color-on-accent-1)]"
            style={{ top: 88, opacity: calculating ? 0.6 : 1 }}
          >
            <span className="label-uppercase">Preço recomendado</span>
            <span className="numeric-display leading-[.9] text-[var(--color-text)]" style={{ fontSize: 'clamp(36px,6vw,56px)' }}>
              {formatCurrency(fq.quote.recommended)}
            </span>
            <div className="flex flex-col gap-2 pt-3 border-t border-[var(--color-slab-accent-line)]">
              <div className="flex justify-between gap-2.5 text-xs">
                <span className="text-[var(--color-text-secondary)]">Piso técnico</span>
                <span className="font-mono font-700 text-[var(--color-text)]">{formatCurrency(fq.quote.minimum)}</span>
              </div>
              <div className="flex justify-between gap-2.5 text-xs">
                <span className="text-[var(--color-text-secondary)]">Preço base</span>
                <span className="font-mono font-700 text-[var(--color-text)]">{formatCurrency(fq.basePrice)}</span>
              </div>
              <div className="flex justify-between gap-2.5 text-xs">
                <span className="text-[var(--color-text-secondary)]">Multiplicador combinado</span>
                <span className="font-mono font-700 text-[var(--color-brand-red)]">×{fq.quote.multiplierDetail.combined.toFixed(2)}</span>
              </div>
              <div className="flex justify-between gap-2.5 text-xs">
                <span className="text-[var(--color-text-secondary)]">Imposto embutido</span>
                <span className="font-mono font-700 text-[var(--color-text)]">{formatCurrency(fq.quote.taxDetail.taxAmount)}</span>
              </div>
              <div className="flex justify-between gap-2.5 text-xs">
                <span className="text-[var(--color-text-secondary)]">Valor-hora real</span>
                <span className="font-mono font-700 text-[var(--color-text)]">{formatCurrency(fq.hourlyRate)}</span>
              </div>
            </div>
            <span className="text-2xs leading-relaxed text-[var(--color-text-muted)]">
              O número atualiza a cada escolha. Nada aqui é estimativa de vitrine, é o seu custo com o mercado aplicado em cima.
            </span>
          </aside>
        </div>
      </div>
    </PageContent>
  )
}
