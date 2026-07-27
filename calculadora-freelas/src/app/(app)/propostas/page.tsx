'use client'

import { useEffect, useState } from 'react'
import { PageHeader, PageContent } from '@/components/layout/shell'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { formatCurrency } from '@/lib/utils'
import { loadLastProposal, type SavedProposal } from '@/lib/storage'
import Link from 'next/link'
import { Calculator, FileText, ArrowRight, Printer, Calendar } from 'lucide-react'

export default function PropostasPage() {
  const [proposals, setProposals] = useState<SavedProposal[]>([])

  useEffect(() => {
    const last = loadLastProposal()
    if (last) setProposals([last])
  }, [])

  return (
    <>
      <PageHeader
        label="Documentos"
        title="Minhas Propostas"
        description="Propostas comerciais geradas a partir dos seus orçamentos."
        actions={
          <Button asChild size="md">
            <Link href="/calcular" className="flex items-center gap-2">
              <Calculator size={15} />
              Novo orçamento
            </Link>
          </Button>
        }
      />

      <PageContent>
        {proposals.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 px-6 rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-surface)] text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-[var(--radius-md)] bg-[var(--color-brand-red)]/10 text-[var(--color-brand-red)] mb-4">
              <FileText size={24} />
            </div>
            <h3 className="font-display font-800 text-lg uppercase tracking-tight text-[var(--color-text)] mb-2">
              Nenhuma proposta ainda
            </h3>
            <p className="text-sm text-[var(--color-text-secondary)] max-w-md leading-relaxed mb-6">
              Gere seu primeiro orçamento completo para transformar a metodologia em uma proposta comercial pronta para aprovação ou exportação.
            </p>
            <Button asChild size="md" variant="secondary">
              <Link href="/calcular" className="flex items-center gap-2">
                Calcular orçamento
                <ArrowRight size={14} />
              </Link>
            </Button>
          </div>
        ) : (
          <div className="flex flex-col gap-4 max-w-3xl">
            <div className="rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-surface)] p-5 sm:p-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div className="flex flex-col gap-1">
                <span className="label-uppercase text-[var(--color-brand-red)]">Documentos comerciais</span>
                <h3 className="font-display font-800 text-lg uppercase tracking-tight text-[var(--color-text)]">
                  Propostas prontas para envio
                </h3>
              </div>
              <Badge variant="warning">Baseada na metodologia 3 camadas</Badge>
            </div>
            {proposals.map(p => (
              <Card key={p.id} accent="red" className="hover:border-[var(--color-text-muted)] transition-colors">
                <CardContent className="p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                      <span className="font-700 text-base text-[var(--color-text)]">{p.projectName}</span>
                      <Badge variant="default" className="text-[0.65rem]">
                        {p.form.pricingMethod.replace('_', ' ')}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-[var(--color-text-muted)]">
                      <span className="flex items-center gap-1">
                        <Calendar size={13} />
                        {p.date}
                      </span>
                      <span>·</span>
                      <span>{p.form.estimatedHours}h estimadas</span>
                      {p.benchmark && (
                        <>
                          <span>·</span>
                          <span className="text-[var(--color-brand-red)] font-600">Ref. ADG Brasil</span>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-4 self-end sm:self-center">
                    <div className="flex flex-col text-right">
                      <span className="text-[0.65rem] text-[var(--color-text-muted)] uppercase">Recomendado</span>
                      <span className="numeric-display font-900 text-xl text-[var(--color-text)]">
                        {formatCurrency(p.result.quote.recommended)}
                      </span>
                    </div>
                    <Button asChild size="md" className="flex items-center gap-2">
                      <Link href="/propostas/preview">
                        <Printer size={15} />
                        Ver / PDF
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </PageContent>
    </>
  )
}
