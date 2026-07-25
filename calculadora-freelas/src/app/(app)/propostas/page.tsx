import type { Metadata } from 'next'
import { PageHeader, PageContent } from '@/components/layout/shell'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { Calculator, FileText, ArrowRight } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Propostas',
}

export default function PropostasPage() {
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
      </PageContent>
    </>
  )
}
