'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Logo } from '@/shared/components/ui/logo'
import { calculateLayer1, TAX_RATES, type TaxRegime } from '@/modules/pricing/lib'
import { SERVICE_AREA_LABELS, type ServiceArea } from '@/shared/schemas'
import { saveCosts, saveProfile, markOnboarded, DEFAULT_COSTS, type SavedCosts } from '@/shared/lib/storage'
import { formatCurrency } from '@/shared/lib/utils'
import { CheckCircle2, ArrowLeft, ArrowRight, AlertTriangle } from 'lucide-react'

const REGIMES = Object.entries(TAX_RATES) as [TaxRegime, (typeof TAX_RATES)[TaxRegime]][]
const AREAS = Object.entries(SERVICE_AREA_LABELS) as [ServiceArea, string][]

const STEP_LABELS = ['Passo 01 · quem está cobrando', 'Passo 02 · custo de existência', 'Passo 03 · pronto']

export default function OnboardingPage() {
  const router = useRouter()
  const [step, setStep] = useState(0)

  const [name, setName] = useState('')
  const [area, setArea] = useState<ServiceArea>('graphic_design')
  const [regime, setRegime] = useState<TaxRegime>('mei')

  const [lumpExpenses, setLumpExpenses] = useState(0)
  const [desiredSalary, setDesiredSalary] = useState(0)
  const [availableHours, setAvailableHours] = useState(176)
  const [billablePercentage, setBillablePercentage] = useState(60)

  const layer1 = calculateLayer1({
    monthlyExpenses: lumpExpenses,
    desiredSalary,
    technicalReserve: 0,
    profitMargin: 0,
    availableHours,
    billablePercentage,
  })

  const canAdvance =
    step === 0 ? name.trim().length > 0 : step === 1 ? desiredSalary > 0 && availableHours > 0 : true
  const hint =
    step === 0 ? 'Informe seu nome para continuar' : 'Preencha pró-labore e horas disponíveis'

  const persistAndGo = (destination: string) => {
    const costs: SavedCosts = {
      ...DEFAULT_COSTS,
      expenses: [{ id: 'onboarding-lump', label: 'Despesas fixas', amount: lumpExpenses, category: 'other' }],
      desiredSalary,
      technicalReserve: 0,
      profitMargin: 0,
      availableHours,
      billablePercentage,
    }
    saveCosts(costs)
    saveProfile({ serviceArea: area, taxRegime: regime })
    markOnboarded()
    router.push(destination)
  }

  return (
    <div className="min-h-screen flex flex-col bg-[var(--color-bg)] text-[var(--color-text)]">
      <header className="flex flex-wrap items-center gap-3 px-5 py-4 border-b border-[var(--color-border)]">
        <Logo height={26} />
        <span className="label-uppercase ml-1.5">Configuração inicial · {String(step + 1).padStart(2, '0')} de 03</span>
        <button
          type="button"
          onClick={() => persistAndGo('/dashboard')}
          className="ml-auto text-xs font-600 text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors"
        >
          Pular por agora
        </button>
      </header>
      <div className="h-[3px] w-full bg-[var(--color-surface-raised)]">
        <div
          className="h-full bg-[var(--color-brand-red)] transition-[width] duration-[var(--duration-slow)] ease-out"
          style={{ width: `${((step + 1) / 3) * 100}%` }}
        />
      </div>

      <div className="flex-1 flex items-start justify-center px-5 pt-11 pb-16">
        <div className="w-full max-w-[660px] flex flex-col gap-[26px]">

          {step === 0 && (
            <div className="flex flex-col gap-[22px]">
              <div className="flex flex-col gap-2.5">
                <span className="label-uppercase text-[var(--color-brand-red)]">{STEP_LABELS[0]}</span>
                <h1 className="text-display-lg text-[var(--color-text)]">Antes do preço, o profissional.</h1>
                <p className="text-base leading-relaxed text-[var(--color-text-secondary)] max-w-[52ch]">
                  Seu nome assina a proposta. Sua área e seu regime tributário definem quanto imposto entra no preço — não no seu lucro.
                </p>
              </div>

              <label className="flex flex-col gap-1.5">
                <span className="label-uppercase">Nome</span>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Como você assina seus trabalhos"
                  className="h-[52px] px-3.5 bg-[var(--color-surface)] border border-[var(--color-border)] text-base text-[var(--color-text)] rounded-[var(--radius-md)] outline-none focus:border-[var(--color-brand-red)]"
                />
              </label>

              <div className="flex flex-col gap-2">
                <span className="label-uppercase">Área de atuação</span>
                <div className="grid gap-2" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))' }}>
                  {AREAS.map(([key, label]) => {
                    const selected = area === key
                    return (
                      <button
                        key={key}
                        type="button"
                        onClick={() => setArea(key)}
                        className={`flex items-center justify-center gap-2 min-h-[46px] px-3 text-xs font-700 tracking-wide uppercase rounded-[var(--radius-md)] transition-colors ${
                          selected
                            ? 'border border-[var(--color-brand-red)] bg-[var(--color-brand-red)]/10 text-[var(--color-text)] font-800'
                            : 'border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text-secondary)] hover:border-[var(--color-text-muted)] hover:text-[var(--color-text)]'
                        }`}
                      >
                        {selected && <CheckCircle2 size={14} />}
                        {label}
                      </button>
                    )
                  })}
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <span className="label-uppercase">Regime tributário</span>
                <div className="flex flex-col gap-2">
                  {REGIMES.map(([key, r]) => {
                    const selected = regime === key
                    return (
                      <button
                        key={key}
                        type="button"
                        onClick={() => setRegime(key)}
                        className={`flex items-center gap-3 min-h-[58px] px-3.5 py-3 rounded-[var(--radius-md)] text-left transition-colors ${
                          selected
                            ? 'border border-[var(--color-brand-red)] bg-[var(--color-brand-red)]/10'
                            : 'border border-[var(--color-border)] bg-[var(--color-surface)] hover:border-[var(--color-text-muted)]'
                        }`}
                      >
                        {selected ? (
                          <CheckCircle2 size={18} className="text-[var(--color-brand-red)] flex-shrink-0" />
                        ) : (
                          <span className="w-[18px] h-[18px] rounded-full border border-[var(--color-border)] flex-shrink-0" />
                        )}
                        <span className="flex flex-col gap-0.5 flex-1 min-w-0">
                          <span className="text-sm font-700 uppercase tracking-wide text-[var(--color-text)]">{r.label}</span>
                          <span className="text-2xs text-[var(--color-text-secondary)]">{r.description}</span>
                        </span>
                        <span
                          className="numeric-display text-[17px]"
                          style={{ color: selected ? 'var(--color-brand-red)' : 'var(--color-text-muted)' }}
                        >
                          {(r.rate * 100).toFixed(1)}%
                        </span>
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>
          )}

          {step === 1 && (
            <div className="flex flex-col gap-[22px]">
              <div className="flex flex-col gap-2.5">
                <span className="label-uppercase text-[var(--color-brand-red)]">{STEP_LABELS[1]}</span>
                <h1 className="text-display-lg text-[var(--color-text)]">Quanto custa você existir?</h1>
                <p className="text-base leading-relaxed text-[var(--color-text-secondary)] max-w-[52ch]">
                  Números aproximados já servem. Você refina tudo depois em Meus custos — e o piso se recalcula na hora.
                </p>
              </div>

              <div className="grid gap-3.5" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
                <label className="flex flex-col gap-1.5">
                  <span className="label-uppercase">Despesas fixas / mês</span>
                  <input
                    type="number"
                    value={lumpExpenses || ''}
                    onChange={(e) => setLumpExpenses(parseFloat(e.target.value) || 0)}
                    placeholder="0"
                    className="h-[52px] px-3.5 bg-[var(--color-surface)] border border-[var(--color-border)] font-mono text-base text-[var(--color-text)] rounded-[var(--radius-md)] outline-none focus:border-[var(--color-brand-red)]"
                  />
                  <span className="text-2xs text-[var(--color-text-muted)]">Internet, softwares, contador, estrutura</span>
                </label>
                <label className="flex flex-col gap-1.5">
                  <span className="label-uppercase">Pró-labore desejado</span>
                  <input
                    type="number"
                    value={desiredSalary || ''}
                    onChange={(e) => setDesiredSalary(parseFloat(e.target.value) || 0)}
                    placeholder="0"
                    className="h-[52px] px-3.5 bg-[var(--color-surface)] border border-[var(--color-border)] font-mono text-base text-[var(--color-text)] rounded-[var(--radius-md)] outline-none focus:border-[var(--color-brand-red)]"
                  />
                  <span className="text-2xs text-[var(--color-text-muted)]">O que você quer receber todo mês</span>
                </label>
                <label className="flex flex-col gap-1.5">
                  <span className="label-uppercase">Horas disponíveis / mês</span>
                  <input
                    type="number"
                    value={availableHours}
                    onChange={(e) => setAvailableHours(parseFloat(e.target.value) || 0)}
                    className="h-[52px] px-3.5 bg-[var(--color-surface)] border border-[var(--color-border)] font-mono text-base text-[var(--color-text)] rounded-[var(--radius-md)] outline-none focus:border-[var(--color-brand-red)]"
                  />
                  <span className="text-2xs text-[var(--color-text-muted)]">Padrão: 176h = 22 dias × 8h</span>
                </label>
                <label className="flex flex-col gap-1.5">
                  <span className="label-uppercase">Aproveitamento faturável (%)</span>
                  <input
                    type="number"
                    value={billablePercentage}
                    onChange={(e) => setBillablePercentage(parseFloat(e.target.value) || 0)}
                    className="h-[52px] px-3.5 bg-[var(--color-surface)] border border-[var(--color-border)] font-mono text-base text-[var(--color-text)] rounded-[var(--radius-md)] outline-none focus:border-[var(--color-brand-red)]"
                  />
                  <span className="text-2xs text-[var(--color-text-muted)]">Ninguém fatura 100% das horas</span>
                </label>
              </div>

              <div
                className="flex flex-wrap items-center gap-4 p-[18px] bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-md)]"
                style={{ borderLeft: '3px solid var(--color-brand-yellow)' }}
              >
                <div className="flex flex-col gap-0.5">
                  <span className="label-uppercase">Prévia do valor-hora</span>
                  <span className="numeric-display text-[32px] text-[var(--color-text)]">{formatCurrency(layer1.realHourlyRate)}</span>
                </div>
                <span className="text-xs text-[var(--color-text-secondary)] max-w-[34ch] leading-relaxed">
                  {layer1.billableHours.toFixed(0)}h faturáveis · {formatCurrency(layer1.totalMonthlyCost)} de custo mensal a cobrir.
                </span>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="flex flex-col gap-[22px]">
              <div className="flex flex-col gap-2.5">
                <span className="label-uppercase text-[var(--color-brand-green)]">{STEP_LABELS[2]}</span>
                <h1 className="text-display-lg text-[var(--color-text)]">Este é o seu piso.</h1>
              </div>

              <div
                className="flex flex-col gap-4 p-[30px] bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-lg)]"
                style={{ borderTop: '2px solid var(--color-brand-red)' }}
              >
                <span className="label-uppercase">Valor-hora real</span>
                <span className="numeric-display leading-[.9] text-[var(--color-text)]" style={{ fontSize: 'clamp(48px,10vw,80px)' }}>
                  {formatCurrency(layer1.realHourlyRate)}
                </span>
                <div className="flex flex-wrap gap-5 pt-3.5 border-t border-[var(--color-border)]">
                  <div className="flex flex-col">
                    <span className="label-uppercase">Horas faturáveis</span>
                    <span className="font-mono text-sm font-700 text-[var(--color-text)]">{layer1.billableHours.toFixed(0)}h</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="label-uppercase">Custo mensal</span>
                    <span className="font-mono text-sm font-700 text-[var(--color-text)]">{formatCurrency(layer1.totalMonthlyCost)}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="label-uppercase">Regime</span>
                    <span className="font-mono text-sm font-700 text-[var(--color-text)]">
                      {TAX_RATES[regime].label} · {(TAX_RATES[regime].rate * 100).toFixed(1)}%
                    </span>
                  </div>
                </div>
              </div>

              {layer1.realHourlyRate === 0 && (
                <div className="flex items-center gap-3 p-4 bg-[var(--color-brand-yellow)]/[.12] border border-[var(--color-brand-yellow)]/30 rounded-[var(--radius-md)]">
                  <AlertTriangle size={17} className="text-[var(--color-brand-yellow)] flex-shrink-0" />
                  <span className="text-xs leading-relaxed text-[var(--color-text)]">
                    Ainda está em R$ 0,00 — volte ao passo 02 e informe pró-labore e horas.
                  </span>
                </div>
              )}

              <div className="flex flex-wrap gap-2.5">
                <button
                  type="button"
                  onClick={() => persistAndGo('/calcular')}
                  className="flex items-center gap-2.5 h-[50px] px-[22px] bg-[var(--color-brand-red)] text-white font-display font-900 text-base tracking-wide uppercase rounded-[var(--radius-md)] hover:brightness-110 transition-[filter]"
                >
                  Calcular meu primeiro orçamento
                  <ArrowRight size={17} />
                </button>
                <button
                  type="button"
                  onClick={() => persistAndGo('/dashboard')}
                  className="h-[50px] px-5 border border-[var(--color-border)] text-[var(--color-text)] font-display font-800 text-base tracking-wide uppercase rounded-[var(--radius-md)] hover:bg-[var(--color-surface)] transition-colors"
                >
                  Ir para o dashboard
                </button>
              </div>
            </div>
          )}

          <div className="flex flex-wrap gap-2.5 pt-5 border-t border-[var(--color-border)]">
            {step > 0 && (
              <button
                type="button"
                onClick={() => setStep((s) => s - 1)}
                className="flex items-center gap-2 h-12 px-[18px] border border-[var(--color-border)] text-[var(--color-text)] text-xs font-700 tracking-wide uppercase rounded-[var(--radius-md)] hover:bg-[var(--color-surface)] transition-colors"
              >
                <ArrowLeft size={15} />
                Voltar
              </button>
            )}
            {step < 2 && !canAdvance && (
              <div className="flex items-center gap-3 ml-auto flex-wrap justify-end">
                <span className="text-2xs tracking-wide uppercase text-[var(--color-brand-yellow)]">{hint}</span>
                <span className="flex items-center gap-2 h-12 px-[22px] bg-[var(--color-brand-red)] text-white text-xs font-800 tracking-wide uppercase rounded-[var(--radius-md)] opacity-40 pointer-events-none">
                  Continuar
                </span>
              </div>
            )}
            {step < 2 && canAdvance && (
              <button
                type="button"
                onClick={() => setStep((s) => s + 1)}
                className="flex items-center gap-2 h-12 px-[22px] ml-auto bg-[var(--color-brand-red)] text-white text-xs font-800 tracking-wide uppercase rounded-[var(--radius-md)] hover:brightness-110 transition-[filter]"
              >
                Continuar
                <ArrowRight size={15} />
              </button>
            )}
          </div>

        </div>
      </div>
    </div>
  )
}
