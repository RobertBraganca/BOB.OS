'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useTheme } from 'next-themes'
import { PageContent, PageHeader } from '@/shared/components/layout/shell'
import { loadPrefs, savePrefs, exportBackupJSON, eraseAllData, DEFAULT_PREFS, type Prefs } from '@/shared/lib/storage'
import { Button } from '@/shared/components/ui/button'
import { Moon, Sun, Zap, Download, Trash2 } from 'lucide-react'

function Toggle({ on, onToggle }: { on: boolean; onToggle: () => void }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className="flex items-center w-[52px] h-7 p-[3px] rounded-full cursor-pointer transition-colors"
      style={{
        justifyContent: on ? 'flex-end' : 'flex-start',
        border: `1px solid ${on ? 'var(--color-brand-red)' : 'var(--color-border)'}`,
        background: on ? 'var(--color-brand-red)' : 'var(--color-surface-raised)',
      }}
    >
      <span className="w-5 h-5 rounded-full" style={{ background: on ? '#fff' : 'var(--color-text-muted)' }} />
    </button>
  )
}

export default function ConfiguracoesPage() {
  const router = useRouter()
  const { resolvedTheme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [prefs, setPrefs] = useState<Prefs>(DEFAULT_PREFS)
  const [toast, setToast] = useState('')

  useEffect(() => {
    setMounted(true)
    setPrefs(loadPrefs())
  }, [])

  const showToast = (msg: string) => {
    setToast(msg)
    setTimeout(() => setToast(''), 2400)
  }

  const updatePref = (patch: Partial<Prefs>) => {
    const next = { ...prefs, ...patch }
    setPrefs(next)
    savePrefs(next)
  }

  const isDark = !mounted || resolvedTheme !== 'light'

  const handleRestartOnboarding = () => {
    localStorage.removeItem('bob_onboarded')
    router.push('/onboarding')
  }

  const handleExport = () => {
    const blob = new Blob([exportBackupJSON()], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `bobos-backup-${new Date().toISOString().slice(0, 10)}.json`
    a.click()
    URL.revokeObjectURL(url)
    showToast('Backup exportado')
  }

  const handleWipe = () => {
    if (!confirm('Apagar todos os custos, perfil e propostas salvos neste navegador? Esta ação não pode ser desfeita.')) return
    eraseAllData()
    showToast('Todos os dados foram apagados')
    setPrefs(DEFAULT_PREFS)
  }

  return (
    <PageContent>
      <div className="flex flex-col gap-[22px] max-w-[820px]">
        <PageHeader
          label="Preferências"
          title="Configurações"
          description="Cada chave aqui muda o comportamento do sistema na hora, nada é decorativo."
        />

        <section className="flex flex-col gap-4 p-5 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-card)]">
          <span className="label-uppercase">Aparência</span>
          <div className="flex flex-wrap gap-2.5">
            <button
              type="button"
              onClick={() => setTheme('dark')}
              className="flex items-center gap-2 h-[var(--control-h)] px-4 text-xs font-600 rounded-full"
              style={{
                border: `1px solid ${isDark ? 'var(--color-brand-red)' : 'var(--color-border-strong)'}`,
                background: isDark ? 'rgba(255,0,0,.08)' : 'var(--color-bg)',
                color: isDark ? 'var(--color-text)' : 'var(--color-text-secondary)',
              }}
            >
              <Moon size={15} />
              Escuro{isDark ? ' · ativo' : ''}
            </button>
            <button
              type="button"
              onClick={() => setTheme('light')}
              className="flex items-center gap-2 h-[var(--control-h)] px-4 text-xs font-600 rounded-full"
              style={{
                border: `1px solid ${!isDark ? 'var(--color-brand-red)' : 'var(--color-border-strong)'}`,
                background: !isDark ? 'rgba(255,0,0,.08)' : 'var(--color-bg)',
                color: !isDark ? 'var(--color-text)' : 'var(--color-text-secondary)',
              }}
            >
              <Sun size={15} />
              Claro{!isDark ? ' · ativo' : ''}
            </button>
          </div>
        </section>

        <section className="flex flex-col gap-4 p-5 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-card)]">
          <span className="label-uppercase">Comportamento do motor</span>

          <div className="flex flex-wrap items-center gap-3.5 p-3.5 bg-[var(--color-bg)] border border-[var(--color-border)] rounded-[var(--radius-md)]">
            <div className="flex flex-col gap-0.5 flex-1 min-w-[200px]">
              <span className="text-sm font-700 text-[var(--color-text)]">Arredondar preços finais</span>
              <span className="text-2xs leading-relaxed text-[var(--color-text-muted)]">Mostra valores em múltiplos de R$ 10 nas propostas e no resultado.</span>
            </div>
            <Toggle on={prefs.roundValues} onToggle={() => updatePref({ roundValues: !prefs.roundValues })} />
          </div>

          <div className="flex flex-wrap items-center gap-3.5 p-3.5 bg-[var(--color-bg)] border border-[var(--color-border)] rounded-[var(--radius-md)]">
            <div className="flex flex-col gap-0.5 flex-1 min-w-[200px]">
              <span className="text-sm font-700 text-[var(--color-text)]">Comparar com tabela ADG Brasil</span>
              <span className="text-2xs leading-relaxed text-[var(--color-text-muted)]">Exibe o benchmark de mercado no dashboard e no resultado do cálculo.</span>
            </div>
            <Toggle on={prefs.showBenchmark} onToggle={() => updatePref({ showBenchmark: !prefs.showBenchmark })} />
          </div>

          <div className="flex flex-wrap items-center gap-3.5 p-3.5 bg-[var(--color-bg)] border border-[var(--color-border)] rounded-[var(--radius-md)]">
            <div className="flex flex-col gap-0.5 flex-1 min-w-[200px]">
              <span className="text-sm font-700 text-[var(--color-text)]">Salvar automaticamente</span>
              <span className="text-2xs leading-relaxed text-[var(--color-text-muted)]">Mantém custos, perfil e propostas no seu navegador entre sessões.</span>
            </div>
            <Toggle on={prefs.autosave} onToggle={() => updatePref({ autosave: !prefs.autosave })} />
          </div>

          <div className="flex flex-wrap items-center gap-3.5 p-3.5 bg-[var(--color-bg)] border border-[var(--color-border)] rounded-[var(--radius-md)]">
            <div className="flex flex-col gap-0.5 flex-1 min-w-[200px]">
              <span className="text-sm font-700 text-[var(--color-text)]">Contribuir com dados de mercado</span>
              <span className="text-2xs leading-relaxed text-[var(--color-text-muted)]">
                Envia o resultado de cada proposta salva de forma anônima (sem nome, e-mail ou dado do seu cliente) pra ajudar a construir o benchmark de mercado do BOB.OS. Desligado por padrão.
              </span>
            </div>
            <Toggle on={prefs.contributeToMarketData} onToggle={() => updatePref({ contributeToMarketData: !prefs.contributeToMarketData })} />
          </div>
        </section>

        <section className="flex flex-col gap-4 p-5 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-card)]">
          <span className="label-uppercase">Seus dados</span>
          <p className="text-xs leading-relaxed text-[var(--color-text-secondary)]">Tudo fica no seu navegador. Nada sobe para servidor nenhum.</p>
          <div className="flex flex-wrap gap-2.5">
            <Button type="button" variant="secondary" onClick={handleRestartOnboarding}>
              <Zap size={15} />
              Refazer configuração inicial
            </Button>
            <Button type="button" variant="secondary" onClick={handleExport}>
              <Download size={15} />
              Exportar backup JSON
            </Button>
            <Button type="button" variant="danger" onClick={handleWipe}>
              <Trash2 size={15} />
              Apagar tudo
            </Button>
          </div>
        </section>
      </div>

      {toast && (
        <div
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[80] flex items-center gap-2.5 px-5 py-3.5 bg-[var(--color-brand-red)] text-white rounded-[var(--radius-md)] text-xs font-800 tracking-wide uppercase"
          style={{ boxShadow: '0 12px 40px rgba(0,0,0,.4)' }}
        >
          {toast}
        </div>
      )}
    </PageContent>
  )
}
