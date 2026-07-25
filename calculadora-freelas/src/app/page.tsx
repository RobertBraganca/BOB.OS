import type { Metadata } from 'next'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ArrowRight, CheckCircle2, Zap } from 'lucide-react'

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
    <div className="min-h-screen bg-[var(--color-bg)]">

      {/* ─── Navbar ─────────────────────────────────────────────────────────── */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 h-14 border-b border-[var(--color-border)] bg-[var(--color-bg)]/95 backdrop-blur-sm">
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center w-7 h-7 bg-[var(--color-brand-red)] rounded-[var(--radius-sm)]">
            <Zap size={14} className="text-white" fill="white" />
          </div>
          <span className="font-display font-900 text-sm uppercase tracking-tight">BOB.OS</span>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-text)] transition-colors"
          >
            Entrar
          </Link>
          <Button asChild size="sm">
            <Link href="/cadastro">Começar grátis</Link>
          </Button>
        </div>
      </nav>

      {/* ─── Hero ───────────────────────────────────────────────────────────── */}
      <section className="min-h-screen flex flex-col items-center justify-center px-6 pt-14">
        <div className="max-w-5xl mx-auto w-full text-center">

          {/* Pré-headline */}
          <div className="flex items-center justify-center gap-2 mb-8">
            <Badge variant="outline" dot>
              Sistema Operacional de Precificação
            </Badge>
          </div>

          {/* Headline principal — Brandboard: tipografia dominante, caixa alta */}
          <h1 className="text-display-2xl text-[var(--color-text)] mb-4 max-w-4xl mx-auto">
            Quanto{' '}
            <span className="text-[var(--color-brand-red)]">você</span>
            {' '}realmente{' '}
            <span className="relative">
              vale
              <span
                className="absolute -bottom-1 left-0 right-0 h-[3px] bg-[var(--color-brand-yellow)]"
                aria-hidden="true"
              />
            </span>
            ?
          </h1>

          {/* Sub-headline */}
          <p className="text-lg text-[var(--color-text-secondary)] max-w-2xl mx-auto mb-10 leading-relaxed">
            Pare de precificar no sentimento. Calcule seu valor-hora real, monte orçamentos
            defensáveis e nunca mais saia de uma negociação sem números sólidos.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <Button asChild size="xl">
              <Link href="/cadastro" className="flex items-center gap-2">
                Calcular meu preço agora
                <ArrowRight size={18} />
              </Link>
            </Button>
            <Button asChild variant="ghost" size="xl">
              <Link href="#como-funciona">Ver como funciona</Link>
            </Button>
          </div>

          {/* Personas */}
          <div className="flex flex-wrap items-center justify-center gap-2 mb-16">
            <span className="text-xs text-[var(--color-text-muted)] mr-1">Para:</span>
            {PERSONAS.map((p) => (
              <Badge key={p.label} variant={p.color}>
                {p.label}
              </Badge>
            ))}
          </div>

          {/* ─── Insight Numbers ──────────────────────────────────────────────── */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-[var(--color-border)] border border-[var(--color-border)] rounded-[var(--radius-xl)] overflow-hidden">
            {INSIGHTS.map((insight) => (
              <div
                key={insight.number}
                className="flex flex-col gap-3 p-8 bg-[var(--color-surface)]"
              >
                <span
                  className={`numeric-display font-900 leading-none text-6xl ${
                    insight.accent === 'red' ? 'text-[var(--color-brand-red)]' :
                    insight.accent === 'yellow' ? 'text-[var(--color-brand-yellow)]' :
                    'text-[var(--color-brand-green)]'
                  }`}
                >
                  {insight.number}
                </span>
                <div className="flex flex-col gap-1 text-left">
                  <span className="text-sm font-700 text-[var(--color-text)] uppercase tracking-wide">
                    {insight.label}
                  </span>
                  <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed">
                    {insight.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Como Funciona ──────────────────────────────────────────────────── */}
      <section id="como-funciona" className="py-24 px-6">
        <div className="max-w-5xl mx-auto">

          <div className="flex flex-col items-center text-center mb-16">
            <span className="label-uppercase mb-3">Metodologia</span>
            <h2 className="text-display-lg text-[var(--color-text)] mb-4">
              3 camadas. Não 1 fórmula.
            </h2>
            <p className="text-sm text-[var(--color-text-secondary)] max-w-xl leading-relaxed">
              Cada tipo de projeto tem uma lógica de precificação diferente.
              O BOB.OS identifica o método certo e aplica as variáveis que realmente impactam o preço.
            </p>
          </div>

          {/* Camadas */}
          <div className="flex flex-col gap-px bg-[var(--color-border)] border border-[var(--color-border)] rounded-[var(--radius-xl)] overflow-hidden">
            {[
              {
                number: '01',
                color: 'var(--color-brand-red)',
                title: 'Quanto custa existir',
                subtitle: 'Valor-hora real',
                description: 'Despesas fixas + pró-labore + reserva técnica + margem de lucro, divididos pelas horas que você realmente consegue vender — não pelas horas disponíveis.',
              },
              {
                number: '02',
                color: 'var(--color-brand-yellow)',
                title: 'Quanto custa este projeto',
                subtitle: 'Preço base',
                description: 'Tempo estimado × valor-hora real, mais custos diretos do projeto: equipamentos, terceiros, deslocamento, licenças e revisões.',
              },
              {
                number: '03',
                color: 'var(--color-brand-green)',
                title: 'O que o mercado paga',
                subtitle: 'Ajuste de contexto',
                description: 'Multiplicadores de complexidade, urgência, porte do cliente e direitos de uso. Mais gross-up de impostos pelo seu regime tributário.',
              },
            ].map((layer) => (
              <div
                key={layer.number}
                className="flex gap-6 items-start p-8 bg-[var(--color-surface)]"
              >
                <span
                  className="numeric-display font-900 text-5xl leading-none flex-shrink-0 opacity-20"
                  style={{ color: layer.color }}
                >
                  {layer.number}
                </span>
                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center gap-2">
                    <span className="font-display font-800 text-xl uppercase tracking-tight text-[var(--color-text)]">
                      {layer.title}
                    </span>
                    <span className="label-uppercase" style={{ color: layer.color }}>
                      {layer.subtitle}
                    </span>
                  </div>
                  <p className="text-sm text-[var(--color-text-secondary)] max-w-xl leading-relaxed">
                    {layer.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── O que está incluso ─────────────────────────────────────────────── */}
      <section className="py-24 px-6 border-t border-[var(--color-border)]">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

            <div className="flex flex-col gap-6">
              <div>
                <span className="label-uppercase mb-3 block">V1 — 100% gratuito</span>
                <h2 className="text-display-lg text-[var(--color-text)] mb-3">
                  Tudo que você precisa.<br />
                  <span className="text-[var(--color-brand-yellow)]">Sem pagar nada.</span>
                </h2>
                <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">
                  O motor de cálculo completo — camadas 1, 2 e 3 — permanece gratuito indefinidamente.
                  Não existe truque ou paywall escondido.
                </p>
              </div>

              <ul className="flex flex-col gap-3">
                {FEATURES.map((feature) => (
                  <li key={feature} className="flex items-start gap-3 text-sm">
                    <CheckCircle2 size={15} className="text-[var(--color-brand-green)] flex-shrink-0 mt-0.5" />
                    <span className="text-[var(--color-text-secondary)]">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* CTA Box */}
            <div className="bg-[var(--color-brand-red)] rounded-[var(--radius-xl)] p-10 flex flex-col gap-6">
              <div className="flex flex-col gap-2">
                <span className="font-display font-900 text-5xl uppercase leading-none text-white">
                  Quanto você cobra pela sua hora?
                </span>
              </div>
              <p className="text-sm text-white/80 leading-relaxed">
                Se você respondeu sem hesitar, ótimo. Se precisou pensar, o BOB.OS vai te
                mostrar o número com fundamento técnico.
              </p>
              <Button asChild variant="yellow" size="lg" className="self-start">
                <Link href="/cadastro" className="flex items-center gap-2">
                  Descobrir agora
                  <ArrowRight size={16} />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Footer ─────────────────────────────────────────────────────────── */}
      <footer className="border-t border-[var(--color-border)] px-8 py-8">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-display font-900 text-sm uppercase tracking-tight text-[var(--color-text-muted)]">
              BOB.OS
            </span>
            <span className="text-[var(--color-text-muted)] text-xs">
              by BEEKOFF®
            </span>
          </div>
          <div className="flex gap-5 text-xs text-[var(--color-text-muted)]">
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
