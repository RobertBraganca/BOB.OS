'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { PageHeader, PageContent } from '@/shared/components/layout/shell'
import { Card, CardContent } from '@/shared/components/ui/card'
import { Button } from '@/shared/components/ui/button'
import { formatCurrency } from '@/shared/lib/utils'
import { loadProposals, deleteProposal, type SavedProposal } from '@/shared/lib/storage'
import { Plus, FileText } from 'lucide-react'

export default function PropostasPage() {
  const [proposals, setProposals] = useState<SavedProposal[]>([])

  useEffect(() => {
    setProposals(loadProposals())
  }, [])

  const handleRemove = (id: string) => {
    deleteProposal(id)
    setProposals((prev) => prev.filter((p) => p.id !== id))
  }

  const pipelineTotal = proposals.reduce((sum, p) => sum + p.result.quote.recommended, 0)

  return (
    <PageContent>
      <div className="flex flex-col gap-6">
        <PageHeader
          label={`Pipeline · ${formatCurrency(pipelineTotal)}`}
          title="Minhas propostas"
          description="Cada proposta guarda o cálculo completo: piso, recomendado, premium e os multiplicadores usados."
          actions={
            <Button asChild>
              <Link href="/calcular">
                <Plus size={15} />
                Nova proposta
              </Link>
            </Button>
          }
        />

        {proposals.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="flex flex-col items-start gap-3.5 py-11">
              <FileText size={28} className="text-[var(--color-text-muted)]" />
              <h2 className="h2 text-[var(--color-text)]">Nenhuma proposta ainda</h2>
              <p className="text-sm leading-relaxed text-[var(--color-text-secondary)] max-w-[48ch]">
                Seus orçamentos calculados aparecerão aqui. Comece pelo botão acima.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
            {proposals.map((p) => (
              <Card key={p.id} hoverable>
                <CardContent className="flex flex-col gap-3.5">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex flex-col gap-0.5 min-w-0">
                      <span className="h3 text-[var(--color-text)] truncate">
                        {p.clientName || p.projectName}
                      </span>
                      <span className="text-xs text-[var(--color-text-secondary)] truncate">{p.projectName}</span>
                    </div>
                    <span className="label-uppercase flex-shrink-0">{p.date}</span>
                  </div>
                  <div className="flex flex-col gap-0.5 p-3.5 bg-[var(--color-bg)] border border-[var(--color-border)] rounded-[var(--radius-md)]">
                    <span className="label-uppercase text-[var(--color-brand-red)]">Recomendado</span>
                    <span className="numeric-display text-[30px] text-[var(--color-text)]">{formatCurrency(p.result.quote.recommended)}</span>
                  </div>
                  <div className="grid gap-2.5" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(110px, 1fr))' }}>
                    <div className="flex flex-col">
                      <span className="label-uppercase">Piso</span>
                      <span className="font-mono text-xs font-700 text-[var(--color-text)]">{formatCurrency(p.result.quote.minimum)}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="label-uppercase">Premium</span>
                      <span className="font-mono text-xs font-700 text-[var(--color-text)]">{formatCurrency(p.result.quote.premium)}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="label-uppercase">Horas</span>
                      <span className="font-mono text-xs font-700 text-[var(--color-text)]">{p.form.estimatedHours}h</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="label-uppercase">Multiplicador</span>
                      <span className="font-mono text-xs font-700 text-[var(--color-brand-red)]">×{p.result.quote.multiplierDetail.combined.toFixed(2)}</span>
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-2.5 pt-3 border-t border-[var(--color-hairline)]">
                    <span className="text-2xs text-[var(--color-text-muted)]">
                      Valor-hora {formatCurrency(p.result.hourlyRate)} · {p.result.quote.taxDetail.regime.replace('_', ' ')}
                    </span>
                    <Button asChild variant="secondary" size="sm">
                      <Link href={`/propostas/preview?id=${p.id}`}>
                        <FileText size={14} />
                        Ver PDF
                      </Link>
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="ml-auto"
                      onClick={() => handleRemove(p.id)}
                    >
                      Excluir
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </PageContent>
  )
}
