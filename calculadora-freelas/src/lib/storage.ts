import type {
  TaxRegime,
  PricingMethod,
  ComplexityLevel,
  UrgencyLevel,
  ClientSize,
  UsageRights,
  FullCalculationResult,
} from '@/lib/pricing'
import type { compareQuoteWithBenchmark } from '@/lib/pricing/adegraf'

/**
 * Persistência local (MVP sem backend — RF-* do PRD dependem destes dados
 * estarem disponíveis entre /custos, /perfil, /calcular e /dashboard).
 */

export interface SavedExpense {
  id: string
  label: string
  amount: number
  category: string
}

export interface SavedCosts {
  expenses: SavedExpense[]
  desiredSalary: number
  technicalReserve: number
  /** Percentual (0-100), não fração — mesma convenção da tela /custos */
  profitMargin: number
  availableHours: number
  billablePercentage: number
}

export interface SavedProfile {
  serviceArea: string
  taxRegime: TaxRegime
}

export interface SavedProposalForm {
  projectName: string
  benchmarkId: string
  pricingMethod: PricingMethod
  estimatedHours: number
  revisions: number
  complexity: ComplexityLevel
  urgency: UrgencyLevel
  clientSize: ClientSize
  usageRights: UsageRights
  directCosts: { id: string; label: string; amount: number }[]
  extraMargin: number
}

export interface SavedProposal {
  id: string
  projectName: string
  /** Data formatada para exibição (pt-BR) */
  date: string
  /** ISO 8601 — usado para agrupar por mês no gráfico de pipeline */
  createdAt: string
  clientName?: string
  form: SavedProposalForm
  result: FullCalculationResult
  benchmark: ReturnType<typeof compareQuoteWithBenchmark>
}

export interface Prefs {
  /** Arredonda preços finais para múltiplos de R$ 10 nas propostas e no resultado. */
  roundValues: boolean
  /** Mostra os blocos de benchmark ADG Brasil no dashboard e no cálculo. */
  showBenchmark: boolean
  /** Persistência automática (sempre true nesta versão — não há modo offline puro). */
  autosave: boolean
}

export const DEFAULT_PREFS: Prefs = {
  roundValues: false,
  showBenchmark: true,
  autosave: true,
}

const COSTS_KEY = 'bob_costs'
const PROFILE_KEY = 'bob_profile'
const PROPOSAL_KEY = 'bob_last_proposal'
const PROPOSALS_LIST_KEY = 'bob_proposals'
const ONBOARDED_KEY = 'bob_onboarded'
const PREFS_KEY = 'bob_prefs'

/** Existe alguma configuração de custos salva pelo usuário (distinto de mostrar os padrões). */
export function hasSavedCosts(): boolean {
  if (typeof window === 'undefined') return false
  return localStorage.getItem(COSTS_KEY) !== null
}

export function isOnboarded(): boolean {
  if (typeof window === 'undefined') return false
  return localStorage.getItem(ONBOARDED_KEY) === '1'
}

export function markOnboarded() {
  localStorage.setItem(ONBOARDED_KEY, '1')
}

export function loadPrefs(): Prefs {
  if (typeof window === 'undefined') return DEFAULT_PREFS
  const raw = localStorage.getItem(PREFS_KEY)
  if (!raw) return DEFAULT_PREFS
  try {
    return { ...DEFAULT_PREFS, ...JSON.parse(raw) }
  } catch {
    return DEFAULT_PREFS
  }
}

export function savePrefs(prefs: Prefs) {
  localStorage.setItem(PREFS_KEY, JSON.stringify(prefs))
}

/** Limpa custos, perfil, propostas e status de onboarding — mantém a sessão de login. */
export function eraseAllData() {
  localStorage.removeItem(COSTS_KEY)
  localStorage.removeItem(PROFILE_KEY)
  localStorage.removeItem(PROPOSAL_KEY)
  localStorage.removeItem(PROPOSALS_LIST_KEY)
  localStorage.removeItem(ONBOARDED_KEY)
  localStorage.removeItem(PREFS_KEY)
}

/** Custos padrão exibidos em /custos até o usuário salvar os próprios. */
export const DEFAULT_COSTS: SavedCosts = {
  expenses: [
    { id: '1', label: 'Internet', amount: 150, category: 'structure' },
    { id: '2', label: 'Adobe Creative Cloud', amount: 300, category: 'software' },
  ],
  desiredSalary: 5000,
  technicalReserve: 500,
  profitMargin: 15,
  availableHours: 176,
  billablePercentage: 60,
}

export function totalMonthlyExpenses(costs: SavedCosts): number {
  return costs.expenses.reduce((sum, e) => sum + e.amount, 0)
}

export function loadCosts(): SavedCosts {
  if (typeof window === 'undefined') return DEFAULT_COSTS
  const raw = localStorage.getItem(COSTS_KEY)
  if (!raw) return DEFAULT_COSTS
  try {
    return { ...DEFAULT_COSTS, ...JSON.parse(raw) }
  } catch {
    return DEFAULT_COSTS
  }
}

export function saveCosts(costs: SavedCosts) {
  localStorage.setItem(COSTS_KEY, JSON.stringify(costs))
}

export function loadProfile(): SavedProfile | null {
  if (typeof window === 'undefined') return null
  const raw = localStorage.getItem(PROFILE_KEY)
  if (!raw) return null
  try {
    return JSON.parse(raw)
  } catch {
    return null
  }
}

export function saveProfile(profile: SavedProfile) {
  localStorage.setItem(PROFILE_KEY, JSON.stringify(profile))
}

export function loadLastProposal(): SavedProposal | null {
  if (typeof window === 'undefined') return null
  const raw = localStorage.getItem(PROPOSAL_KEY)
  if (!raw) return null
  try {
    return JSON.parse(raw)
  } catch {
    return null
  }
}

/** Salva a proposta como "última gerada" (documento A4) e a acrescenta ao histórico do pipeline. */
export function saveLastProposal(proposal: SavedProposal) {
  localStorage.setItem(PROPOSAL_KEY, JSON.stringify(proposal))
  const list = loadProposals()
  localStorage.setItem(PROPOSALS_LIST_KEY, JSON.stringify([proposal, ...list]))
}

export function loadProposals(): SavedProposal[] {
  if (typeof window === 'undefined') return []
  const raw = localStorage.getItem(PROPOSALS_LIST_KEY)
  if (!raw) return []
  try {
    return JSON.parse(raw)
  } catch {
    return []
  }
}

export function deleteProposal(id: string) {
  const list = loadProposals().filter((p) => p.id !== id)
  localStorage.setItem(PROPOSALS_LIST_KEY, JSON.stringify(list))
}

export function getProposalById(id: string): SavedProposal | null {
  return loadProposals().find((p) => p.id === id) ?? null
}

/** Backup completo dos dados do usuário — usado em Configurações › Exportar backup JSON. */
export function exportBackupJSON(): string {
  return JSON.stringify(
    {
      exportedAt: new Date().toISOString(),
      costs: loadCosts(),
      profile: loadProfile(),
      proposals: loadProposals(),
      prefs: loadPrefs(),
    },
    null,
    2
  )
}
