import type { Metadata } from 'next'
import { PageHeader, PageContent } from '@/components/layout/shell'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { SERVICE_AREA_LABELS, EXPERIENCE_LABELS } from '@/schemas'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Perfil',
}

export default function PerfilPage() {
  return (
    <>
      <PageHeader
        label="Conta"
        title="Meu Perfil"
        description="Suas informações profissionais. São usadas para personalizar o motor de cálculo."
      />

      <PageContent className="max-w-2xl">
        <div className="flex flex-col gap-6">

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
                {(Object.entries(SERVICE_AREA_LABELS) as [string, string][]).map(([key, label]) => (
                  <button
                    key={key}
                    type="button"
                    className="flex items-center justify-center h-10 px-3 rounded-[var(--radius-md)] border border-[var(--color-border)] text-xs font-600 text-[var(--color-text-secondary)] hover:border-[var(--color-brand-red)] hover:text-[var(--color-text)] transition-colors"
                  >
                    {label}
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Regime tributário</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-2 p-5">
              {[
                { value: 'pf', label: 'Pessoa Física (IRPF)', desc: 'Sem CNPJ' },
                { value: 'mei', label: 'MEI', desc: 'Microempreendedor Individual' },
                { value: 'simples', label: 'Simples Nacional', desc: 'PJ — Anexo III' },
                { value: 'lucro_presumido', label: 'Lucro Presumido', desc: 'PJ' },
              ].map(regime => (
                <button
                  key={regime.value}
                  type="button"
                  className="flex items-center justify-between h-12 px-4 rounded-[var(--radius-md)] border border-[var(--color-border)] hover:border-[var(--color-brand-red)] transition-colors text-left"
                >
                  <div className="flex flex-col">
                    <span className="text-sm font-600 text-[var(--color-text)]">{regime.label}</span>
                    <span className="text-xs text-[var(--color-text-muted)]">{regime.desc}</span>
                  </div>
                </button>
              ))}
              <p className="text-xs text-[var(--color-text-muted)] mt-1">
                O regime tributário é usado para calcular o gross-up de impostos no preço final.
              </p>
            </CardContent>
          </Card>

          <div className="flex gap-3">
            <Button size="md">Salvar perfil</Button>
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
