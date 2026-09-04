'use server'

/**
 * Motor de Precificação — Server Actions
 *
 * Ponto único por onde um componente cliente pede um cálculo. As fórmulas
 * (layer1/2/3, gross-up, multiplicadores) vivem só neste lado do servidor —
 * o Next.js compila cada função abaixo como uma RPC stub no cliente, nunca
 * envia o corpo delas (o "código por trás") para o navegador.
 *
 * Sem debounce por tecla: cada Action aqui é para ser chamada em `onBlur`
 * de campo ou em clique de ação (avançar etapa, salvar, adicionar/remover
 * item) — nunca a cada tecla digitada.
 */

import { calculateLayer1, calculateHourlyRateScenarios, type Layer1Input } from './layer1'
import { calculateLayer2, type Layer2Input } from './layer2'
import { calculateLayer3, type Layer3Input, type QuoteResult } from './layer3'
import { compareQuoteWithBenchmark } from './adegraf'

export async function calculateLayer1Action(input: Layer1Input) {
  return calculateLayer1(input)
}

export async function calculateHourlyRateScenariosAction(input: Omit<Layer1Input, 'billablePercentage'>) {
  return calculateHourlyRateScenarios(input)
}

export interface FullQuoteInput {
  layer1: Layer1Input
  layer2: Omit<Layer2Input, 'realHourlyRate'>
  layer3: Omit<Layer3Input, 'basePrice'>
  /** Serviço da tabela ADG Brasil a comparar, se o usuário tiver escolhido um. */
  benchmarkId?: string | null
}

export interface FullQuoteResult {
  hourlyRate: number
  billableHours: number
  totalMonthlyCost: number
  basePrice: number
  /** Breakdown da Camada 2 — para exibir a composição do preço e para o documento de proposta. */
  laborCost: number
  revisionCost: number
  totalDirectCosts: number
  quote: QuoteResult
  /** Alerta: o preço recomendado está abaixo do piso técnico? */
  belowFloor: boolean
  benchmark: ReturnType<typeof compareQuoteWithBenchmark> | null
}

/** Executa as 3 camadas em sequência e devolve o orçamento completo — mesma composição de `calculateFullQuote` (index.ts), agora do lado do servidor. */
export async function calculateFullQuoteAction(input: FullQuoteInput): Promise<FullQuoteResult> {
  const l1 = calculateLayer1(input.layer1)

  const minimumPrice = l1.realHourlyRate * input.layer2.estimatedHours

  const l2 = calculateLayer2({ ...input.layer2, realHourlyRate: l1.realHourlyRate })

  const quote = calculateLayer3({ ...input.layer3, basePrice: l2.basePrice }, minimumPrice)

  const belowFloor = quote.recommended < minimumPrice

  const benchmark = input.benchmarkId ? compareQuoteWithBenchmark(quote.recommended, input.benchmarkId) : null

  return {
    hourlyRate: l1.realHourlyRate,
    billableHours: l1.billableHours,
    totalMonthlyCost: l1.totalMonthlyCost,
    basePrice: l2.basePrice,
    laborCost: l2.laborCost,
    revisionCost: l2.revisionCost,
    totalDirectCosts: l2.totalDirectCosts,
    quote,
    belowFloor,
    benchmark,
  }
}
