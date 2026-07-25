/**
 * Motor de Precificação — Camada 1
 * Valor-hora real do profissional
 *
 * Fórmula: Valor-Hora Real = (Despesas Mensais + Pró-labore + Reserva Técnica + Margem de Lucro)
 *                             ÷ Horas Faturáveis Mensais
 *
 * Fundamentado no PRD/SRS v1.0, seção 2.2 e 2.3
 */

export interface Layer1Input {
  /** Soma de todas as despesas fixas mensais (estrutura, softwares, equipamentos amortizados, impostos, contador) */
  monthlyExpenses: number
  /** Remuneração desejada pelo profissional por mês */
  desiredSalary: number
  /** Reserva técnica / fundo de emergência mensal (ex.: 10% do pró-labore) */
  technicalReserve: number
  /** Margem de lucro desejada sobre o total (ex.: 15% = 0.15) */
  profitMargin: number
  /** Horas de trabalho disponíveis por mês (padrão: 176h = 22 dias × 8h) */
  availableHours: number
  /** Percentual de aproveitamento faturável (padrão sugerido: 60 = 60%) */
  billablePercentage: number
}

export interface Layer1Output {
  /** Horas efetivamente faturáveis no mês */
  billableHours: number
  /** Custo total mensal (despesas + pró-labore + reserva + margem) */
  totalMonthlyCost: number
  /** Valor-hora real (o piso — nunca cobrar abaixo disso) */
  realHourlyRate: number
  /** Breakdown da composição do custo mensal */
  breakdown: {
    expenses: number
    salary: number
    reserve: number
    profit: number
  }
}

export function calculateLayer1(input: Layer1Input): Layer1Output {
  const { monthlyExpenses, desiredSalary, technicalReserve, profitMargin, availableHours, billablePercentage } = input

  // Horas faturáveis reais (nunca assumir 100% de aproveitamento — PRD 2.2)
  const billableHours = availableHours * (billablePercentage / 100)

  // Custo base antes da margem
  const baseCost = monthlyExpenses + desiredSalary + technicalReserve

  // Margem de lucro aplicada sobre o custo base
  const profitAmount = baseCost * profitMargin

  // Custo total mensal que precisa ser coberto
  const totalMonthlyCost = baseCost + profitAmount

  // Valor-hora real: custo total ÷ horas faturáveis
  const realHourlyRate = billableHours > 0 ? totalMonthlyCost / billableHours : 0

  return {
    billableHours,
    totalMonthlyCost,
    realHourlyRate,
    breakdown: {
      expenses: monthlyExpenses,
      salary: desiredSalary,
      reserve: technicalReserve,
      profit: profitAmount,
    },
  }
}

/**
 * Cenários de valor-hora (PRD RF-08)
 * Conservador: 50% de aproveitamento
 * Padrão: 60% de aproveitamento
 * Otimista: 70% de aproveitamento
 */
export function calculateHourlyRateScenarios(input: Omit<Layer1Input, 'billablePercentage'>) {
  return {
    conservative: calculateLayer1({ ...input, billablePercentage: 50 }),
    standard: calculateLayer1({ ...input, billablePercentage: 60 }),
    optimistic: calculateLayer1({ ...input, billablePercentage: 70 }),
  }
}
