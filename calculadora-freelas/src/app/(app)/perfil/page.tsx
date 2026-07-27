'use client'

import { useEffect, useState } from 'react'
import { PageHeader, PageContent } from '@/components/layout/shell'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { SERVICE_AREA_LABELS } from '@/schemas'
import { loadProfile, saveProfile } from '@/lib/storage'
import type { TaxRegime } from '@/lib/pricing'
import Link from 'next/link'
import { ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react'

export default function PerfilPage() {
  const [selectedArea, setSelectedArea] = useState<string>('graphic_design')
  const [selectedRegime, setSelectedRegime] = useState<TaxRegime>('mei')
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    const profile = loadProfile()
    if (!profile) return
    setSelectedArea(profile.serviceArea)
    setSelectedRegime(profile.taxRegime)
  }, [])

  const handleSave = () => {
    saveProfile({ serviceArea: selectedArea, taxRegime: selectedRegime })
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <>
      <PageHeader
        label="Conta"
        title="Meu Perfil"
        description="Suas informações profissionais. São usadas para personalizar o motor de cálculo."
      />

      <PageContent className="max-w-2xl">
        <div className="flex flex-col gap-6">
          <div className="rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-surface)] p-5 sm:p-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-[var(--radius-md)] bg-[var(--color-brand-red)]/10 text-[var(--color-brand-red)]">
                <Sparkles size={18} />
              </div>
              <div className="flex flex-col gap-1">
                <span className="label-uppercase text-[var(--color-brand-red)]">Perfil profissional</span>
                <h2 className="font-display font-800 text-lg uppercase tracking-tight text-[var(--color-text)]">
                  Seu posicionamento orienta o cálculo
                </h2>
                <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">
                  Defina sua área, regime tributário e contexto de atuação para que o motor de precificação reflita seu real mercado.
                </p>
              </div>
            </div>
            <Badge variant="warning">Configuração central</Badge>
          </div>

          <Card accent="red">
            <CardContent className="p-6 flex flex-col gap-5">
              <div className="flex flex-col gap-2">
                <span className="label-uppercase">Informações básicas</span>
                <Input label="Nome" placeholder="Seu nome" id="profile-name" defaultValue="" />
                <Input label="E-mail" type="email" placeholder="seu@email.com" id="profile-email" disabled />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Área de atuação</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-3 p-5">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {(Object.entries(SERVICE_AREA_LABELS) as [string, string][]).map(([key, label]) => {
                  const isSelected = selectedArea === key
                  return (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setSelectedArea(key)}
                      className={`flex items-center justify-center gap-2 h-10 px-3 rounded-[var(--radius-md)] border text-xs font-600 transition-colors ${
                        isSelected
                          ? 'border-[var(--color-brand-red)] bg-[var(--color-brand-red)]/10 text-[var(--color-text)]'
                          : 'border-[var(--color-border)] text-[var(--color-text-secondary)] hover:border-[var(--color-brand-red)] hover:text-[var(--color-text)]'
                      }`}
                    >
                      {isSelected && <CheckCircle2 size={12} className="text-[var(--color-brand-red)]" />}
                      {label}
                    </button>
                  )
                })}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Regime tributário</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-2 p-5">
              {([
                { value: 'pf', label: 'Pessoa Física (IRPF)', desc: 'Sem CNPJ' },
                { value: 'mei', label: 'MEI', desc: 'Microempreendedor Individual' },
                { value: 'simples', label: 'Simples Nacional', desc: 'PJ · Anexo III' },
                { value: 'lucro_presumido', label: 'Lucro Presumido', desc: 'PJ' },
              ] as const).map(regime => {
                const isSelected = selectedRegime === regime.value
                return (
                  <button
                    key={regime.value}
                    type="button"
                    onClick={() => setSelectedRegime(regime.value)}
                    className={`flex items-center justify-between h-12 px-4 rounded-[var(--radius-md)] border transition-colors text-left ${
                      isSelected
                        ? 'border-[var(--color-brand-red)] bg-[var(--color-brand-red)]/10'
                        : 'border-[var(--color-border)] hover:border-[var(--color-brand-red)]'
                    }`}
                  >
                    <div className="flex flex-col">
                      <span className="text-sm font-600 text-[var(--color-text)]">{regime.label}</span>
                      <span className="text-xs text-[var(--color-text-muted)]">{regime.desc}</span>
                    </div>
                    {isSelected && <CheckCircle2 size={14} className="text-[var(--color-brand-red)]" />}
                  </button>
                )
              })}
              <p className="text-xs text-[var(--color-text-muted)] mt-1">
                O regime tributário é usado para calcular o gross-up de impostos no preço final.
              </p>
            </CardContent>
          </Card>

          <div className="flex items-center gap-3">
            <Button size="md" onClick={handleSave}>{saved ? 'Perfil salvo' : 'Salvar perfil'}</Button>
            <Button variant="secondary" size="md" asChild>
              <Link href="/custos" className="flex items-center gap-2">
                Configurar custos
                <ArrowRight size={14} />
              </Link>
            </Button>
          </div>

        </div>
      </PageContent>
    </>
  )
}
