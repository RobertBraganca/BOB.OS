/**
 * Gross-up tributário por regime
 *
 * Calcula o preço final ajustado para que os impostos sejam absorvidos
 * pelo preço cobrado do cliente, não descontados do lucro do profissional.
 *
 * Fórmula gross-up: Preço Final = Preço Antes do Imposto ÷ (1 - Alíquota)
 *
 * Fundamentado no PRD/SRS v1.0, seção 2.3 (Camada 3) e RF-14
 */

export type TaxRegime = 'pf' | 'mei' | 'simples' | 'lucro_presumido'

/**
 * Alíquotas efetivas médias para gross-up por regime tributário.
 *
 * IMPORTANTE: Estas são alíquotas de referência para o cálculo de gross-up.
 * O profissional deve sempre consultar seu contador para alíquotas exatas,
 * pois variam conforme faturamento, atividade e faixa do Simples Nacional.
 */
export const TAX_RATES: Record<TaxRegime, {
  label: string
  rate: number
  description: string
  disclaimer: string
}> = {
  pf: {
    label: 'Pessoa Física (IRPF)',
    rate: 0.275,
    description: 'Alíquota máxima do IRPF (27.5%) — conservadora para PF sem deduções',
    disclaimer: 'Alíquota efetiva pode ser menor com deduções. Consulte seu contador.',
  },
  mei: {
    label: 'MEI',
    rate: 0.06,
    description: 'DAS do MEI — baixa carga tributária, mas com limitação de faturamento',
    disclaimer: 'Válido enquanto dentro do limite anual do MEI (R$ 81.000/ano).',
  },
  simples: {
    label: 'Simples Nacional',
    rate: 0.115,
    description: 'Alíquota média do Anexo III (serviços) — varia de 6% a 15.5%',
    disclaimer: 'Alíquota varia por faixa de faturamento e atividade. Use seu DAS real.',
  },
  lucro_presumido: {
    label: 'PJ — Lucro Presumido',
    rate: 0.1333,
    description: 'Carga total aproximada: IRPJ (4.8%) + CSLL (2.88%) + PIS (0.65%) + COFINS (3%) + ISS (2%) ≈ 13.33%',
    disclaimer: 'Carga pode variar. Consulte sua contabilidade.',
  },
}

export interface GrossUpResult {
  /** Preço antes do gross-up (o que o profissional quer receber líquido) */
  netPrice: number
  /** Valor dos impostos embutidos no preço */
  taxAmount: number
  /** Preço final a cobrar do cliente (com impostos incluídos) */
  grossPrice: number
  /** Alíquota aplicada */
  appliedRate: number
  /** Regime tributário */
  regime: TaxRegime
}

/**
 * Calcula o gross-up: ajusta o preço para que os impostos sejam cobertos
 * sem reduzir o lucro desejado pelo profissional.
 */
export function applyGrossUp(netPrice: number, regime: TaxRegime): GrossUpResult {
  const { rate } = TAX_RATES[regime]

  // Gross-up: divide pelo complemento da alíquota
  // Ex.: quero R$ 100 líquido com 27.5% de imposto → R$ 100 ÷ (1 - 0.275) = R$ 137.93
  const grossPrice = netPrice / (1 - rate)
  const taxAmount = grossPrice - netPrice

  return {
    netPrice,
    taxAmount,
    grossPrice,
    appliedRate: rate,
    regime,
  }
}
