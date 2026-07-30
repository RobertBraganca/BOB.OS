/**
 * Motor de Precificação — Multiplicadores
 *
 * Regras de multiplicadores de contexto e mercado para a Camada 3.
 * Fundamentado no PRD/SRS v1.0, seção 2.3 — Camada 3 e RF-12
 */

// ─── Complexidade ─────────────────────────────────────────────────────────────

export type ComplexityLevel = 'simple' | 'standard' | 'complex' | 'very_complex'

export const COMPLEXITY_MULTIPLIERS: Record<ComplexityLevel, { label: string; description: string; multiplier: number }> = {
  simple: {
    label: 'Simples',
    description: 'Briefing claro, poucos elementos, tecnologia conhecida, cliente organizado',
    multiplier: 0.9,
  },
  standard: {
    label: 'Padrão',
    description: 'Complexidade típica do mercado para este tipo de serviço',
    multiplier: 1.0,
  },
  complex: {
    label: 'Complexo',
    description: 'Múltiplas variáveis, integração de sistemas, alto nível de pesquisa ou execução',
    multiplier: 1.3,
  },
  very_complex: {
    label: 'Muito Complexo',
    description: 'Projeto pioneiro, alto risco técnico ou criativo, equipe envolvida',
    multiplier: 1.6,
  },
}

// ─── Urgência ─────────────────────────────────────────────────────────────────

export type UrgencyLevel = 'relaxed' | 'normal' | 'urgent' | 'critical'

export const URGENCY_MULTIPLIERS: Record<UrgencyLevel, { label: string; description: string; multiplier: number }> = {
  relaxed: {
    label: 'Sem urgência',
    description: 'Prazo flexível, organização confortável da agenda',
    multiplier: 0.95,
  },
  normal: {
    label: 'Normal',
    description: 'Prazo razoável, sem pressão adicional',
    multiplier: 1.0,
  },
  urgent: {
    label: 'Urgente',
    description: 'Prazo apertado, reorganização necessária da agenda',
    multiplier: 1.3,
  },
  critical: {
    label: 'Crítico',
    description: 'Prazo impossível ou fim de semana / fora do horário comercial',
    multiplier: 1.7,
  },
}

// ─── Porte / Valor Estratégico do Cliente ─────────────────────────────────────

export type ClientSize = 'individual' | 'small_business' | 'medium' | 'large' | 'enterprise'

export const CLIENT_SIZE_MULTIPLIERS: Record<ClientSize, { label: string; description: string; multiplier: number }> = {
  individual: {
    label: 'Pessoa Física / Microempreendedor',
    description: 'Cliente individual, projeto pessoal ou de pequeno impacto financeiro',
    multiplier: 0.85,
  },
  small_business: {
    label: 'Pequena empresa',
    description: 'PME local, faturamento limitado, baixo risco de inadimplência',
    multiplier: 1.0,
  },
  medium: {
    label: 'Empresa média',
    description: 'Empresa consolidada, projeto com maior impacto comercial',
    multiplier: 1.2,
  },
  large: {
    label: 'Grande empresa',
    description: 'Corporação, campanha de amplo alcance ou alto impacto',
    multiplier: 1.5,
  },
  enterprise: {
    label: 'Multinacional / Enterprise',
    description: 'Projeto de escala nacional/global, alto retorno financeiro para o cliente',
    multiplier: 2.0,
  },
}

// ─── Direitos de Uso / Exclusividade ─────────────────────────────────────────

export type UsageRights = 'none' | 'limited' | 'extended' | 'exclusive'

export const USAGE_RIGHTS_MULTIPLIERS: Record<UsageRights, { label: string; description: string; multiplier: number }> = {
  none: {
    label: 'Uso pessoal / portfólio',
    description: 'Sem exploração comercial do material entregue',
    multiplier: 1.0,
  },
  limited: {
    label: 'Uso comercial limitado',
    description: 'Uso comercial por 1 a 2 anos, região ou canal específico',
    multiplier: 1.15,
  },
  extended: {
    label: 'Uso comercial amplo',
    description: 'Uso em múltiplos canais, período indeterminado, sem exclusividade',
    multiplier: 1.4,
  },
  exclusive: {
    label: 'Exclusividade total',
    description: 'Direitos exclusivos de uso e reprodução, vedado uso em concorrentes',
    multiplier: 1.8,
  },
}
