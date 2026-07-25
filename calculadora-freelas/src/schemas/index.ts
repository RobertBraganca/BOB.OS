import { z } from 'zod'

// ─── Profile Schema ───────────────────────────────────────────────────────────

export const ServiceAreaSchema = z.enum([
  'graphic_design',
  'photography',
  'motion',
  'video',
  'webdesign',
  'content',
  'other',
])

export type ServiceArea = z.infer<typeof ServiceAreaSchema>

export const SERVICE_AREA_LABELS: Record<ServiceArea, string> = {
  graphic_design: 'Design Gráfico',
  photography: 'Fotografia',
  motion: 'Motion Design',
  video: 'Vídeo / Videomaker',
  webdesign: 'Web Design / Dev',
  content: 'Criação de Conteúdo',
  other: 'Outra área',
}

export const ExperienceLevelSchema = z.enum(['beginner', 'intermediate', 'experienced', 'senior'])
export type ExperienceLevel = z.infer<typeof ExperienceLevelSchema>

export const EXPERIENCE_LABELS: Record<ExperienceLevel, { label: string; years: string }> = {
  beginner: { label: 'Iniciante', years: 'Até 2 anos' },
  intermediate: { label: 'Intermediário', years: '2 a 5 anos' },
  experienced: { label: 'Experiente', years: '5 a 10 anos' },
  senior: { label: 'Sênior / Referência', years: '10+ anos' },
}

export const TaxRegimeSchema = z.enum(['pf', 'mei', 'simples', 'lucro_presumido'])
export type TaxRegimeSchema = z.infer<typeof TaxRegimeSchema>

export const ProfileSchema = z.object({
  name: z.string().min(2, 'Nome precisa ter pelo menos 2 caracteres'),
  serviceArea: ServiceAreaSchema,
  experienceLevel: ExperienceLevelSchema,
  taxRegime: TaxRegimeSchema,
  city: z.string().optional(),
  state: z.string().optional(),
})

export type Profile = z.infer<typeof ProfileSchema>

// ─── Monthly Expenses Schema ──────────────────────────────────────────────────

export const ExpenseItemSchema = z.object({
  id: z.string(),
  label: z.string().min(1, 'Informe o nome da despesa'),
  amount: z.number().min(0, 'Valor deve ser positivo'),
  category: z.enum(['structure', 'software', 'equipment', 'taxes', 'other']),
})

export type ExpenseItem = z.infer<typeof ExpenseItemSchema>

export const EXPENSE_CATEGORY_LABELS = {
  structure: 'Estrutura (aluguel, internet, energia)',
  software: 'Softwares e assinaturas',
  equipment: 'Equipamentos (amortização mensal)',
  taxes: 'Impostos e contador',
  other: 'Outros',
}

export const MonthlyExpensesSchema = z.object({
  expenses: z.array(ExpenseItemSchema),
  desiredSalary: z.number().min(0, 'Informe o pró-labore desejado'),
  technicalReserve: z.number().min(0).default(0),
  profitMargin: z.number().min(0).max(1).default(0.15),
  availableHours: z.number().min(1).max(744).default(176),
  billablePercentage: z.number().min(10).max(100).default(60),
})

export type MonthlyExpenses = z.infer<typeof MonthlyExpensesSchema>

// ─── Quote Schema ─────────────────────────────────────────────────────────────

export const PricingMethodSchema = z.enum([
  'hourly',
  'daily',
  'fixed_scope',
  'value_based',
  'package',
  'retainer',
])

export const ComplexitySchema = z.enum(['simple', 'standard', 'complex', 'very_complex'])
export const UrgencySchema = z.enum(['relaxed', 'normal', 'urgent', 'critical'])
export const ClientSizeSchema = z.enum(['individual', 'small_business', 'medium', 'large', 'enterprise'])
export const UsageRightsSchema = z.enum(['none', 'limited', 'extended', 'exclusive'])

export const DirectCostSchema = z.object({
  id: z.string(),
  label: z.string().min(1),
  amount: z.number().min(0),
})

export const QuoteInputSchema = z.object({
  // Identificação
  projectName: z.string().min(1, 'Informe o nome do projeto'),
  serviceArea: ServiceAreaSchema,
  serviceDescription: z.string().optional(),

  // Método e tempo
  pricingMethod: PricingMethodSchema,
  estimatedHours: z.number().min(0.5, 'Mínimo de 30 minutos'),
  estimatedDays: z.number().min(0).optional(),
  revisions: z.number().min(0).max(20).default(2),

  // Multiplicadores
  complexity: ComplexitySchema,
  urgency: UrgencySchema,
  clientSize: ClientSizeSchema,
  usageRights: UsageRightsSchema,

  // Custos
  directCosts: z.array(DirectCostSchema).default([]),
  extraCosts: z.array(DirectCostSchema).default([]),

  // Margem extra
  extraMargin: z.number().min(0).max(1).default(0),
})

export type QuoteInput = z.infer<typeof QuoteInputSchema>
