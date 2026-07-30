'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { ThemeToggle } from '@/shared/components/ui/theme-toggle'
import { Logo } from '@/shared/components/ui/logo'

/**
 * Landing — BOB.OS
 * Fidelidade ao handoff design_handoff_bobos_redesign/design/AppScreen.dc.html
 * (bloco isMarketing, linhas 12-93). Estrutura enxuta: header, hero, prova,
 * metodologia em 3 camadas, painel vermelho de captura e rodapé.
 */

const PROOF = [
  { value: '03', color: 'var(--color-text)', label: 'Camadas de cálculo' },
  { value: '2×', color: 'var(--color-brand-red)', label: 'Diferença entre o piso e o preço justo' },
  { value: '16', color: 'var(--color-text)', label: 'Serviços com referência ADG Brasil' },
  { value: 'R$ 0', color: 'var(--color-brand-yellow)', label: 'Para usar o motor completo' },
]

const LAYERS = [
  {
    number: 'Camada 01',
    color: 'var(--color-brand-red)',
    title: 'Custo de existência',
    description: 'Despesas fixas, pró-labore, reserva técnica e margem divididos pelas horas que você realmente fatura. É o seu piso, nunca cobre abaixo dele.',
  },
  {
    number: 'Camada 02',
    color: 'var(--color-brand-yellow)',
    title: 'Preço do projeto',
    description: 'Horas estimadas, revisões e custos diretos por método de cobrança, hora, diária, escopo fechado, pacote ou mensalidade.',
  },
  {
    number: 'Camada 03',
    color: 'var(--color-brand-green)',
    title: 'Contexto e mercado',
    description: 'Complexidade, urgência, porte do cliente e direitos de uso. Mais gross-up tributário do seu regime, para o imposto não sair do seu lucro.',
  },
]

