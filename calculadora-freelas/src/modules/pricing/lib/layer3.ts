/**
 * Motor de Precificação — Camada 3
 * Ajuste de contexto e mercado
 *
 * Fórmula: Preço Final = Preço Base × Complexidade × Urgência × Porte × Direitos de Uso
 *          + Gross-up de impostos conforme regime tributário
 *
 * Fundamentado no PRD/SRS v1.0, seção 2.3 — Camada 3
 */

import {
  COMPLEXITY_MULTIPLIERS,
  URGENCY_MULTIPLIERS,
  CLIENT_SIZE_MULTIPLIERS,
  USAGE_RIGHTS_MULTIPLIERS,
  type ComplexityLevel,
  type UrgencyLevel,
  type ClientSize,
  type UsageRights,
} from './multipliers'
import { applyGrossUp, type TaxRegime } from './gross-up'

export interface Layer3Input {
  /** Preço base calculado na Camada 2 */
  basePrice: number
  /** Nível de complexidade do projeto */
  complexity: ComplexityLevel
  /** Nível de urgência */
  urgency: UrgencyLevel
  /** Porte / valor estratégico do cliente */
  clientSize: ClientSize
  /** Direitos de uso e exclusividade */
  usageRights: UsageRights
  /** Regime tributário do profissional */
  taxRegime: TaxRegime
  /** Margem adicional desejada sobre o preço ajustado (0 a 1) — padrão: 0 */
  extraMargin?: number
}

export interface QuoteResult {
  /** Preço mínimo (piso técnico da Camada 1 × horas estimadas) — nunca cobrar abaixo */
  minimum: number
  /** Preço recomendado (resultado completo das 3 camadas) */
  recommended: number
  /** Preço premium (percepção de alto valor — recommended × 1.3) */
  premium: number
  /** Breakdown completo dos multiplicadores */
  multiplierDetail: {
    complexity: { level: ComplexityLevel; multiplier: number; label: string }
    urgency: { level: UrgencyLevel; multiplier: number; label: string }
    clientSize: { level: ClientSize; multiplier: number; label: string }
    usageRights: { level: UsageRights; multiplier: number; label: string }
    combined: number
  }
  /** Informações do gross-up */
  taxDetail: {
    regime: TaxRegime
    rate: number
    taxAmount: number
  }
  /** Preço ajustado pelos multiplicadores, antes do gross-up */
  adjustedPrice: number
  /** Preço com gross-up, antes da margem extra */
  priceWithTax: number
  /** Margem extra aplicada */
  extraMarginAmount: number
}

export function calculateLayer3(input: Layer3Input, minimumPrice: number): QuoteResult {
  const { basePrice, complexity, urgency, clientSize, usageRights, taxRegime, extraMargin = 0 } = input

  // Multiplicadores individuais
  const complexityMultiplier = COMPLEXITY_MULTIPLIERS[complexity].multiplier
  const urgencyMultiplier = URGENCY_MULTIPLIERS[urgency].multiplier
  const clientSizeMultiplier = CLIENT_SIZE_MULTIPLIERS[clientSize].multiplier
  const usageRightsMultiplier = USAGE_RIGHTS_MULTIPLIERS[usageRights].multiplier

  // Multiplicador combinado
  const combinedMultiplier = complexityMultiplier * urgencyMultiplier * clientSizeMultiplier * usageRightsMultiplier

  // Preço ajustado pelos multiplicadores
  const adjustedPrice = basePrice * combinedMultiplier

  // Gross-up de impostos
  const grossUpResult = applyGrossUp(adjustedPrice, taxRegime)

  // Margem extra
  const extraMarginAmount = grossUpResult.grossPrice * extraMargin

  // Preço recomendado final
  const recommended = grossUpResult.grossPrice + extraMarginAmount

  // Preço premium (referência de valor percebido alto — 30% acima do recomendado)
  const premium = recommended * 1.3

  return {
    // Piso técnico real (Camada 1 × horas) — nunca é reescrito pelo recomendado,
    // mesmo quando os multiplicadores empurram o preço abaixo dele (ver `belowFloor`).
    minimum: minimumPrice,
    recommended,
    premium,
    multiplierDetail: {
      complexity: { level: complexity, multiplier: complexityMultiplier, label: COMPLEXITY_MULTIPLIERS[complexity].label },
      urgency: { level: urgency, multiplier: urgencyMultiplier, label: URGENCY_MULTIPLIERS[urgency].label },
      clientSize: { level: clientSize, multiplier: clientSizeMultiplier, label: CLIENT_SIZE_MULTIPLIERS[clientSize].label },
      usageRights: { level: usageRights, multiplier: usageRightsMultiplier, label: USAGE_RIGHTS_MULTIPLIERS[usageRights].label },
      combined: combinedMultiplier,
    },
    taxDetail: {
      regime: taxRegime,
      rate: grossUpResult.appliedRate,
      taxAmount: grossUpResult.taxAmount,
    },
    adjustedPrice,
    priceWithTax: grossUpResult.grossPrice,
    extraMarginAmount,
  }
}
