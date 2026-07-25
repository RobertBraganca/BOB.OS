/**
 * Motor de Precificação — Camada 2
 * Preço base do projeto
 *
 * Fórmula: Preço Base = (Tempo Estimado × Valor-Hora Real) + Custos Diretos + Custos Extras
 *
 * Fundamentado no PRD/SRS v1.0, seção 2.3 — Camada 2
 */

export type PricingMethod =
  | 'hourly'       // Valor/hora — ajustes pontuais, consultorias
  | 'daily'        // Diária — fotografia, filmagem em locação
  | 'fixed_scope'  // Escopo fechado — logos, sites, landing pages
  | 'value_based'  // Baseado em valor — consultoria estratégica, branding
  | 'package'      // Pacotes — social media, produção de conteúdo
  | 'retainer'     // Mensalidade — tráfego, manutenção, consultoria contínua

export interface DirectCost {
  label: string
  amount: number
}

export interface Layer2Input {
  /** Valor-hora real calculado na Camada 1 */
  realHourlyRate: number
  /** Método de precificação selecionado */
  pricingMethod: PricingMethod
  /** Horas estimadas para o projeto */
  estimatedHours: number
  /** Número de dias (para método diária) */
  estimatedDays?: number
  /** Valor da diária (para método diária) */
  dailyRate?: number
  /** Número de revisões inclusas */
  revisions: number
  /** Horas extras estimadas por revisão adicional */
  hoursPerRevision?: number
  /** Custos diretos: equipamentos, deslocamento, terceiros, licenças etc. */
  directCosts: DirectCost[]
  /** Custos extras pontuais */
  extraCosts: DirectCost[]
}

export interface Layer2Output {
  /** Custo de mão de obra (horas × valor-hora) */
  laborCost: number
  /** Custo de revisões */
  revisionCost: number
  /** Soma de todos os custos diretos */
  totalDirectCosts: number
  /** Soma de todos os custos extras */
  totalExtraCosts: number
  /** Preço base total antes dos multiplicadores de Camada 3 */
  basePrice: number
  /** Breakdown para exibição */
  breakdown: {
    labor: number
    revisions: number
    direct: number
    extras: number
  }
}

export function calculateLayer2(input: Layer2Input): Layer2Output {
  const {
    realHourlyRate,
    pricingMethod,
    estimatedHours,
    estimatedDays,
    dailyRate,
    revisions,
    hoursPerRevision = 1,
    directCosts,
    extraCosts,
  } = input

  // Custo de mão de obra baseado no método
  let laborCost = 0

  switch (pricingMethod) {
    case 'hourly':
    case 'fixed_scope':
    case 'value_based':
      laborCost = estimatedHours * realHourlyRate
      break

    case 'daily':
      // Para diárias, usa o dailyRate se definido, senão calcula por horas
      if (dailyRate && estimatedDays) {
        laborCost = dailyRate * estimatedDays
      } else {
        laborCost = estimatedHours * realHourlyRate
      }
      break

    case 'package':
    case 'retainer':
      // Pacotes e retainers: horas mensais × valor-hora
      laborCost = estimatedHours * realHourlyRate
      break
  }

  // Custo adicional de revisões (além das inclusas no escopo)
  // As revisões inclusas já estão nas horas estimadas; este é um custo de segurança
  const revisionCost = revisions > 0 ? revisions * hoursPerRevision * realHourlyRate * 0.5 : 0

  // Custos diretos e extras
  const totalDirectCosts = directCosts.reduce((sum, c) => sum + c.amount, 0)
  const totalExtraCosts = extraCosts.reduce((sum, c) => sum + c.amount, 0)

  // Preço base total
  const basePrice = laborCost + revisionCost + totalDirectCosts + totalExtraCosts

  return {
    laborCost,
    revisionCost,
    totalDirectCosts,
    totalExtraCosts,
    basePrice,
    breakdown: {
      labor: laborCost,
      revisions: revisionCost,
      direct: totalDirectCosts,
      extras: totalExtraCosts,
    },
  }
}
