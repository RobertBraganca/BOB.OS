'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useTheme } from 'next-themes'
import { PageContent } from '@/shared/components/layout/shell'
import { loadPrefs, savePrefs, exportBackupJSON, eraseAllData, type Prefs } from '@/shared/lib/storage'
import { Moon, Sun, Clock, Zap, Download, Trash2 } from 'lucide-react'

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
  const [prefs, setPrefs] = useState<Prefs>({ roundValues: false, showBenchmark: true, autosave: true })
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

  const handleLogout = () => {
    localStorage.removeItem('bob_user_session')
    router.push('/login?expired=1')
  }

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
    setPrefs({ roundValues: false, showBenchmark: true, autosave: true })
  }

  return (
    <PageContent>
      <div className="flex flex-col gap-[22px] max-w-[820px]">
        <div className="flex flex-col gap-1.5">
          <span className="label-uppercase text-[var(--color-brand-red)]">Preferências</span>
          <h1 className="text-display-md text-[var(--color-text)]">Configurações</h1>
          <p className="text-sm leading-relaxed text-[var(--color-text-secondary)] max-w-[56ch]">
            Cada chave aqui muda o comportamento do sistema na hora, nada é decorativo.
          </p>
        </div>

        <section
          className="flex flex-col gap-3.5 p-6 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-lg)]"
          style={{ borderTop: '2px solid var(--color-brand-red)' }}
        >
          <span className="label-uppercase">Aparência</span>
          <div className="flex flex-wrap gap-2.5">
            <button
              type="button"
              onClick={() => setTheme('dark')}
              className="flex items-center gap-2 h-[46px] px-[18px] text-xs font-800 tracking-wide uppercase rounded-[var(--radius-md)]"
              style={{
                border: `1px solid ${isDark ? 'var(--color-brand-red)' : 'var(--color-border)'}`,
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
              className="flex items-center gap-2 h-[46px] px-[18px] text-xs font-800 tracking-wide uppercase rounded-[var(--radius-md)]"
              style={{
                border: `1px solid ${!isDark ? 'var(--color-brand-red)' : 'var(--color-border)'}`,
                background: !isDark ? 'rgba(255,0,0,.08)' : 'var(--color-bg)',
                color: !isDark ? 'var(--color-text)' : 'var(--color-text-secondary)',
              }}
            >
              <Sun size={15} />
              Claro{!isDark ? ' · ativo' : ''}
            </button>
          </div>
        </section>

        <section className="flex flex-col gap-3 p-6 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-lg)]">
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
        </section>

        <section className="flex flex-col gap-3.5 p-6 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-lg)]">
          <span className="label-uppercase">Seus dados</span>
          <p className="text-xs leading-relaxed text-[var(--color-text-secondary)]">Tudo fica no seu navegador. Nada sobe para servidor nenhum.</p>
          <div className="flex flex-wrap gap-2.5">
            <button
              type="button"
              onClick={handleLogout}
              className="flex items-center gap-2 h-11 px-4 border border-[var(--color-border)] text-[var(--color-text)] text-xs font-700 tracking-wide uppercase rounded-[var(--radius-md)] hover:bg-[var(--color-surface-raised)] transition-colors"
            >
              <Clock size={15} />
              Encerrar sessão
            </button>
            <button
              type="button"
              onClick={handleRestartOnboarding}
              className="flex items-center gap-2 h-11 px-4 border border-[var(--color-border)] text-[var(--color-text)] text-xs font-700 tracking-wide uppercase rounded-[var(--radius-md)] hover:bg-[var(--color-surface-raised)] transition-colors"
            >
              <Zap size={15} />
              Refazer configuração inicial
            </button>
            <button
              type="button"
              onClick={handleExport}
              className="flex items-center gap-2 h-11 px-4 border border-[var(--color-border)] text-[var(--color-text)] text-xs font-700 tracking-wide uppercase rounded-[var(--radius-md)] hover:bg-[var(--color-surface-raised)] transition-colors"
            >
              <Download size={15} />
              Exportar backup JSON
            </button>
            <button
              type="button"
              onClick={handleWipe}
              className="flex items-center gap-2 h-11 px-4 border border-[var(--color-brand-red)] text-[var(--color-brand-red)] text-xs font-800 tracking-wide uppercase rounded-[var(--radius-md)] hover:bg-[var(--color-brand-red)]/10 transition-colors"
            >
              <Trash2 size={15} />
              Apagar tudo
            </button>
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
