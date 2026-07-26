import type { Metadata } from 'next'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ArrowRight, CheckCircle2, Zap, Calculator } from 'lucide-react'
import { ThemeToggle } from '@/components/ui/theme-toggle'

export const metadata: Metadata = {
  title: 'BOB.OS — Calculadora de Freelas | Sistema Operacional de Precificação',
  description:
    'Pare de precificar no sentimento. Motor de cálculo em 3 camadas para designers, fotógrafos, motion designers e criadores de conteúdo. 100% gratuito.',
}

const FEATURES = [
  'Valor-hora real (não o que você imagina)',
  'Motor em 3 camadas com multiplicadores',
  'Resultado em 3 faixas: mínimo, recomendado e premium',
  'Exportação de proposta em PDF pronta para envio',
  'Benchmark com tabela ADG Brasil / Adegraf',
  '100% gratuito no MVP — sem cartão de crédito',
]

const PERSONAS = [
  'Designers',
  'Fotógrafos',
  'Motion Designers',
  'Videomakers',
  'Web Designers',
  'Criadores de Conteúdo',
]

const INSIGHTS = [
  {
    number: '2×',
    label: 'Mais do que você imagina',
    description: 'Seu valor-hora real costuma ser quase o dobro do calculado pelo método simplificado que divide gastos por 160h.',
    color: 'var(--color-brand-red)',
  },
  {
    number: '60%',
    label: 'Horas realmente faturáveis',
    description: 'De 176h disponíveis no mês, em média apenas 100 a 110h são efetivamente vendáveis para clientes.',
    color: 'var(--color-brand-yellow)',
  },
  {
    number: '03',
    label: 'Camadas de cálculo',
    description: 'Custo operacional de existência + contexto técnico do projeto + multiplicadores e tributos de mercado.',
    color: 'var(--color-brand-green)',
  },
]

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text)] transition-colors duration-200">

      {/* ─── Navbar ─────────────────────────────────────────────────────────── */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 sm:px-8 md:px-12 h-16 border-b border-[var(--color-border)] bg-[var(--color-bg)]/90 backdrop-blur-md transition-colors duration-200">
        <div className="flex items-center gap-2.5">
          <div className="flex items-center justify-center w-8 h-8 bg-[var(--color-brand-red)] rounded-[var(--radius-sm)] shadow-sm">
            <Zap size={16} className="text-white" fill="white" />
          </div>
          <span className="font-display font-900 text-lg uppercase tracking-tight text-[var(--color-text)]">BOB.OS</span>
        </div>

        <div className="flex items-center gap-3 sm:gap-4">
          <ThemeToggle />
          <Link
            href="/login"
            className="text-xs sm:text-sm font-600 text-[var(--color-text-secondary)] hover:text-[var(--color-text)] transition-colors px-2 py-1"
          >
            Entrar
          </Link>
          <Button asChild size="sm" variant="yellow" className="font-700 shadow-sm">
            <Link href="/calcular" className="flex items-center gap-1.5">
              <Calculator size={14} />
              <span className="hidden sm:inline">Acessar</span> Calculadora
            </Link>
          </Button>
          <Button asChild size="sm" className="font-700 hidden md:inline-flex shadow-sm">
            <Link href="/cadastro">Criar Conta</Link>
          </Button>
        </div>
      </nav>

      {/* ─── Hero Section (Inspirado em Human Academy & Brandboard) ─────────── */}
      <section className="min-h-[92vh] flex flex-col items-center justify-center px-6 sm:px-8 md:px-12 pt-32 pb-24 relative overflow-hidden">
        {/* Glow sutil de fundo no dark mode */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-red-500/5 dark:bg-red-500/10 blur-[120px] rounded-full pointer-events-none -z-10" />

        <div className="max-w-5xl mx-auto w-full text-center flex flex-col items-center">

          {/* Pill Badge estilo SaaS high-end */}
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-[var(--color-surface)] border border-[var(--color-border)] text-xs font-600 text-[var(--color-text-secondary)] shadow-2xs mb-8 transition-colors">
            <span className="w-2 h-2 rounded-full bg-[var(--color-brand-red)] animate-pulse" />
            <span className="tracking-wider uppercase">Sistema Operacional de Precificação</span>
          </div>

          {/* Headline principal — Brandboard: Barlow Condensed 900, impactante e sem floreios */}
          <h1 className="font-display font-900 text-5xl sm:text-6xl md:text-7xl lg:text-8xl tracking-tight uppercase max-w-5xl text-[var(--color-text)] leading-[0.95] mb-6">
            Quanto{' '}
            <span className="text-[var(--color-brand-red)]">você</span>
            {' '}realmente{' '}
            <span className="relative inline-block">
              vale
              <span
                className="absolute -bottom-1 left-0 right-0 h-[4px] sm:h-[6px] bg-[var(--color-brand-yellow)]"
                aria-hidden="true"
              />
            </span>
            ?
          </h1>

          {/* Sub-headline */}
          <p className="text-base sm:text-lg md:text-xl text-[var(--color-text-secondary)] max-w-2xl mx-auto mb-10 leading-relaxed font-400">
            Pare de precificar no sentimento. Calcule seu valor-hora real, monte orçamentos
            defensáveis com 3 camadas e nunca mais saia de uma negociação sem números sólidos.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-4 w-full sm:w-auto mb-16">
            <Button asChild size="xl" className="w-full sm:w-auto justify-center font-800 shadow-xl shadow-red-500/20">
              <Link href="/calcular" className="flex items-center gap-2">
                <Calculator size={20} />
                Testar Calculadora Agora
                <ArrowRight size={18} />
              </Link>
            </Button>
            <Button asChild variant="secondary" size="xl" className="w-full sm:w-auto justify-center font-700">
              <Link href="#como-funciona">Ver Como Funciona</Link>
            </Button>
          </div>

          {/* Personas tags — Estilo SaaS limpo (sem arco-íris berrante que quebra no Light Mode) */}
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-2.5 mb-24 max-w-3xl">
            <span className="text-xs font-600 text-[var(--color-text-muted)] mr-1 uppercase tracking-wider w-full sm:w-auto mb-2 sm:mb-0">
              Desenvolvido para:
            </span>
            {PERSONAS.map((label) => (
              <div
                key={label}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-[var(--radius-sm)] bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-text-secondary)] text-xs font-600 tracking-wide uppercase hover:border-[var(--color-brand-red)] hover:text-[var(--color-text)] transition-colors"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-brand-yellow)]" />
                {label}
              </div>
            ))}
          </div>

          {/* ─── Insight Numbers (Cards Individuais Elevados) ─────────────────── */}
          <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
            {INSIGHTS.map((insight) => (
              <div
                key={insight.number}
                className="flex flex-col gap-4 p-8 sm:p-10 rounded-[var(--radius-xl)] bg-[var(--color-surface)] border border-[var(--color-border)] shadow-sm hover:shadow-md hover:border-[var(--color-text-muted)] transition-all duration-200 relative overflow-hidden group"
              >
                <div
                  className="absolute top-0 left-0 right-0 h-1 transition-opacity opacity-75 group-hover:opacity-100"
                  style={{ backgroundColor: insight.color }}
                />
                <span
                  className="font-display font-900 leading-none text-6xl sm:text-7xl tracking-tight"
                  style={{ color: insight.color }}
                >
                  {insight.number}
                </span>
                <div className="flex flex-col gap-2 mt-2">
                  <span className="text-sm font-800 text-[var(--color-text)] uppercase tracking-wider font-display">
                    {insight.label}
                  </span>
                  <p className="text-xs sm:text-sm text-[var(--color-text-secondary)] leading-relaxed">
                    {insight.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Como Funciona (3 Camadas) ──────────────────────────────────────── */}
      <section id="como-funciona" className="py-28 sm:py-36 md:py-44 px-6 sm:px-8 md:px-12 border-t border-[var(--color-border)] bg-[var(--color-surface)]/30">
        <div className="max-w-5xl mx-auto">

          <div className="flex flex-col items-center text-center mb-20 sm:mb-24">
            <span className="label-uppercase mb-3 block text-[var(--color-brand-red)]">Metodologia Exclusiva</span>
            <h2 className="font-display font-900 text-4xl sm:text-5xl md:text-6xl text-[var(--color-text)] mb-6 tracking-tight uppercase">
              3 Camadas. Não 1 Fórmula.
            </h2>
            <p className="text-base sm:text-lg text-[var(--color-text-secondary)] max-w-2xl leading-relaxed">
              Cada tipo de projeto exige uma estratégia diferente.
              O BOB.OS estrutura o seu preço da base operacional até a negociação final com o mercado.
            </p>
          </div>

          {/* Cards das Camadas */}
          <div className="flex flex-col gap-6">
            {[
              {
                number: '01',
                color: 'var(--color-brand-red)',
                title: 'Quanto custa existir',
                subtitle: 'Valor-Hora Real',
                description: 'Despesas fixas + pró-labore desejado + reserva técnica + margem de lucro, divididos rigorosamente pelas horas que você realmente consegue faturar no mês (e não 160h irrealistas).',
              },
              {
                number: '02',
                color: 'var(--color-brand-yellow)',
                title: 'Quanto custa este projeto',
                subtitle: 'Preço Base de Execução',
                description: 'Horas estimadas × seu valor-hora real, somando os custos diretos e indiretos da entrega: terceirizados, equipamentos, deslocamento, softwares e margem de segurança para revisões.',
              },
              {
                number: '03',
                color: 'var(--color-brand-green)',
                title: 'O que o mercado paga',
                subtitle: 'Ajuste e Blindagem Comercial',
                description: 'Multiplicadores estratégicos de complexidade técnica, urgência do prazo, porte monetário do cliente e direitos de uso. MAIS o cálculo automático de impostos (Gross-Up) para você não pagar tributo do próprio bolso.',
              },
            ].map((layer) => (
              <div
                key={layer.number}
                className="flex flex-col sm:flex-row gap-6 sm:gap-8 items-start p-8 sm:p-12 rounded-[var(--radius-xl)] bg-[var(--color-surface)] border border-[var(--color-border)] shadow-sm hover:border-[var(--color-text-muted)] transition-all duration-200 relative overflow-hidden"
              >
                <div
                  className="absolute top-0 left-0 bottom-0 w-2"
                  style={{ backgroundColor: layer.color }}
                />
                <span
                  className="font-display font-900 text-5xl sm:text-6xl leading-none flex-shrink-0 opacity-40 sm:w-20"
                  style={{ color: layer.color }}
                >
                  {layer.number}
                </span>
                <div className="flex flex-col gap-3">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                    <h3 className="font-display font-800 text-2xl sm:text-3xl uppercase tracking-tight text-[var(--color-text)]">
                      {layer.title}
                    </h3>
                    <span
                      className="text-xs font-700 uppercase tracking-widest px-2.5 py-0.5 rounded-[var(--radius-sm)] bg-[var(--color-bg)] border border-[var(--color-border)] w-fit"
                      style={{ color: layer.color }}
                    >
                      • {layer.subtitle}
                    </span>
                  </div>
                  <p className="text-sm sm:text-base text-[var(--color-text-secondary)] leading-relaxed max-w-3xl">
                    {layer.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── O que está incluso ─────────────────────────────────────────────── */}
      <section className="py-28 sm:py-36 md:py-44 px-6 sm:px-8 md:px-12 border-t border-[var(--color-border)]">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">

            <div className="lg:col-span-7 flex flex-col gap-8">
              <div>
                <span className="label-uppercase mb-3 block text-[var(--color-brand-yellow)] font-700">V1 — 100% Gratuito no MVP</span>
                <h2 className="font-display font-900 text-4xl sm:text-5xl text-[var(--color-text)] mb-4 tracking-tight uppercase">
                  Tudo o que você precisa.<br />
                  <span className="text-[var(--color-brand-yellow)]">Sem pagar nada.</span>
                </h2>
                <p className="text-base sm:text-lg text-[var(--color-text-secondary)] leading-relaxed max-w-xl">
                  O motor de cálculo completo permanece gratuito indefinidamente.
                  Não existe truque, pegadinha ou paywall bloqueando suas propostas.
                </p>
              </div>

              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {FEATURES.map((feature) => (
                  <li key={feature} className="flex items-start gap-3 text-sm sm:text-base">
                    <CheckCircle2 size={18} className="text-[var(--color-brand-green)] flex-shrink-0 mt-0.5" />
                    <span className="text-[var(--color-text-secondary)] font-500">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* CTA Box Vermelha */}
            <div className="lg:col-span-5 bg-[var(--color-brand-red)] rounded-[var(--radius-xl)] p-8 sm:p-12 flex flex-col gap-6 shadow-2xl shadow-red-500/20 text-white relative overflow-hidden">
              <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-white/10 rounded-full blur-2xl pointer-events-none" />
              <div className="flex flex-col gap-2">
                <span className="font-display font-900 text-4xl sm:text-5xl uppercase leading-none tracking-tight text-white">
                  Quanto você cobra pela sua hora?
                </span>
              </div>
              <p className="text-sm sm:text-base text-white/90 leading-relaxed font-400">
                Se você respondeu sem hesitar, ótimo. Se precisou pensar ou chutou um valor, o BOB.OS te dá o número exato em 3 minutos.
              </p>
              <Button asChild variant="yellow" size="xl" className="w-full justify-center font-800 shadow-lg text-black">
                <Link href="/calcular" className="flex items-center justify-center gap-2">
                  <Calculator size={18} />
                  Entrar na Calculadora
                  <ArrowRight size={18} />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Footer ─────────────────────────────────────────────────────────── */}
      <footer className="border-t border-[var(--color-border)] px-6 sm:px-8 md:px-12 py-12 bg-[var(--color-surface)]/50 transition-colors duration-200">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2.5">
            <div className="flex items-center justify-center w-6 h-6 bg-[var(--color-brand-red)] rounded-[var(--radius-sm)]">
              <Zap size={12} className="text-white" fill="white" />
            </div>
            <span className="font-display font-900 text-sm uppercase tracking-tight text-[var(--color-text)]">
              BOB.OS
            </span>
            <span className="text-[var(--color-text-muted)] text-xs font-500 ml-1">
              by BEEKOFF®
            </span>
          </div>
          <div className="flex gap-6 text-xs sm:text-sm text-[var(--color-text-muted)] font-500">
            <Link href="/calcular" className="hover:text-[var(--color-text)] transition-colors">
              Calculadora
            </Link>
            <Link href="/privacidade" className="hover:text-[var(--color-text)] transition-colors">
              Privacidade
            </Link>
            <Link href="/termos" className="hover:text-[var(--color-text)] transition-colors">
              Termos de uso
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
