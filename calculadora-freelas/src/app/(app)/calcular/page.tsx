'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { PageContent } from '@/shared/components/layout/shell'
import {
  calculateLayer1,
  calculateLayer2,
  calculateLayer3,
  COMPLEXITY_MULTIPLIERS,
  URGENCY_MULTIPLIERS,
  CLIENT_SIZE_MULTIPLIERS,
  USAGE_RIGHTS_MULTIPLIERS,
  ADEGRAF_BENCHMARKS,
  compareQuoteWithBenchmark,
  type ComplexityLevel,
  type UrgencyLevel,
  type ClientSize,
  type UsageRights,
  type PricingMethod,
  type TaxRegime,
} from '@/modules/pricing/lib'
import { formatCurrency } from '@/shared/lib/utils'
import { DEFAULT_COSTS, loadCosts, loadProfile, saveLastProposal, totalMonthlyExpenses, type SavedCosts } from '@/shared/lib/storage'
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
        <span className="text-sm font-700 uppercase tracking-wide text-[var(--color-text)]">{label}</span>
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

  useEffect(() => {
    setCosts(loadCosts())
    const profile = loadProfile()
    if (profile) setTaxRegime(profile.taxRegime)
  }, [])

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
  const noRateWarning = layer1.realHourlyRate === 0

  const minimumPrice = layer1.realHourlyRate * estimatedHours
  const layer2 = calculateLayer2({
    realHourlyRate: layer1.realHourlyRate,
    pricingMethod,
    estimatedHours,
    revisions,
    directCosts: directCosts.map((c) => ({ label: c.label, amount: c.amount })),
    extraCosts: [],
  })
  const quote = calculateLayer3(
    { basePrice: layer2.basePrice, complexity, urgency, clientSize, usageRights, taxRegime, extraMargin: extraMargin / 100 },
    minimumPrice
  )

  const benchmark = benchmarkId ? compareQuoteWithBenchmark(quote.recommended, benchmarkId) : null

  const canAdvance = step === 0 ? projectName.trim().length > 0 : step === 1 ? estimatedHours > 0 : true
  const advanceHint = step === 0 ? 'Dê um nome ao projeto para continuar' : 'Informe as horas estimadas para continuar'

  const addDirectCost = () => setDirectCosts((prev) => [...prev, { id: Date.now().toString(), label: '', amount: 0 }])
  const removeDirectCost = (id: string) => setDirectCosts((prev) => prev.filter((c) => c.id !== id))
  const updateDirectCost = (id: string, patch: Partial<DirectCostRow>) =>
    setDirectCosts((prev) => prev.map((c) => (c.id === id ? { ...c, ...patch } : c)))

  const handleSaveProposal = () => {
    let authorName: string | undefined
    try {
      const session = localStorage.getItem('bob_user_session')
      if (session) authorName = JSON.parse(session).name
    } catch {
      // sessão inválida — segue sem nome de autor
    }

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
        hourlyRate: layer1.realHourlyRate,
        billableHours: layer1.billableHours,
        totalMonthlyCost: layer1.totalMonthlyCost,
        basePrice: layer2.basePrice,
        quote,
        belowFloor: quote.recommended < minimumPrice,
      },
      laborCost: layer2.laborCost,
      revisionCost: layer2.revisionCost,
      totalDirectCosts: layer2.totalDirectCosts,
      benchmark,
    })
  }

  const benchPos = benchmark
    ? `${Math.max(0, Math.min(100, ((quote.recommended - benchmark.service.minRate) / (benchmark.service.maxRate - benchmark.service.minRate)) * 100))}%`
    : '0%'
  const benchColor =
    benchmark?.status === 'below'
      ? 'var(--color-brand-yellow)'
      : benchmark?.status === 'above'
        ? 'var(--color-brand-red)'
        : 'var(--color-brand-green)'

  return (
    <PageContent>
      <div className="flex flex-col gap-[22px]">
        {/* Cabeçalho do wizard */}
        <div
          className="flex flex-col gap-3.5 p-6 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-lg)]"
          style={{ borderTop: '2px solid var(--color-brand-red)' }}
        >
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
                className="flex items-center gap-1.5 h-[34px] px-2.5 border border-[var(--color-border)] text-[var(--color-text-secondary)] text-[11px] font-700 tracking-wide uppercase rounded-[var(--radius-sm)] hover:border-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors"
              >
                <span className="font-mono text-[10px] text-[var(--color-text-muted)]">{String(i + 1).padStart(2, '0')}</span>
                {label}
              </button>
            ))}
          </div>
        </div>

        {noRateWarning && (
          <div className="flex flex-wrap items-center gap-3.5 p-5 bg-[var(--color-brand-yellow)]/[.12] border border-[var(--color-brand-yellow)]/30 rounded-[var(--radius-lg)]">
            <AlertTriangle size={18} className="text-[var(--color-brand-yellow)] flex-shrink-0" />
            <span className="flex-1 min-w-[200px] text-sm leading-relaxed text-[var(--color-text)]">
              Seu valor-hora é R$ 0,00, sem custos configurados o orçamento não tem base. Configure a Camada 1 primeiro.
            </span>
            <button
              type="button"
              onClick={() => router.push('/custos')}
              className="h-[38px] px-3.5 bg-[var(--color-brand-yellow)] text-black text-xs font-800 tracking-wide uppercase rounded-[var(--radius-md)]"
            >
              Ir para meus custos
            </button>
          </div>
        )}

        <div className="grid gap-4 items-start" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
          <div className="flex flex-col gap-4 p-6 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-lg)]">
            {step === 0 && (
              <div className="flex flex-col gap-[18px]">
                <div className="flex flex-col gap-1">
                  <h2 className="text-display-sm text-[var(--color-text)]">Qual o projeto?</h2>
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
                    className="h-12 px-3.5 bg-[var(--color-bg)] border border-[var(--color-border)] text-sm text-[var(--color-text)] rounded-[var(--radius-md)] outline-none focus:border-[var(--color-brand-red)]"
                  />
                </label>
                <label className="flex flex-col gap-1.5">
                  <span className="label-uppercase">Cliente</span>
                  <input
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    placeholder="Ex.: Cafeteria Norte"
                    className="h-12 px-3.5 bg-[var(--color-bg)] border border-[var(--color-border)] text-sm text-[var(--color-text)] rounded-[var(--radius-md)] outline-none focus:border-[var(--color-brand-red)]"
                  />
                </label>
                <label className="flex flex-col gap-1.5">
                  <span className="label-uppercase">Serviço de referência · ADG Brasil</span>
                  <select
                    value={benchmarkId}
                    onChange={(e) => setBenchmarkId(e.target.value)}
                    className="h-12 px-3 bg-[var(--color-bg)] border border-[var(--color-border)] text-sm text-[var(--color-text)] rounded-[var(--radius-md)] outline-none focus:border-[var(--color-brand-red)]"
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
                          onClick={() => setPricingMethod(m.value)}
                          className={`flex flex-col gap-0.5 items-start min-h-16 p-3 rounded-[var(--radius-md)] text-left transition-colors ${
                            selected
                              ? 'border border-[var(--color-brand-red)] bg-[var(--color-brand-red)]/10'
                              : 'border border-[var(--color-border)] bg-[var(--color-bg)] hover:border-[var(--color-text-muted)]'
                          }`}
                        >
                          <span className={`text-xs font-800 uppercase tracking-wide ${selected ? 'text-[var(--color-text)]' : 'text-[var(--color-text-secondary)]'}`}>
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
                  <h2 className="text-display-sm text-[var(--color-text)]">Quanto tempo leva?</h2>
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
                    placeholder="0"
                    className="h-14 px-3.5 bg-[var(--color-bg)] border border-[var(--color-border)] font-display font-900 text-2xl text-[var(--color-text)] rounded-[var(--radius-md)] outline-none focus:border-[var(--color-brand-red)]"
                  />
                </label>
                <label className="flex flex-col gap-1.5">
                  <span className="label-uppercase">Rodadas de revisão inclusas</span>
                  <input
                    type="number"
                    value={revisions}
                    onChange={(e) => setRevisions(parseInt(e.target.value) || 0)}
                    className="h-12 px-3.5 bg-[var(--color-bg)] border border-[var(--color-border)] font-mono text-sm text-[var(--color-text)] rounded-[var(--radius-md)] outline-none focus:border-[var(--color-brand-red)]"
                  />
                  <span className="text-2xs text-[var(--color-text-muted)]">Cada rodada entra como meia hora de contingência por revisão.</span>
                </label>
                <div className="flex flex-col gap-1.5 p-3.5 bg-[var(--color-bg)] border border-[var(--color-border)] rounded-[var(--radius-md)]">
                  <span className="label-uppercase">Mão de obra a este ritmo</span>
                  <span className="numeric-display text-2xl text-[var(--color-text)]">{formatCurrency(layer2.laborCost)}</span>
                  <span className="text-2xs text-[var(--color-text-muted)]">{estimatedHours}h × {formatCurrency(layer1.realHourlyRate)} de valor-hora real</span>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-1">
                  <h2 className="text-display-sm text-[var(--color-text)]">Qual a complexidade?</h2>
                  <p className="text-sm leading-relaxed text-[var(--color-text-secondary)]">Quanto mais variáveis fora do seu controle, maior o multiplicador.</p>
                </div>
                <div className="flex flex-col gap-2">
                  {(Object.entries(COMPLEXITY_MULTIPLIERS) as [ComplexityLevel, typeof COMPLEXITY_MULTIPLIERS[ComplexityLevel]][]).map(([key, val]) => (
                    <OptionRow key={key} value={key} selected={complexity === key} onSelect={setComplexity} label={val.label} desc={val.description} mult={`×${val.multiplier}`} />
                  ))}
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-1">
                  <h2 className="text-display-sm text-[var(--color-text)]">Qual a urgência?</h2>
                  <p className="text-sm leading-relaxed text-[var(--color-text-secondary)]">Prazo curto custa agenda, madrugada e fim de semana. Isso tem preço.</p>
                </div>
                <div className="flex flex-col gap-2">
                  {(Object.entries(URGENCY_MULTIPLIERS) as [UrgencyLevel, typeof URGENCY_MULTIPLIERS[UrgencyLevel]][]).map(([key, val]) => (
                    <OptionRow key={key} value={key} selected={urgency === key} onSelect={setUrgency} label={val.label} desc={val.description} mult={`×${val.multiplier}`} />
                  ))}
                </div>
              </div>
            )}

            {step === 4 && (
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-1">
                  <h2 className="text-display-sm text-[var(--color-text)]">Qual o porte do cliente?</h2>
                  <p className="text-sm leading-relaxed text-[var(--color-text-secondary)]">O mesmo trabalho gera retornos diferentes. Cobre proporcional ao impacto.</p>
                </div>
                <div className="flex flex-col gap-2">
                  {(Object.entries(CLIENT_SIZE_MULTIPLIERS) as [ClientSize, typeof CLIENT_SIZE_MULTIPLIERS[ClientSize]][]).map(([key, val]) => (
                    <OptionRow key={key} value={key} selected={clientSize === key} onSelect={setClientSize} label={val.label} desc={val.description} mult={`×${val.multiplier}`} />
                  ))}
                </div>
              </div>
            )}

            {step === 5 && (
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-1">
                  <h2 className="text-display-sm text-[var(--color-text)]">Direitos de uso</h2>
                  <p className="text-sm leading-relaxed text-[var(--color-text-secondary)]">Você não vende arquivo, vende licença. Quanto mais amplo o uso, maior o valor.</p>
                </div>
                <div className="flex flex-col gap-2">
                  {(Object.entries(USAGE_RIGHTS_MULTIPLIERS) as [UsageRights, typeof USAGE_RIGHTS_MULTIPLIERS[UsageRights]][]).map(([key, val]) => (
                    <OptionRow key={key} value={key} selected={usageRights === key} onSelect={setUsageRights} label={val.label} desc={val.description} mult={`×${val.multiplier}`} />
                  ))}
                </div>
              </div>
            )}

            {step === 6 && (
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-1">
                  <h2 className="text-display-sm text-[var(--color-text)]">Custos extras</h2>
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
                          className="h-[46px] w-full px-3 bg-[var(--color-bg)] border border-[var(--color-border)] text-sm text-[var(--color-text)] rounded-[var(--radius-md)] outline-none focus:border-[var(--color-brand-red)]"
                        />
                      </label>
                      <label className="flex flex-col gap-1.5 w-[140px]">
                        <span className="label-uppercase">Valor</span>
                        <input
                          type="number"
                          value={c.amount || ''}
                          onChange={(e) => updateDirectCost(c.id, { amount: parseFloat(e.target.value) || 0 })}
                          placeholder="0"
                          className="h-[46px] w-full px-3 bg-[var(--color-bg)] border border-[var(--color-border)] font-mono text-sm text-[var(--color-text)] rounded-[var(--radius-md)] outline-none focus:border-[var(--color-brand-red)]"
                        />
                      </label>
                      <button
                        type="button"
                        onClick={() => removeDirectCost(c.id)}
                        title="Remover"
                        className="flex items-center justify-center w-[46px] h-[46px] border border-[var(--color-border)] text-[var(--color-text-muted)] rounded-[var(--radius-md)] hover:text-[var(--color-brand-red)] hover:border-[var(--color-brand-red)] transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={addDirectCost}
                  className="flex items-center gap-2 self-start h-[42px] px-4 border border-dashed border-[var(--color-border)] text-[var(--color-text-secondary)] text-xs font-700 tracking-wide uppercase rounded-[var(--radius-md)] hover:text-[var(--color-text)] hover:border-[var(--color-brand-red)] transition-colors"
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
                    className="h-[46px] px-3 bg-[var(--color-bg)] border border-[var(--color-border)] font-mono text-sm text-[var(--color-text)] rounded-[var(--radius-md)] outline-none focus:border-[var(--color-brand-red)] max-w-[200px]"
                  />
                  <span className="text-2xs text-[var(--color-text-muted)]">Espaço para negociar desconto sem furar o piso.</span>
                </label>
              </div>
            )}

            {step === 7 && (
              <div className="flex flex-col gap-5">
                <div className="flex flex-col gap-1">
                  <span className="label-uppercase text-[var(--color-brand-red)]">{projectName || 'Projeto'}{clientName ? ` · ${clientName}` : ''}</span>
                  <h2 className="text-display-sm text-[var(--color-text)]">Seu orçamento</h2>
                </div>
                <div className="grid gap-3" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))' }}>
                  <div className="flex flex-col gap-1.5 p-[18px] bg-[var(--color-bg)] border border-[var(--color-border)] rounded-[var(--radius-md)]">
                    <span className="label-uppercase">Mínimo</span>
                    <span className="numeric-display text-2xl text-[var(--color-text-secondary)]">{formatCurrency(quote.minimum)}</span>
                    <span className="text-2xs text-[var(--color-text-muted)]">Piso técnico · horas × valor-hora</span>
                  </div>
                  <div className="flex flex-col gap-1.5 p-[18px] bg-[var(--color-brand-red)]/10 border border-[var(--color-brand-red)] rounded-[var(--radius-md)]">
                    <span className="label-uppercase text-[var(--color-brand-red)]">Recomendado</span>
                    <span className="numeric-display text-[32px] text-[var(--color-brand-red)]">{formatCurrency(quote.recommended)}</span>
                    <span className="text-2xs text-[var(--color-text-secondary)]">3 camadas + gross-up {taxRegime.replace('_', ' ')}</span>
                  </div>
                  <div className="flex flex-col gap-1.5 p-[18px] bg-[var(--color-bg)] border border-[var(--color-border)] rounded-[var(--radius-md)]">
                    <span className="label-uppercase">Premium</span>
                    <span className="numeric-display text-2xl text-[var(--color-text-secondary)]">{formatCurrency(quote.premium)}</span>
                    <span className="text-2xs text-[var(--color-text-muted)]">Valor percebido alto</span>
                  </div>
                </div>

                <div className="flex flex-col gap-2.5 pt-4 border-t border-[var(--color-border)]">
                  <span className="label-uppercase">Composição do preço</span>
                  <div className="flex justify-between gap-3 text-xs">
                    <span className="text-[var(--color-text-secondary)]">Mão de obra · {estimatedHours}h × {formatCurrency(layer1.realHourlyRate)}</span>
                    <span className="font-mono text-[var(--color-text)]">{formatCurrency(layer2.laborCost)}</span>
                  </div>
                  <div className="flex justify-between gap-3 text-xs">
                    <span className="text-[var(--color-text-secondary)]">Contingência de revisões</span>
                    <span className="font-mono text-[var(--color-text)]">{formatCurrency(layer2.revisionCost)}</span>
                  </div>
                  <div className="flex justify-between gap-3 text-xs">
                    <span className="text-[var(--color-text-secondary)]">Custos diretos</span>
                    <span className="font-mono text-[var(--color-text)]">{formatCurrency(layer2.totalDirectCosts)}</span>
                  </div>
                  <div className="flex justify-between gap-3 text-xs pt-2 border-t border-[var(--color-border-subtle)]">
                    <span className="font-700 text-[var(--color-text)]">Preço base · Camada 2</span>
                    <span className="font-mono font-700 text-[var(--color-text)]">{formatCurrency(layer2.basePrice)}</span>
                  </div>
                  <div className="flex justify-between gap-3 text-xs">
                    <span className="text-[var(--color-text-secondary)]">Ajuste de mercado ×{quote.multiplierDetail.combined.toFixed(2)}</span>
                    <span className="font-mono text-[var(--color-text)]">{formatCurrency(quote.adjustedPrice)}</span>
                  </div>
                  <div className="flex justify-between gap-3 text-xs">
                    <span className="text-[var(--color-text-secondary)]">Gross-up tributário · {(quote.taxDetail.rate * 100).toFixed(1)}%</span>
                    <span className="font-mono text-[var(--color-text)]">{formatCurrency(quote.taxDetail.taxAmount)}</span>
                  </div>
                  <div className="flex justify-between gap-3 text-xs">
                    <span className="text-[var(--color-text-secondary)]">Margem adicional</span>
                    <span className="font-mono text-[var(--color-text)]">{formatCurrency(quote.extraMarginAmount)}</span>
                  </div>
                </div>

                <div className="flex flex-col gap-2 pt-4 border-t border-[var(--color-border)]">
                  <span className="label-uppercase">Multiplicadores aplicados</span>
                  {[
                    { category: 'Complexidade', ...quote.multiplierDetail.complexity },
                    { category: 'Urgência', ...quote.multiplierDetail.urgency },
                    { category: 'Porte do cliente', ...quote.multiplierDetail.clientSize },
                    { category: 'Direitos de uso', ...quote.multiplierDetail.usageRights },
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

                {benchmark && (
                  <div className="flex flex-col gap-2.5 p-4 bg-[var(--color-bg)] border border-[var(--color-border)] rounded-[var(--radius-md)]">
                    <span className="label-uppercase text-[var(--color-brand-yellow)]">Comparativo ADG Brasil · {benchmark.service.name}</span>
                    <div className="relative h-2.5 w-full bg-[var(--color-surface-raised)] rounded-full">
                      <div className="absolute -top-1 w-[3px] h-[18px] bg-[var(--color-brand-red)]" style={{ left: benchPos }} />
                    </div>
                    <div className="flex justify-between gap-2.5">
                      <span className="text-2xs text-[var(--color-text-muted)]">{formatCurrency(benchmark.service.minRate)} – {formatCurrency(benchmark.service.maxRate)}</span>
                      <span className="text-2xs text-[var(--color-text-muted)]">média {formatCurrency(benchmark.service.recommendedRate)}</span>
                    </div>
                    <span className="text-xs font-700" style={{ color: benchColor }}>{benchmark.statusText}</span>
                  </div>
                )}

                <div className="flex flex-wrap gap-2.5 pt-2">
                  <button
                    type="button"
                    onClick={handleSaveProposal}
                    className="flex items-center gap-2.5 h-[46px] px-5 bg-[var(--color-brand-red)] text-white font-display font-900 text-[15px] uppercase rounded-[var(--radius-md)] hover:brightness-110 transition-[filter]"
                  >
                    <FileText size={16} />
                    Salvar proposta
                  </button>
                  <button
                    type="button"
                    onClick={() => { handleSaveProposal(); router.push('/propostas/preview') }}
                    className="flex items-center gap-2.5 h-[46px] px-[18px] border border-[var(--color-border)] text-[var(--color-text)] font-display font-800 text-[15px] uppercase rounded-[var(--radius-md)] hover:bg-[var(--color-surface-raised)] transition-colors"
                  >
                    <Download size={16} />
                    Ver proposta em PDF
                  </button>
                  <button
                    type="button"
                    onClick={() => { setStep(0); setProjectName(''); setClientName(''); setDirectCosts([]) }}
                    className="h-[46px] px-[18px] border border-[var(--color-border)] text-[var(--color-text)] font-display font-800 text-[15px] uppercase rounded-[var(--radius-md)] hover:bg-[var(--color-surface-raised)] transition-colors"
                  >
                    Novo cálculo
                  </button>
                </div>
              </div>
            )}

            {/* Navegação */}
            <div className="flex flex-wrap gap-2.5 pt-4 border-t border-[var(--color-border)]">
              {step > 0 && (
                <button
                  type="button"
                  onClick={() => setStep((s) => s - 1)}
                  className="flex items-center gap-2 h-[46px] px-[18px] border border-[var(--color-border)] text-[var(--color-text)] text-xs font-700 tracking-wide uppercase rounded-[var(--radius-md)] hover:bg-[var(--color-surface-raised)] transition-colors"
                >
                  <ArrowLeft size={15} />
                  Voltar
                </button>
              )}
              {step < 7 && !canAdvance && (
                <div className="flex items-center gap-3 ml-auto flex-wrap justify-end">
                  <span className="text-2xs tracking-wide uppercase text-[var(--color-brand-yellow)]">{advanceHint}</span>
                  <span className="flex items-center gap-2 h-[46px] px-5 bg-[var(--color-brand-red)] text-white text-xs font-800 tracking-wide uppercase rounded-[var(--radius-md)] opacity-40 pointer-events-none">
                    Continuar
                    <ArrowRight size={15} />
                  </span>
                </div>
              )}
              {step < 7 && canAdvance && (
                <button
                  type="button"
                  onClick={() => setStep((s) => s + 1)}
                  className="flex items-center gap-2 h-[46px] px-5 ml-auto bg-[var(--color-brand-red)] text-white text-xs font-800 tracking-wide uppercase rounded-[var(--radius-md)] hover:brightness-110 transition-[filter]"
                >
                  Continuar
                  <ArrowRight size={15} />
                </button>
              )}
            </div>
          </div>

          {/* Coluna sticky: preço ao vivo */}
          <aside
            className="flex flex-col gap-3.5 p-6 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-lg)] sticky"
            style={{ borderTop: '2px solid var(--color-brand-red)', top: 88 }}
          >
            <span className="label-uppercase">Preço recomendado · ao vivo</span>
            <span className="numeric-display leading-[.9] text-[var(--color-text)]" style={{ fontSize: 'clamp(36px,6vw,56px)' }}>
              {formatCurrency(quote.recommended)}
            </span>
            <div className="flex flex-col gap-2 pt-3 border-t border-[var(--color-border)]">
              <div className="flex justify-between gap-2.5 text-xs">
                <span className="text-[var(--color-text-secondary)]">Piso técnico</span>
                <span className="font-mono font-700 text-[var(--color-text)]">{formatCurrency(quote.minimum)}</span>
              </div>
              <div className="flex justify-between gap-2.5 text-xs">
                <span className="text-[var(--color-text-secondary)]">Preço base</span>
                <span className="font-mono font-700 text-[var(--color-text)]">{formatCurrency(layer2.basePrice)}</span>
              </div>
              <div className="flex justify-between gap-2.5 text-xs">
                <span className="text-[var(--color-text-secondary)]">Multiplicador combinado</span>
                <span className="font-mono font-700 text-[var(--color-brand-red)]">×{quote.multiplierDetail.combined.toFixed(2)}</span>
              </div>
              <div className="flex justify-between gap-2.5 text-xs">
                <span className="text-[var(--color-text-secondary)]">Imposto embutido</span>
                <span className="font-mono font-700 text-[var(--color-text)]">{formatCurrency(quote.taxDetail.taxAmount)}</span>
              </div>
              <div className="flex justify-between gap-2.5 text-xs">
                <span className="text-[var(--color-text-secondary)]">Valor-hora real</span>
                <span className="font-mono font-700 text-[var(--color-text)]">{formatCurrency(layer1.realHourlyRate)}</span>
              </div>
            </div>
            <span className="text-2xs leading-relaxed text-[var(--color-text-muted)]">
              O número muda a cada escolha. Nada aqui é estimativa de vitrine, é o seu custo com o mercado aplicado em cima.
            </span>
          </aside>
        </div>
      </div>
    </PageContent>
  )
}
