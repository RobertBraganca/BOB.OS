'use client'

import { useEffect, useState } from 'react'
import { PageHeader, PageContent } from '@/components/layout/shell'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { formatCurrency } from '@/lib/utils'
import { loadLastProposal, type SavedProposal } from '@/lib/storage'
import { Printer, ArrowLeft, CheckCircle2, ShieldCheck, Clock, FileText } from 'lucide-react'
import Link from 'next/link'

export default function PropostaPreviewPage() {
  const [data, setData] = useState<SavedProposal | null>(null)

  useEffect(() => {
    const last = loadLastProposal()
    if (!last) return
    setData(last)
    document.title = last.projectName ? `Proposta Comercial - ${last.projectName}` : 'Proposta Comercial'
  }, [])

  if (!data) {
    return (
      <PageContent>
        <div className="flex flex-col items-center justify-center py-24 gap-4">
          <span className="text-sm text-[var(--color-text-muted)]">Nenhuma proposta recente encontrada.</span>
          <Button asChild variant="secondary" size="md">
            <Link href="/calcular">Voltar para calculadora</Link>
          </Button>
        </div>
      </PageContent>
    )
  }

  const { form, result, benchmark, projectName, date } = data

  return (
    <>
      {/* Botões de ação topo (ocultos na impressão via CSS print:hidden) */}
      <div className="print:hidden">
        <PageHeader
          label="Documento comercial"
          title={`Proposta: ${projectName}`}
          description="Documento gerado com metodologia em 3 camadas pronto para exportação em PDF ou apresentação."
          actions={
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="md" asChild>
                <Link href="/calcular" className="flex items-center gap-1.5">
                  <ArrowLeft size={14} />
                  Ajustar cálculo
                </Link>
              </Button>
              <Button size="md" onClick={() => window.print()} className="flex items-center gap-2">
                <Printer size={15} />
                Imprimir / Exportar PDF
              </Button>
            </div>
          }
        />
      </div>

      <PageContent className="max-w-3xl mx-auto print:max-w-none print:p-0">
        <div className="mb-6 rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-surface)] p-5 sm:p-6 flex flex-col gap-2">
          <span className="label-uppercase text-[var(--color-brand-red)]">Documento comercial</span>
          <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">
            Este layout foi pensado para transmitir confiança, clareza e respaldo técnico na negociação — sem perder a autoridade visual da marca.
          </p>
        </div>

        {/* Documento Editorial Proposta — Alto Contraste */}
        <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-lg)] p-8 sm:p-12 flex flex-col gap-8 print:border-none print:rounded-none print:bg-white print:text-black">
          
          {/* Cabeçalho da Proposta */}
          <div className="flex items-start justify-between border-b border-[var(--color-border)] pb-6 print:border-[#E4E4E7]">
            <div className="flex flex-col gap-1">
              <span className="font-display font-900 text-2xl tracking-tight text-[var(--color-brand-red)] print:text-[var(--color-brand-red)]">
                PROPOSTA COMERCIAL
              </span>
              <h1 className="text-xl sm:text-2xl font-700 text-[var(--color-text)] print:text-black mt-1">
                {projectName}
              </h1>
              <span className="text-xs text-[var(--color-text-muted)] print:text-[#52525B] mt-0.5">
                Emitido em {date} · Validade: 15 dias corridos
              </span>
            </div>
            <Badge variant="default" className="print:border-[#E4E4E7] print:text-[#09090B]">
              Metodologia Certificada
            </Badge>
          </div>

          {/* Resumo e Escopo */}
          <div className="flex flex-col gap-3">
            <h3 className="label-uppercase text-xs tracking-wider text-[var(--color-text-muted)] print:text-[#71717A]">
              1. Escopo e Dedicação
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-[var(--radius-md)] bg-[var(--color-surface-raised)] print:bg-[#F4F4F5] print:border print:border-[#E4E4E7]">
              <div className="flex flex-col">
                <span className="text-[0.65rem] text-[var(--color-text-muted)] print:text-[#71717A]">Modelo</span>
                <span className="text-sm font-600 capitalize text-[var(--color-text)] print:text-black">{form.pricingMethod.replace('_', ' ')}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[0.65rem] text-[var(--color-text-muted)] print:text-[#71717A]">Tempo Estimado</span>
                <span className="text-sm font-600 text-[var(--color-text)] print:text-black">{form.estimatedHours} horas</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[0.65rem] text-[var(--color-text-muted)] print:text-[#71717A]">Revisões Inclusas</span>
                <span className="text-sm font-600 text-[var(--color-text)] print:text-black">{form.revisions} rodadas</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[0.65rem] text-[var(--color-text-muted)] print:text-[#71717A]">Uso e Licença</span>
                <span className="text-sm font-600 capitalize text-[var(--color-text)] print:text-black">{form.usageRights}</span>
              </div>
            </div>
          </div>

          {/* Investimento (Faixa Recomendada em Destaque) */}
          <div className="flex flex-col gap-4">
            <h3 className="label-uppercase text-xs tracking-wider text-[var(--color-text-muted)] print:text-[#71717A]">
              2. Investimento Comercial
            </h3>
            
            <div className="border border-[var(--color-brand-red)] bg-[var(--color-brand-red)]/5 rounded-[var(--radius-lg)] p-6 flex flex-col sm:flex-row items-center justify-between gap-6 print:bg-[#FAFAFA] print:border-2 print:border-[var(--color-brand-red)]">
              <div className="flex flex-col gap-1 text-center sm:text-left">
                <span className="label-uppercase text-[var(--color-brand-red)] print:text-[var(--color-brand-red)] font-700">
                  Opção Recomendada (Escopo Completo)
                </span>
                <p className="text-xs text-[var(--color-text-secondary)] print:text-[#52525B] max-w-md leading-relaxed">
                  Contempla 100% das horas estimadas, rodadas de revisão de escopo, custos operacionais indiretos e impostos aplicáveis emitidos em nota fiscal.
                </p>
              </div>
              <div className="flex flex-col items-center sm:items-end flex-shrink-0">
                <span className="numeric-display font-900 text-4xl leading-none text-[var(--color-brand-red)] print:text-[var(--color-brand-red)]">
                  {formatCurrency(result.quote.recommended)}
                </span>
                <span className="text-[0.65rem] text-[var(--color-text-muted)] print:text-[#71717A] mt-1">
                  ou 2× de {formatCurrency(result.quote.recommended / 2)} (50% início / 50% entrega)
                </span>
              </div>
            </div>

            {/* Alternativas de Investimento */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div className="p-4 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] print:border-[#E4E4E7] flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="text-xs font-600 text-[var(--color-text)] print:text-black">Opção Enxuta (Piso)</span>
                  <span className="text-[0.65rem] text-[var(--color-text-muted)] print:text-[#71717A]">Entregáveis essenciais, sem extras</span>
                </div>
                <span className="numeric-display font-800 text-lg text-[var(--color-text-secondary)] print:text-[#09090B]">
                  {formatCurrency(result.quote.minimum)}
                </span>
              </div>
              <div className="p-4 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] print:border-[#E4E4E7] flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="text-xs font-600 text-[var(--color-text)] print:text-black">Opção Premium / Prioritária</span>
                  <span className="text-[0.65rem] text-[var(--color-text-muted)] print:text-[#71717A]">Atendimento expresso + consultoria</span>
                </div>
                <span className="numeric-display font-800 text-lg text-[var(--color-text-secondary)] print:text-[#09090B]">
                  {formatCurrency(result.quote.premium)}
                </span>
              </div>
            </div>
          </div>

          {/* Comparativo Adegraf (se disponível) */}
          {benchmark && (
            <div className="flex flex-col gap-2 p-4 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface-raised)] print:border-[#E4E4E7] print:bg-[#FAFAFA]">
              <div className="flex items-center justify-between">
                <span className="text-xs font-700 text-[var(--color-text)] print:text-black">
                  Referência de Mercado (ADG Brasil / Adegraf)
                </span>
                <Badge variant="default" className="print:border-[#E4E4E7] print:text-[#09090B]">
                  {benchmark.status === 'below' ? 'Abaixo da média' : benchmark.status === 'premium' ? 'Faixa Superior' : 'Média de Mercado'}
                </Badge>
              </div>
              <p className="text-xs text-[var(--color-text-secondary)] print:text-[#52525B] leading-relaxed">
                Para entregas da categoria <strong>{benchmark.service.categoryLabel}</strong> ({benchmark.service.name}), a referência de mercado estipula valores entre <strong>{formatCurrency(benchmark.service.minRate)}</strong> e <strong>{formatCurrency(benchmark.service.maxRate)}</strong>. Esta proposta encontra-se calibrada com as melhores práticas comerciais do setor.
              </p>
            </div>
          )}

          {/* Garantias e Termos */}
          <div className="flex flex-col gap-3 pt-2">
            <h3 className="label-uppercase text-xs tracking-wider text-[var(--color-text-muted)] print:text-[#71717A]">
              3. Garantias e Condições de Fornecimento
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-[var(--color-text-secondary)] print:text-[#52525B]">
              <div className="flex items-start gap-2">
                <CheckCircle2 size={15} className="text-[var(--color-brand-red)] print:text-[var(--color-brand-red)] flex-shrink-0 mt-0.5" />
                <span><strong>Preço Justo Garantido:</strong> Calculado sobre estrutura real e custos aferidos, sem achismos.</span>
              </div>
              <div className="flex items-start gap-2">
                <ShieldCheck size={15} className="text-[var(--color-brand-red)] print:text-[var(--color-brand-red)] flex-shrink-0 mt-0.5" />
                <span><strong>Nota Fiscal:</strong> Valores já incluem gross-up tributário integral para emissão regular de NF.</span>
              </div>
              <div className="flex items-start gap-2">
                <Clock size={15} className="text-[var(--color-brand-red)] print:text-[var(--color-brand-red)] flex-shrink-0 mt-0.5" />
                <span><strong>Cronograma:</strong> Início imediato mediante aprovação formal e pagamento do adiantamento (50%).</span>
              </div>
              <div className="flex items-start gap-2">
                <FileText size={15} className="text-[var(--color-brand-red)] print:text-[var(--color-brand-red)] flex-shrink-0 mt-0.5" />
                <span><strong>Validade:</strong> Proposta sujeita a agendamento de pauta no período de 15 dias.</span>
              </div>
            </div>
          </div>

          {/* Assinatura */}
          <div className="border-t border-[var(--color-border)] print:border-[#E4E4E7] pt-8 mt-4 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex flex-col text-center sm:text-left">
              <span className="font-700 text-sm text-[var(--color-text)] print:text-black">Aceite do Cliente</span>
              <span className="text-xs text-[var(--color-text-muted)] print:text-[#71717A]">Assinatura ou confirmação por e-mail/WhatsApp</span>
            </div>
            <div className="w-64 border-b border-dashed border-[var(--color-text-muted)] print:border-[#E4E4E7] pb-2 text-center">
              <span className="text-[0.65rem] text-[var(--color-text-muted)] print:text-[#71717A]">Data e Assinatura</span>
            </div>
          </div>

        </div>
      </PageContent>
    </>
  )
}
