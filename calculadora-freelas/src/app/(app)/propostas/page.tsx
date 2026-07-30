'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { PageContent } from '@/shared/components/layout/shell'
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
      <div className="flex flex-col gap-[22px]">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="flex flex-col gap-1.5">
            <span className="label-uppercase text-[var(--color-brand-red)]">Pipeline · {formatCurrency(pipelineTotal)}</span>
            <h1 className="text-display-md text-[var(--color-text)]">Minhas propostas</h1>
            <p className="text-sm leading-relaxed text-[var(--color-text-secondary)] max-w-[56ch]">
              Cada proposta guarda o cálculo completo: piso, recomendado, premium e os multiplicadores usados.
            </p>
          </div>
          <Link
            href="/calcular"
            className="flex items-center gap-2 h-11 px-[18px] bg-[var(--color-brand-red)] text-white text-xs font-800 tracking-wide uppercase rounded-[var(--radius-md)] hover:brightness-110 transition-[filter]"
          >
            <Plus size={15} />
            Nova proposta
          </Link>
        </div>

        {proposals.length === 0 ? (
          <div className="flex flex-col items-start gap-3.5 p-11 bg-[var(--color-surface)] border border-dashed border-[var(--color-border)] rounded-[var(--radius-lg)]">
            <FileText size={28} className="text-[var(--color-text-muted)]" />
            <h3 className="text-display-sm text-[var(--color-text)]">Nenhuma proposta ainda</h3>
            <p className="text-sm leading-relaxed text-[var(--color-text-secondary)] max-w-[48ch]">
              Seus orçamentos calculados aparecerão aqui. Comece pelo botão acima.
            </p>
          </div>
        ) : (
          <div className="grid gap-4" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
            {proposals.map((p) => (
              <article
                key={p.id}
                className="flex flex-col gap-3.5 p-[22px] bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-lg)]"
                style={{ borderTop: '2px solid var(--color-brand-red)' }}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex flex-col gap-0.5 min-w-0">
                    <span className="font-display font-900 text-[19px] uppercase tracking-tight text-[var(--color-text)] truncate">
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
                <div className="flex flex-wrap items-center gap-2.5 pt-3 border-t border-[var(--color-border)]">
                  <span className="text-2xs text-[var(--color-text-muted)]">
                    Valor-hora {formatCurrency(p.result.hourlyRate)} · {p.result.quote.taxDetail.regime.replace('_', ' ')}
                  </span>
                  <Link
                    href={`/propostas/preview?id=${p.id}`}
                    className="flex items-center gap-1.5 h-9 px-3 border border-[var(--color-brand-red)] bg-[var(--color-brand-red)]/10 text-[var(--color-brand-red)] text-[11px] font-800 tracking-wide uppercase rounded-[var(--radius-md)] hover:bg-[var(--color-brand-red)]/[.16] transition-colors"
                  >
                    <FileText size={14} />
                    Ver PDF
                  </Link>
                  <button
                    type="button"
                    onClick={() => handleRemove(p.id)}
                    className="ml-auto flex items-center gap-1.5 h-9 px-3 border border-[var(--color-border)] text-[var(--color-text-muted)] text-[11px] font-700 tracking-wide uppercase rounded-[var(--radius-md)] hover:text-[var(--color-brand-red)] hover:border-[var(--color-brand-red)] transition-colors"
                  >
                    Excluir
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </PageContent>
  )
}
