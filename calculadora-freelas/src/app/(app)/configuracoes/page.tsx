import type { Metadata } from 'next'
import { PageHeader, PageContent } from '@/components/layout/shell'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Settings, ShieldCheck, Sparkles, BellRing } from 'lucide-react'

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
        <div className="flex flex-col gap-6 max-w-3xl">
          <div className="rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-surface)] p-5 sm:p-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-[var(--radius-md)] bg-[var(--color-brand-yellow)]/15 text-[var(--color-brand-yellow)]">
                <Settings size={18} />
              </div>
              <div className="flex flex-col gap-1">
                <span className="label-uppercase text-[var(--color-brand-red)]">Preferências do ambiente</span>
                <h2 className="font-display font-800 text-lg uppercase tracking-tight text-[var(--color-text)]">
                  Ajustes que reforçam o fluxo de trabalho
                </h2>
                <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">
                  Centralize as opções de conta, segurança e experiência para manter o sistema alinhado ao seu modo de operar.
                </p>
              </div>
            </div>
            <Badge variant="warning">V1 · em evolução</Badge>
          </div>

          <Card accent="red">
            <CardHeader>
              <CardTitle>Preferências da conta</CardTitle>
              <CardDescription>Controle o que o sistema entende como sua base de trabalho.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              <div className="rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-[var(--radius-md)] bg-[var(--color-brand-red)]/10 text-[var(--color-brand-red)]">
                    <Sparkles size={16} />
                  </div>
                  <div>
                    <div className="text-sm font-600 text-[var(--color-text)]">Modo de precificação</div>
                    <div className="text-xs text-[var(--color-text-muted)]">Foco em cálculo técnico e defesa comercial</div>
                  </div>
                </div>
                <Badge variant="default">Ativo</Badge>
              </div>
              <Button variant="secondary" size="md" className="self-start">Editar preferências</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Privacidade e segurança</CardTitle>
              <CardDescription>O fluxo foi pensado para proteger os dados financeiros e as propostas do usuário.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              <div className="flex items-start gap-3 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] p-4">
                <ShieldCheck size={18} className="text-[var(--color-brand-green)] mt-0.5" />
                <div>
                  <div className="text-sm font-600 text-[var(--color-text)]">Proteção de dados</div>
                  <div className="text-xs text-[var(--color-text-muted)] leading-relaxed">Os dados sensíveis do orçamento ficam isolados em sessão e não são compartilhados automaticamente com terceiros.</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Notificações e acompanhamento</CardTitle>
              <CardDescription>Receba lembretes para revisar o layout, os benchmarks e os próximos passos do processo.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              <div className="flex items-start gap-3 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] p-4">
                <BellRing size={18} className="text-[var(--color-brand-yellow)] mt-0.5" />
                <div>
                  <div className="text-sm font-600 text-[var(--color-text)]">Alertas de revisão</div>
                  <div className="text-xs text-[var(--color-text-muted)] leading-relaxed">Acompanhe mudanças importantes em custos, benchmark e preço recomendado para manter a proposta atualizada.</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </PageContent>
    </>
  )
}
