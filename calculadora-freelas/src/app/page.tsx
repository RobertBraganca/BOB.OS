import type { Metadata } from 'next'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ArrowRight, CheckCircle2, Zap } from 'lucide-react'
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
  'Exportação de proposta em PDF',
  'Benchmark com tabela ADG / Adegraf',
  '100% gratuito no MVP — sem cartão de crédito',
]

const PERSONAS = [
  { label: 'Designers', color: 'red' as const },
  { label: 'Fotógrafos', color: 'yellow' as const },
  { label: 'Motion', color: 'blue' as const },
  { label: 'Videomakers', color: 'pink' as const },
  { label: 'Web Designers', color: 'purple' as const },
  { label: 'Criadores de Conteúdo', color: 'green' as const },
]

const INSIGHTS = [
  {
    number: '2×',
    label: 'Mais do que você imagina',
    description: 'Seu valor-hora real costuma ser quase o dobro do calculado pelo método simplificado.',
    accent: 'red' as const,
  },
  {
    number: '60%',
    label: 'Horas realmente faturáveis',
    description: 'De 176h disponíveis no mês, em média apenas 100–110h são efetivamente vendáveis.',
    accent: 'yellow' as const,
  },
  {
    number: '3',
    label: 'Camadas de cálculo',
    description: 'Custo operacional + contexto do projeto + mercado. Não apenas horas × valor.',
    accent: 'green' as const,
  },
]

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[var(--color-bg)] transition-colors duration-200">

      {/* ─── Navbar ─────────────────────────────────────────────────────────── */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 sm:px-8 md:px-12 h-16 border-b border-[var(--color-border)] bg-[var(--color-bg)]/90 backdrop-blur-md transition-colors duration-200">
        <div className="flex items-center gap-2.5">
          <div className="flex items-center justify-center w-8 h-8 bg-[var(--color-brand-red)] rounded-[var(--radius-sm)] shadow-sm">
            <Zap size={16} className="text-white" fill="white" />
          </div>
          <span className="font-display font-900 text-base uppercase tracking-tight text-[var(--color-text)]">BOB.OS</span>
        </div>

        <div className="flex items-center gap-3 sm:gap-4">
          <ThemeToggle />
          <Link
            href="/login"
            className="text-sm font-500 text-[var(--color-text-secondary)] hover:text-[var(--color-text)] transition-colors hidden sm:inline-block"
          >
            Entrar
          </Link>
          <Button asChild size="sm" className="font-600">
            <Link href="/cadastro">Começar grátis</Link>
          </Button>
        </div>
      </nav>

      {/* ─── Hero ───────────────────────────────────────────────────────────── */}
      <section className="min-h-[90vh] flex flex-col items-center justify-center px-6 sm:px-8 md:px-12 pt-32 pb-20 md:pb-28">
        <div className="max-w-5xl mx-auto w-full text-center flex flex-col items-center">

          {/* Pré-headline */}
          <div className="mb-6 sm:mb-8">
            <Badge variant="outline" dot className="px-3 py-1 text-xs">
              Sistema Operacional de Precificação
            </Badge>
          </div>

          {/* Headline principal — Brandboard: tipografia dominante, caixa alta */}
          <h1 className="text-display-xl md:text-display-2xl text-[var(--color-text)] mb-6 max-w-4xl mx-auto tracking-tight">
            Quanto{' '}
            <span className="text-[var(--color-brand-red)]">você</span>
            {' '}realmente{' '}
            <span className="relative inline-block">
              vale
              <span
                className="absolute -bottom-1 left-0 right-0 h-[3px] sm:h-[4px] bg-[var(--color-brand-yellow)]"
                aria-hidden="true"
              />
            </span>
            ?
          </h1>

          {/* Sub-headline */}
          <p className="text-base sm:text-lg md:text-xl text-[var(--color-text-secondary)] max-w-2xl mx-auto mb-10 sm:mb-12 leading-relaxed">
            Pare de precificar no sentimento. Calcule seu valor-hora real, monte orçamentos
            defensáveis e nunca mais saia de uma negociação sem números sólidos.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-4 w-full sm:w-auto mb-16 sm:mb-20">
            <Button asChild size="xl" className="w-full sm:w-auto justify-center font-700 shadow-lg shadow-red-500/10">
              <Link href="/cadastro" className="flex items-center gap-2">
                Calcular meu preço agora
                <ArrowRight size={18} />
              </Link>
            </Button>
            <Button asChild variant="ghost" size="xl" className="w-full sm:w-auto justify-center">
              <Link href="#como-funciona">Ver como funciona</Link>
            </Button>
          </div>

          {/* Personas */}
          <div className="flex flex-wrap items-center justify-center gap-2 mb-20 sm:mb-24 max-w-3xl">
            <span className="text-xs font-600 text-[var(--color-text-muted)] mr-1 uppercase tracking-wider w-full sm:w-auto mb-2 sm:mb-0">
              Para quem é:
            </span>
            {PERSONAS.map((p) => (
              <Badge key={p.label} variant={p.color} className="px-2.5 py-1 text-xs">
                {p.label}
              </Badge>
            ))}
          </div>

          {/* ─── Insight Numbers ──────────────────────────────────────────────── */}
          <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-px bg-[var(--color-border)] border border-[var(--color-border)] rounded-[var(--radius-xl)] overflow-hidden shadow-sm">
            {INSIGHTS.map((insight) => (
              <div
                key={insight.number}
                className="flex flex-col gap-4 p-8 sm:p-10 bg-[var(--color-surface)] transition-colors duration-200"
              >
                <span
                  className={`numeric-display font-900 leading-none text-5xl sm:text-6xl ${
                    insight.accent === 'red' ? 'text-[var(--color-brand-red)]' :
                    insight.accent === 'yellow' ? 'text-[var(--color-brand-yellow)]' :
                    'text-[var(--color-brand-green)]'
                  }`}
                >
                  {insight.number}
                </span>
                <div className="flex flex-col gap-1.5 text-left">
                  <span className="text-sm font-700 text-[var(--color-text)] uppercase tracking-wide">
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

      {/* ─── Como Funciona ──────────────────────────────────────────────────── */}
      <section id="como-funciona" className="py-28 sm:py-36 md:py-44 px-6 sm:px-8 md:px-12 border-t border-[var(--color-border)]">
        <div className="max-w-5xl mx-auto">

          <div className="flex flex-col items-center text-center mb-16 sm:mb-24">
            <span className="label-uppercase mb-3 block">Metodologia Exclusiva</span>
            <h2 className="text-display-lg text-[var(--color-text)] mb-6 tracking-tight">
              3 camadas. Não 1 fórmula.
            </h2>
            <p className="text-base sm:text-lg text-[var(--color-text-secondary)] max-w-2xl leading-relaxed">
              Cada tipo de projeto tem uma lógica de precificação diferente.
              O BOB.OS identifica o método certo e aplica as variáveis que realmente impactam o preço.
            </p>
          </div>

          {/* Camadas */}
          <div className="flex flex-col gap-px bg-[var(--color-border)] border border-[var(--color-border)] rounded-[var(--radius-xl)] overflow-hidden shadow-sm">
            {[
              {
                number: '01',
                color: 'var(--color-brand-red)',
                title: 'Quanto custa existir',
                subtitle: 'Valor-hora real',
                description: 'Despesas fixas + pró-labore + reserva técnica + margem de lucro, divididos pelas horas que você realmente consegue vender — não pelas horas disponíveis no mês.',
              },
              {
                number: '02',
                color: 'var(--color-brand-yellow)',
                title: 'Quanto custa este projeto',
                subtitle: 'Preço base',
                description: 'Tempo estimado × valor-hora real, mais custos diretos e indiretos do projeto: equipamentos, terceirizados, deslocamento, licenças de software e margem para revisões.',
              },
              {
                number: '03',
                color: 'var(--color-brand-green)',
                title: 'O que o mercado paga',
                subtitle: 'Ajuste de contexto',
                description: 'Multiplicadores estratégicos de complexidade, urgência do prazo, porte do cliente e direitos de uso (licenciamento). Mais gross-up automático de impostos pelo seu regime tributário.',
              },
            ].map((layer) => (
              <div
                key={layer.number}
                className="flex flex-col sm:flex-row gap-6 sm:gap-8 items-start p-8 sm:p-12 bg-[var(--color-surface)] transition-colors duration-200"
              >
                <span
                  className="numeric-display font-900 text-5xl sm:text-6xl leading-none flex-shrink-0 opacity-25"
                  style={{ color: layer.color }}
                >
                  {layer.number}
                </span>
                <div className="flex flex-col gap-2.5">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-3">
                    <span className="font-display font-800 text-xl sm:text-2xl uppercase tracking-tight text-[var(--color-text)]">
                      {layer.title}
                    </span>
                    <span className="label-uppercase text-[0.7rem]" style={{ color: layer.color }}>
                      • {layer.subtitle}
                    </span>
                  </div>
                  <p className="text-sm sm:text-base text-[var(--color-text-secondary)] max-w-2xl leading-relaxed">
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
                <span className="label-uppercase mb-3 block text-[var(--color-brand-yellow)]">V1 — 100% gratuito no MVP</span>
                <h2 className="text-display-lg text-[var(--color-text)] mb-4 tracking-tight">
                  Tudo que você precisa.<br />
                  <span className="text-[var(--color-brand-yellow)]">Sem pagar nada.</span>
                </h2>
                <p className="text-base sm:text-lg text-[var(--color-text-secondary)] leading-relaxed max-w-xl">
                  O motor de cálculo completo — camadas 1, 2 e 3 — permanece gratuito indefinidamente.
                  Não existe truque, pegadinha ou paywall escondido.
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

            {/* CTA Box */}
            <div className="lg:col-span-5 bg-[var(--color-brand-red)] rounded-[var(--radius-xl)] p-8 sm:p-12 flex flex-col gap-6 shadow-xl shadow-red-500/10">
              <div className="flex flex-col gap-2">
                <span className="font-display font-900 text-4xl sm:text-5xl uppercase leading-none text-white tracking-tight">
                  Quanto você cobra pela sua hora?
                </span>
              </div>
              <p className="text-sm sm:text-base text-white/90 leading-relaxed font-400">
                Se você respondeu sem hesitar, ótimo. Se precisou pensar, o BOB.OS vai te
                mostrar o número real fundamentado na sua realidade técnica.
              </p>
              <Button asChild variant="yellow" size="xl" className="w-full justify-center font-800 shadow-md">
                <Link href="/cadastro" className="flex items-center justify-center gap-2">
                  Descobrir agora
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
