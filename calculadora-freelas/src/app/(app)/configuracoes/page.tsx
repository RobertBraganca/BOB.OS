import type { Metadata } from 'next'
import { PageHeader, PageContent } from '@/components/layout/shell'
import { Card, CardContent } from '@/components/ui/card'
import { Settings } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Configurações',
}

export default function ConfiguracoesPage() {
  return (
    <>
      <PageHeader
        label="Conta"
        title="Configurações"
        description="Preferências da sua conta e do sistema."
      />
      <PageContent>
        <div className="flex flex-col items-center justify-center py-24 border border-dashed border-[var(--color-border)] rounded-[var(--radius-lg)]">
          <Settings size={28} className="text-[var(--color-text-muted)] mb-4" />
          <span className="text-xs text-[var(--color-text-muted)]">Em breve</span>
        </div>
      </PageContent>
    </>
  )
}
