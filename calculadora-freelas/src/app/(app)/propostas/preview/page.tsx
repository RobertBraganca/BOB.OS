'use client'

import { Suspense, useEffect, useState } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { formatCurrency } from '@/shared/lib/utils'
import { loadLastProposal, getProposalById, loadProfile, type SavedProposal } from '@/shared/lib/storage'
import { SERVICE_AREA_LABELS } from '@/shared/schemas'
import { ArrowLeft, Download } from 'lucide-react'

const METHOD_LABELS: Record<string, string> = {
  hourly: 'hora',
  daily: 'diária',
  fixed_scope: 'escopo fechado',
  value_based: 'valor',
  package: 'pacote',
  retainer: 'retainer mensal',
}

function addDays(iso: string, days: number): string {
  const d = new Date(iso)
  d.setDate(d.getDate() + days)
  return d.toLocaleDateString('pt-BR')
}

function PropostaPreview() {
  const searchParams = useSearchParams()
  const id = searchParams.get('id')
  const [data, setData] = useState<SavedProposal | null>(null)
  const [profile, setProfile] = useState<ReturnType<typeof loadProfile>>(null)

  useEffect(() => {
    const found = id ? getProposalById(id) : loadLastProposal()
    setData(found)
    setProfile(loadProfile())
    if (found) document.title = `Proposta Comercial - ${found.projectName}`
  }, [id])

  if (!data) {
    return (
      <div className="min-h-screen bg-[var(--color-bg)]">
        <div className="sticky top-0 z-40 flex flex-wrap items-center gap-2.5 px-5 py-3 bg-[var(--color-bg)] border-b border-[var(--color-border)]">
          <Link
            href="/propostas"
            className="flex items-center gap-2 h-10 px-3.5 border border-[var(--color-border)] text-[var(--color-text)] text-xs font-700 tracking-wide uppercase rounded-[var(--radius-md)] hover:bg-[var(--color-surface)] transition-colors"
          >
            <ArrowLeft size={15} />
            Propostas
          </Link>
        </div>
        <div className="flex flex-col items-start gap-3.5 p-12 max-w-[620px]">
          <h2 className="text-display-sm text-[var(--color-text)]">Nenhuma proposta para exibir</h2>
          <p className="text-sm leading-relaxed text-[var(--color-text-secondary)]">
            Calcule um orçamento e salve a proposta para gerar o documento comercial.
          </p>
          <Link
            href="/calcular"
            className="h-11 flex items-center px-[18px] bg-[var(--color-brand-red)] text-white text-xs font-800 tracking-wide uppercase rounded-[var(--radius-md)]"
          >
            Ir para a calculadora
          </Link>
        </div>
      </div>
    )
  }

  const { form, result, benchmark, projectName, clientName, authorName, createdAt } = data
  const laborCost = data.laborCost ?? 0
  const revisionCost = data.revisionCost ?? 0
  const totalDirectCosts = data.totalDirectCosts ?? 0
  const areaLabel = profile ? SERVICE_AREA_LABELS[profile.serviceArea as keyof typeof SERVICE_AREA_LABELS] : ''
  const methodLabel = METHOD_LABELS[form.pricingMethod] ?? form.pricingMethod

  return (
    <div className="min-h-screen bg-[var(--color-bg)]">
      <div className="sticky top-0 z-40 flex flex-wrap items-center gap-2.5 px-5 py-3 bg-[var(--color-bg)] border-b border-[var(--color-border)] print:hidden">
        <Link
          href="/propostas"
          className="flex items-center gap-2 h-10 px-3.5 border border-[var(--color-border)] text-[var(--color-text)] text-xs font-700 tracking-wide uppercase rounded-[var(--radius-md)] hover:bg-[var(--color-surface)] transition-colors"
        >
          <ArrowLeft size={15} />
          Propostas
        </Link>
        <span className="label-uppercase ml-1">Proposta comercial · pronta para PDF</span>
        <button
          type="button"
          onClick={() => window.print()}
          className="flex items-center gap-2 h-10 px-4 ml-auto bg-[var(--color-brand-red)] text-white text-xs font-800 tracking-wide uppercase rounded-[var(--radius-md)] hover:brightness-110 transition-[filter]"
        >
          <Download size={15} />
          Exportar PDF
        </button>
      </div>

      {/* Documento A4 — cores fixas em hex (nunca tokens de tema): é impresso em papel branco sempre. */}
      <div className="flex justify-center py-8 print:py-0 print:block">
        <div
          className="flex flex-col p-12 print:p-[52px]"
          style={{ background: '#FFFFFF', color: '#09090B', width: '210mm', minHeight: '297mm', fontFamily: 'var(--font-body)' }}
        >
          <header className="flex items-start justify-between gap-6 pb-[18px]" style={{ borderBottom: '2px solid #FF0000' }}>
            <span style={{ fontSize: 9, fontWeight: 600, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#71717A' }}>
              Proposta comercial<br />Orçamento para prestação<br />de serviços
            </span>
            <div className="flex flex-col gap-0.5 text-right">
              <span style={{ fontSize: 9, fontWeight: 600, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#71717A' }}>Emitida em</span>
              <span className="font-mono" style={{ fontSize: 12, fontWeight: 700, color: '#09090B' }}>{data.date}</span>
              <span style={{ fontSize: 9, color: '#71717A' }}>Válida até {addDays(createdAt, 15)}</span>
            </div>
          </header>

          <div className="flex flex-col gap-1.5" style={{ padding: '22px 0 18px' }}>
            <span style={{ fontSize: 9, fontWeight: 600, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#FF0000' }}>
              {clientName || 'Cliente'}
            </span>
            <h1 style={{ margin: 0, fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 38, lineHeight: 1.05, letterSpacing: '-0.03em', textTransform: 'uppercase', color: '#09090B' }}>
              {projectName}
            </h1>
            <span style={{ fontSize: 11, color: '#52525B' }}>
              {[authorName || 'Profissional', areaLabel, `cobrança por ${methodLabel}`].filter(Boolean).join(' · ')}
            </span>
          </div>

          <div className="grid gap-3" style={{ gridTemplateColumns: '1fr 1fr 1fr', padding: '18px 0', borderTop: '1px solid #E4E4E7', borderBottom: '1px solid #E4E4E7' }}>
            <div className="flex flex-col gap-1">
              <span style={{ fontSize: 9, fontWeight: 600, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#71717A' }}>Investimento mínimo</span>
              <span className="numeric-display" style={{ fontSize: 22, color: '#52525B' }}>{formatCurrency(result.quote.minimum)}</span>
            </div>
            <div className="flex flex-col gap-1" style={{ padding: '0 12px', borderLeft: '3px solid #FF0000' }}>
              <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#FF0000' }}>Investimento recomendado</span>
              <span className="numeric-display" style={{ fontSize: 34, color: '#09090B', lineHeight: 1 }}>{formatCurrency(result.quote.recommended)}</span>
            </div>
            <div className="flex flex-col gap-1">
              <span style={{ fontSize: 9, fontWeight: 600, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#71717A' }}>Escopo ampliado</span>
              <span className="numeric-display" style={{ fontSize: 22, color: '#52525B' }}>{formatCurrency(result.quote.premium)}</span>
            </div>
          </div>

          <div className="grid gap-8" style={{ gridTemplateColumns: '1.15fr 1fr', paddingTop: 22, flex: 1 }}>
            <div className="flex flex-col gap-2.5">
              <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#09090B' }}>Composição do investimento</span>
              <div className="flex justify-between gap-3 pb-1.5" style={{ borderBottom: '1px solid #F4F4F5' }}>
                <span style={{ fontSize: 11, color: '#52525B' }}>Execução · {form.estimatedHours}h × {formatCurrency(result.hourlyRate)}</span>
                <span className="font-mono" style={{ fontSize: 11, fontWeight: 700 }}>{formatCurrency(laborCost)}</span>
              </div>
              <div className="flex justify-between gap-3 pb-1.5" style={{ borderBottom: '1px solid #F4F4F5' }}>
                <span style={{ fontSize: 11, color: '#52525B' }}>Revisões inclusas · {form.revisions} rodadas</span>
                <span className="font-mono" style={{ fontSize: 11, fontWeight: 700 }}>{formatCurrency(revisionCost)}</span>
              </div>
              <div className="flex justify-between gap-3 pb-1.5" style={{ borderBottom: '1px solid #F4F4F5' }}>
                <span style={{ fontSize: 11, color: '#52525B' }}>Custos diretos e terceiros</span>
                <span className="font-mono" style={{ fontSize: 11, fontWeight: 700 }}>{formatCurrency(totalDirectCosts)}</span>
              </div>
              <div className="flex justify-between gap-3 pb-1.5" style={{ borderBottom: '1px solid #E4E4E7' }}>
                <span style={{ fontSize: 11, fontWeight: 700, color: '#09090B' }}>Subtotal técnico</span>
                <span className="font-mono" style={{ fontSize: 11, fontWeight: 700 }}>{formatCurrency(result.basePrice)}</span>
              </div>
              <div className="flex justify-between gap-3 pb-1.5" style={{ borderBottom: '1px solid #F4F4F5' }}>
                <span style={{ fontSize: 11, color: '#52525B' }}>Ajuste de contexto ×{result.quote.multiplierDetail.combined.toFixed(2)}</span>
                <span className="font-mono" style={{ fontSize: 11, fontWeight: 700 }}>{formatCurrency(result.quote.adjustedPrice)}</span>
              </div>
              <div className="flex justify-between gap-3">
                <span style={{ fontSize: 11, color: '#52525B' }}>Tributos · {result.quote.taxDetail.regime.replace('_', ' ')} ({(result.quote.taxDetail.rate * 100).toFixed(1)}%)</span>
                <span className="font-mono" style={{ fontSize: 11, fontWeight: 700 }}>{formatCurrency(result.quote.taxDetail.taxAmount)}</span>
              </div>
              <p style={{ margin: '12px 0 0', fontSize: 10, lineHeight: 1.6, color: '#71717A' }}>
                Valores calculados sobre custo operacional real, capacidade faturável e contexto do projeto. Tributos já embutidos: o valor apresentado é o valor a pagar.
              </p>
            </div>

            <div className="flex flex-col gap-2.5">
              <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#09090B' }}>Contexto considerado</span>
              {[
                { category: 'Complexidade', ...result.quote.multiplierDetail.complexity },
                { category: 'Urgência', ...result.quote.multiplierDetail.urgency },
                { category: 'Porte do cliente', ...result.quote.multiplierDetail.clientSize },
                { category: 'Direitos de uso', ...result.quote.multiplierDetail.usageRights },
              ].map((m) => (
                <div
                  key={m.category}
                  className="flex items-center justify-between gap-2.5"
                  style={{ padding: '9px 11px', background: '#FAFAFA', border: '1px solid #E4E4E7', borderRadius: 4 }}
                >
                  <span className="flex flex-col">
                    <span style={{ fontSize: 8, fontWeight: 600, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#71717A' }}>{m.category}</span>
                    <span style={{ fontSize: 11, fontWeight: 700, color: '#09090B' }}>{m.label}</span>
                  </span>
                  <span className="numeric-display" style={{ fontSize: 13, color: '#FF0000' }}>×{m.multiplier}</span>
                </div>
              ))}
              <div className="flex flex-col gap-1" style={{ marginTop: 6, padding: 12, background: '#09090B', borderRadius: 4 }}>
                <span style={{ fontSize: 8, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#FFC700' }}>Condições</span>
                <span style={{ fontSize: 10, lineHeight: 1.6, color: '#FFFFFF' }}>
                  50% na aprovação, 50% na entrega final. Prazo e escopo conforme alinhado. Direitos de uso conforme licença acima.
                </span>
              </div>
            </div>
          </div>

          <footer className="flex items-end justify-between gap-5" style={{ paddingTop: 18, marginTop: 18, borderTop: '1px solid #E4E4E7' }}>
            <div className="flex flex-col gap-1">
              <span style={{ fontSize: 9, fontWeight: 600, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#71717A' }}>Aprovação do cliente</span>
              <span style={{ display: 'block', width: 220, borderBottom: '1px solid #09090B', height: 22 }} />
              <span style={{ fontSize: 9, color: '#71717A' }}>{clientName || 'Cliente'}</span>
            </div>
            <span style={{ fontSize: 8, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#A1A1AA' }}>
              Referência de mercado: ADG Brasil / Adegraf 2024-2026
            </span>
          </footer>
        </div>
      </div>

      {benchmark && (
        <div className="flex justify-center pb-8 print:hidden">
          <p className="text-xs text-[var(--color-text-muted)] max-w-[210mm] px-2">
            Referência: {benchmark.statusText.toLowerCase()}.
          </p>
        </div>
      )}
    </div>
  )
}

export default function PropostaPreviewPage() {
  return (
    <Suspense>
      <PropostaPreview />
    </Suspense>
  )
}
