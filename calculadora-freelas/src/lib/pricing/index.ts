/**
 * Motor de Precificação — Orquestrador
 *
 * Interface unificada que executa as 3 camadas em sequência
 * e retorna o resultado completo do orçamento.
 *
 * Fundamentado no PRD/SRS v1.0, seções 2.2, 2.3 e RF-01 a RF-18
 */

export { calculateLayer1, calculateHourlyRateScenarios } from './layer1'
export type { Layer1Input, Layer1Output } from './layer1'

export { calculateLayer2 } from './layer2'
export type { Layer2Input, Layer2Output, DirectCost, PricingMethod } from './layer2'

export { calculateLayer3 } from './layer3'
export type { Layer3Input, QuoteResult } from './layer3'

export { applyGrossUp, TAX_RATES } from './gross-up'
export type { TaxRegime, GrossUpResult } from './gross-up'

export {
  COMPLEXITY_MULTIPLIERS,
  URGENCY_MULTIPLIERS,
  CLIENT_SIZE_MULTIPLIERS,
  USAGE_RIGHTS_MULTIPLIERS,
} from './multipliers'
export type {
  ComplexityLevel,
  UrgencyLevel,
  ClientSize,
  UsageRights,
} from './multipliers'

import { calculateLayer1, type Layer1Input } from './layer1'
import { calculateLayer2, type Layer2Input } from './layer2'
import { calculateLayer3, type Layer3Input, type QuoteResult } from './layer3'

export interface FullCalculationInput {
  layer1: Layer1Input
  layer2: Omit<Layer2Input, 'realHourlyRate'>
  layer3: Omit<Layer3Input, 'basePrice'>
}

export interface FullCalculationResult {
  hourlyRate: number
  billableHours: number
  totalMonthlyCost: number
  basePrice: number
  quote: QuoteResult
  /** Alerta: o preço recomendado está abaixo do piso técnico? */
  belowFloor: boolean
}

/**
 * Executa o cálculo completo nas 3 camadas em sequência.
 * Retorna o resultado integrado incluindo alerta de preço abaixo do piso.
 *
 * PRD — Critério de Aceite: "O sistema nunca permite visualizar ou exportar
 * um preço abaixo do piso (Camada 1) sem alerta explícito ao usuário."
 */
export function calculateFullQuote(input: FullCalculationInput): FullCalculationResult {
  // Camada 1: Valor-hora real
  const l1 = calculateLayer1(input.layer1)

  // Piso técnico: valor-hora real × horas estimadas
  const minimumPrice = l1.realHourlyRate * input.layer2.estimatedHours

  // Camada 2: Preço base do projeto
  const l2 = calculateLayer2({ ...input.layer2, realHourlyRate: l1.realHourlyRate })

  // Camada 3: Ajuste de contexto e resultado em 3 faixas
  const quote = calculateLayer3({ ...input.layer3, basePrice: l2.basePrice }, minimumPrice)

  // Alerta: verifica se o recomendado está abaixo do piso técnico (nunca deve ocorrer em uso normal)
  const belowFloor = quote.recommended < minimumPrice

  return {
    hourlyRate: l1.realHourlyRate,
    billableHours: l1.billableHours,
    totalMonthlyCost: l1.totalMonthlyCost,
    basePrice: l2.basePrice,
    quote,
    belowFloor,
  }
}
