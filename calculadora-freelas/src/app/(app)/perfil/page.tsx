'use client'

import { useEffect, useState } from 'react'
import { PageContent, PageHeader } from '@/shared/components/layout/shell'
import { SERVICE_AREA_LABELS, type ServiceArea } from '@/shared/schemas'
import { loadProfile, saveProfile } from '@/shared/lib/storage'
import { TAX_RATES, type TaxRegime } from '@/modules/pricing/lib'
import { Button } from '@/shared/components/ui/button'
import { CheckCircle2 } from 'lucide-react'

const AREAS = Object.entries(SERVICE_AREA_LABELS) as [ServiceArea, string][]
const REGIMES = Object.entries(TAX_RATES) as [TaxRegime, (typeof TAX_RATES)[TaxRegime]][]

export default function PerfilPage() {
  const [name, setName] = useState('')
  const [area, setArea] = useState<ServiceArea>('graphic_design')
  const [regime, setRegime] = useState<TaxRegime>('mei')
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    const profile = loadProfile()
    if (profile) {
      setArea(profile.serviceArea as ServiceArea)
      setRegime(profile.taxRegime)
      setName(profile.name || '')
    }
  }, [])

  const handleSave = () => {
    saveProfile({ serviceArea: area, taxRegime: regime, name })
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <PageContent>
      <div className="flex flex-col gap-[22px] max-w-[820px]">
        <PageHeader
          label="Perfil profissional"
          title="Meu perfil"
          description="Área de atuação e regime tributário alimentam o gross-up do motor. Sem isso o imposto sai do seu lucro."
        />

        <section className="flex flex-col gap-4 p-5 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-card)]">
          <span className="label-uppercase">Identificação</span>
          <div className="grid gap-3.5" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
            <label className="flex flex-col gap-1.5">
              <span className="label-uppercase">Nome</span>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Como você assina seus trabalhos"
                className="h-[var(--control-h)] px-3 bg-[var(--color-bg)] border border-[var(--color-border-strong)] text-sm text-[var(--color-text)] rounded-[var(--radius-md)] outline-none focus:border-[var(--color-brand-red)]"
              />
            </label>
          </div>
        </section>

        <section className="flex flex-col gap-4 p-5 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-card)]">
          <div className="flex flex-col gap-1">
            <span className="label-uppercase text-[var(--color-brand-yellow)]">Área de atuação</span>
            <h3 className="h2 text-[var(--color-text)]">O que você entrega</h3>
          </div>
          <div className="grid gap-2" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))' }}>
            {AREAS.map(([key, label]) => {
              const selected = area === key
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => setArea(key)}
                  className={`flex items-center justify-center gap-2 min-h-[var(--control-h)] px-4 text-xs font-600 rounded-full transition-colors ${
                    selected
                      ? 'border border-[var(--color-brand-red)] bg-[var(--color-brand-red)]/10 text-[var(--color-text)]'
                      : 'border border-[var(--color-border-strong)] bg-[var(--color-bg)] text-[var(--color-text-secondary)] hover:border-[var(--color-text-muted)] hover:text-[var(--color-text)]'
                  }`}
                >
                  {selected && <CheckCircle2 size={14} />}
                  {label}
                </button>
              )
            })}
          </div>
        </section>

        <section className="flex flex-col gap-4 p-5 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-card)]">
          <div className="flex flex-col gap-1">
            <span className="label-uppercase text-[var(--color-brand-green)]">Regime tributário</span>
            <h3 className="h2 text-[var(--color-text)]">Quem paga o imposto é o preço</h3>
          </div>
          <div className="flex flex-col gap-2">
            {REGIMES.map(([key, r]) => {
              const selected = regime === key
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => setRegime(key)}
                  className={`flex items-center gap-3 min-h-[60px] px-3.5 py-3 rounded-[var(--radius-md)] text-left transition-colors ${
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
                    <span className="text-sm font-600 text-[var(--color-text)]">{r.label}</span>
                    <span className="text-2xs text-[var(--color-text-secondary)]">{r.description}</span>
                  </span>
                  <span className="numeric-display text-[17px]" style={{ color: selected ? 'var(--color-brand-red)' : 'var(--color-text-muted)' }}>
                    {(r.rate * 100).toFixed(1)}%
                  </span>
                </button>
              )
            })}
          </div>
          <span className="text-2xs leading-relaxed text-[var(--color-text-muted)]">
            Alíquotas de referência para gross-up. Variam por faixa de faturamento e atividade, confirme com seu contador.
          </span>
          <Button type="button" variant="primary" onClick={handleSave} className="self-start">
            <CheckCircle2 size={15} />
            {saved ? 'Perfil salvo' : 'Salvar perfil'}
          </Button>
        </section>
      </div>
    </PageContent>
  )
}
