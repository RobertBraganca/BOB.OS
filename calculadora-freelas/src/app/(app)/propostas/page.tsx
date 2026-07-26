'use client'

import { useEffect, useState } from 'react'
import { PageHeader, PageContent } from '@/components/layout/shell'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { formatCurrency } from '@/lib/utils'
import Link from 'next/link'
import { Calculator, FileText, ArrowRight, Printer, Calendar } from 'lucide-react'

export default function PropostasPage() {
  const [proposals, setProposals] = useState<any[]>([])

  useEffect(() => {
    const saved = localStorage.getItem('bob_last_proposal')
    if (saved) {
      try {
        setProposals([JSON.parse(saved)])
      } catch (e) {
        console.error('Erro ao carregar propostas', e)
      }
    }
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
          <div className="flex flex-col items-center justify-center py-24 border border-dashed border-[var(--color-border)] rounded-[var(--radius-lg)]">
            <FileText size={28} className="text-[var(--color-text-muted)] mb-4" />
            <h3 className="font-display font-800 text-sm uppercase tracking-wide text-[var(--color-text-muted)] mb-1">
              Nenhuma proposta ainda
            </h3>
            <p className="text-xs text-[var(--color-text-muted)] text-center max-w-xs leading-relaxed mb-5">
              Gere seu primeiro orçamento completo para criar uma proposta exportável em PDF.
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