export default function LandingPage() {
  const [signupEmail, setSignupEmail] = useState('')

  return (
    <div className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text)]" id="top">
      {/* ─── Header ──────────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-50 flex items-center justify-between gap-4 px-5 py-3 border-b border-[var(--color-border)] bg-[var(--color-bg)] flex-wrap">
        <Link href="/" className="flex items-center gap-2.5 flex-shrink-0">
          <Logo height={80} />
          <span className="font-display font-900 text-[37px] tracking-tight uppercase text-[var(--color-text-muted)] border-l border-[var(--color-border)] pl-2.5">
            .OS
          </span>
        </Link>
        <div className="flex items-center gap-2 ml-auto">
          <ThemeToggle />
          <Link
            href="/login"
            className="h-[38px] flex items-center px-4 border border-[var(--color-border)] text-[var(--color-text)] text-[13px] font-700 tracking-wide uppercase rounded-[var(--radius-md)] hover:bg-[var(--color-surface)] hover:border-[var(--color-text-muted)] transition-colors"
          >
            Entrar
          </Link>
          <Link
            href="/cadastro"
            className="h-[38px] flex items-center px-[18px] bg-[var(--color-brand-red)] text-white text-[13px] font-800 tracking-wide uppercase rounded-[var(--radius-md)] hover:brightness-110 transition-[filter]"
          >
            Criar conta grátis
          </Link>
        </div>
      </header>

      {/* ─── Hero ────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden">
        <div className="landing-aurora" aria-hidden="true" />
        <div className="relative z-10 max-w-[1120px] mx-auto px-5 pt-16 pb-14 flex flex-col gap-7">
          <div className="inline-flex items-center gap-2.5 self-start pl-2 pr-3 py-1.5 border border-[var(--color-border)] rounded-full bg-[var(--color-surface)]">
            <span className="w-[7px] h-[7px] rounded-full bg-[var(--color-brand-green)] flex-shrink-0" />
            <span className="text-2xs font-700 tracking-widest uppercase text-[var(--color-text-secondary)]">
              Motor de 3 camadas · sempre gratuito
            </span>
          </div>
          <h1 className="text-display-xl text-[var(--color-text)] max-w-[20ch]">
            Quanto você <span className="text-[var(--color-brand-red)]">realmente</span> vale?
          </h1>
          <p className="max-w-[56ch] leading-relaxed text-[var(--color-text-secondary)]" style={{ fontSize: '1.3rem' }}>
            Pare de precificar no sentimento. O BOB.OS calcula seu valor-hora real, aplica multiplicadores de mercado e devolve um orçamento que você consegue defender na frente do cliente.
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/cadastro"
              className="flex items-center gap-2.5 h-[52px] px-[26px] bg-[var(--color-brand-red)] text-white font-display font-900 text-[23px] tracking-wide uppercase rounded-[var(--radius-md)] hover:brightness-110 transition-[filter]"
              style={{ boxShadow: '0 8px 32px rgba(255,0,0,.28)' }}
            >
              Criar conta grátis
              <ArrowRight size={18} />
            </Link>
            <Link
              href="/dashboard"
              className="flex items-center gap-2.5 h-[52px] px-[22px] border border-[var(--color-border)] text-[var(--color-text)] font-display font-800 text-[23px] tracking-wide uppercase rounded-[var(--radius-md)] hover:bg-[var(--color-surface)] hover:border-[var(--color-text-muted)] transition-colors"
            >
              Ver o produto
            </Link>
            <span className="text-xs text-[var(--color-text-muted)] max-w-[22ch] leading-snug">
              Sem cartão. Sem teste expirando. Sem pegadinha.
            </span>
          </div>
        </div>
      </section>

      {/* ─── Faixa de provas ─────────────────────────────────────────────── */}
      <section className="border-y border-[var(--color-border)] bg-[var(--color-surface)]">
        <div className="max-w-[1120px] mx-auto grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
          {PROOF.map((p, i) => (
            <div
              key={p.label}
              className={`flex flex-col gap-1.5 py-7 px-6 ${i < PROOF.length - 1 ? 'border-r border-[var(--color-border)]' : ''}`}
            >
              <span className="numeric-display leading-none" style={{ fontSize: 53, color: p.color }}>{p.value}</span>
              <span className="text-xs font-600 tracking-wide uppercase text-[var(--color-text-secondary)]">{p.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ─── Metodologia ─────────────────────────────────────────────────── */}
      <section className="max-w-[1120px] mx-auto px-5 py-[88px] flex flex-col gap-10">
        <div className="flex flex-col gap-2.5 max-w-[60ch]">
          <span className="label-uppercase text-[var(--color-brand-red)]">Metodologia</span>
          <h2 className="text-display-lg text-[var(--color-text)]">3 camadas. Não 1 fórmula.</h2>
          <p className="text-base leading-relaxed text-[var(--color-text-secondary)]">
            Cada camada responde uma pergunta diferente. Juntas, elas transformam custo em argumento comercial.
          </p>
        </div>
        <div className="grid gap-5" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' }}>
          {LAYERS.map((layer) => (
            <article
              key={layer.number}
              className="flex flex-col gap-3.5 p-7 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-lg)]"
              style={{ borderTop: `2px solid ${layer.color}` }}
            >
              <span className="numeric-display tracking-widest text-[15px]" style={{ color: layer.color }}>{layer.number}</span>
              <h3 className="text-display-sm text-[var(--color-text)]">{layer.title}</h3>
              <p className="text-sm leading-relaxed text-[var(--color-text-secondary)]">{layer.description}</p>
            </article>
          ))}
        </div>
      </section>

      {/* ─── Painel vermelho de captura ──────────────────────────────────── */}
      <section className="bg-[var(--color-brand-red)] text-white">
        <div className="max-w-[1120px] mx-auto px-5 py-20 grid gap-11 items-center" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
          <div className="flex flex-col gap-[18px]">
            <h2 className="text-display-lg text-white">Pare de precificar no sentimento.</h2>
            <p className="text-lg leading-relaxed max-w-[44ch]" style={{ color: 'rgba(255,255,255,.88)' }}>
              Três minutos configurando seus custos. Um número que você defende sem gaguejar.
            </p>
          </div>
          <div className="flex flex-col gap-3 p-7 bg-[#080808] rounded-[var(--radius-lg)]">
            <span className="label-uppercase text-[var(--color-brand-yellow)]">Comece agora</span>
            <input
              type="email"
              value={signupEmail}
              onChange={(e) => setSignupEmail(e.target.value)}
              placeholder="seu@email.com"
              className="h-12 px-3.5 bg-[#101010] border border-[#222] text-white text-sm rounded-[var(--radius-md)] outline-none focus:border-[var(--color-brand-yellow)]"
            />
            <Link
              href="/cadastro"
              className="flex items-center justify-center gap-2.5 h-12 bg-[var(--color-brand-yellow)] text-black font-display font-900 text-[23px] tracking-wide uppercase rounded-[var(--radius-md)] hover:brightness-110 transition-[filter]"
            >
              Criar conta grátis
              <ArrowRight size={17} />
            </Link>
            <p className="text-2xs leading-relaxed text-[#A1A1AA]">
              Seus dados de custo ficam no seu navegador. O motor de 3 camadas é gratuito e continua gratuito.
            </p>
          </div>
        </div>
      </section>

      {/* ─── Footer ──────────────────────────────────────────────────────── */}
      <footer className="max-w-[1120px] mx-auto px-5 py-11 flex flex-wrap items-center justify-between gap-5">
        <div className="flex items-center gap-3">
          <Logo height={22} />
          <span className="text-2xs tracking-widest uppercase text-[var(--color-text-muted)]">Desenvolvido por | O Designer Bob®</span>
        </div>
        <div className="flex flex-wrap gap-5 text-xs text-[var(--color-text-secondary)]">
          <Link href="/termos" className="animated-underline text-[var(--color-text-secondary)]">Termos</Link>
          <Link href="/privacidade" className="animated-underline text-[var(--color-text-secondary)]">Privacidade</Link>
          <span>Referência de mercado: ADG Brasil / Adegraf 2024-2026</span>
        </div>
      </footer>
    </div>
  )
}
