import { createClient } from '@/shared/lib/client'
import type { ComplexityLevel, PricingMethod, TaxRegime, UrgencyLevel, ClientSize, UsageRights, QuoteResult } from './index'

export interface PricingEventInput {
  benchmarkId: string | null
  pricingMethod: PricingMethod
  estimatedHours: number
  revisions: number
  complexity: ComplexityLevel
  urgency: UrgencyLevel
  clientSize: ClientSize
  usageRights: UsageRights
  taxRegime: TaxRegime
  hourlyRate: number
  basePrice: number
  quote: QuoteResult
}

/**
 * Envia um evento anônimo de cálculo concluído, usado como dado semente do
 * benchmark de mercado. Só deve ser chamado quando o usuário ativou
 * "Contribuir com dados de mercado" em Configurações — nunca inclui user_id,
 * nome, e-mail ou qualquer dado do cliente do orçamento. Falha em silêncio:
 * isso é telemetria opcional, não deve travar o fluxo de salvar a proposta.
 */
export async function submitPricingEvent(input: PricingEventInput): Promise<void> {
  try {
    const supabase = createClient()
    await supabase.from('pricing_events').insert({
      benchmark_id: input.benchmarkId,
      pricing_method: input.pricingMethod,
      estimated_hours: input.estimatedHours,
      revisions: input.revisions,
      complexity: input.complexity,
      urgency: input.urgency,
      client_size: input.clientSize,
      usage_rights: input.usageRights,
      tax_regime: input.taxRegime,
      real_hourly_rate: input.hourlyRate,
      base_price: input.basePrice,
      minimum_price: input.quote.minimum,
      recommended_price: input.quote.recommended,
      premium_price: input.quote.premium,
      combined_multiplier: input.quote.multiplierDetail.combined,
    })
  } catch {
    // Telemetria opcional — nunca deve quebrar o fluxo do usuário.
  }
}
