/**
 * BOB.OS — Base de Referência de Mercado (ADG Brasil / Adegraf)
 * 
 * Implementação dos requisitos RF-09 e RF-17 do PRD/SRS v1.0.
 * IMPORTANTE (PRD 2.5): As tabelas de referência não são valores oficiais nem trava de cálculo.
 * Sua função no produto é exclusivamente comparativa: calibrar faixas por categoria e dar confiança.
 */

export interface BenchmarkService {
  id: string
  name: string
  category: 'design_grafico' | 'branding' | 'web_ui' | 'motion_video' | 'fotografia' | 'conteudo'
  categoryLabel: string
  defaultMethod: 'fixed_scope' | 'hourly' | 'daily' | 'value_based' | 'package' | 'retainer'
  minRate: number       // Valor mínimo de mercado (piso de referência)
  maxRate: number       // Valor máximo comum para agências/sênior
  recommendedRate: number // Média praticada por plenos/estabelecidos
  unit: 'projeto' | 'hora' | 'diaria' | 'mes'
  description: string
}

export const ADEGRAF_BENCHMARKS: BenchmarkService[] = [
  // ─── Branding & Identidade Visual ──────────────────────────────────────────
  {
    id: 'id_completa',
    name: 'Identidade Visual Completa (Logo, Manual e Aplicações)',
    category: 'branding',
    categoryLabel: 'Branding & Identidade Visual',
    defaultMethod: 'fixed_scope',
    minRate: 3500,
    recommendedRate: 6800,
    maxRate: 15000,
    unit: 'projeto',
    description: 'Pesquisa, estratégia de marca, design de logo, manual de identidade visual (20+ páginas) e até 5 aplicações primárias.'
  },
  {
    id: 'logo_basico',
    name: 'Redesign ou Logo Avulso (com guia rápido)',
    category: 'branding',
    categoryLabel: 'Branding & Identidade Visual',
    defaultMethod: 'fixed_scope',
    minRate: 1800,
    recommendedRate: 3200,
    maxRate: 6500,
    unit: 'projeto',
    description: 'Desenvolvimento ou refinamento de símbolo/tipografia de marca com guia resumido de uso e paleta de cores.'
  },
  {
    id: 'naming_estrategia',
    name: 'Naming e Estratégia de Marca (Posicionamento)',
    category: 'branding',
    categoryLabel: 'Branding & Identidade Visual',
    defaultMethod: 'value_based',
    minRate: 4000,
    recommendedRate: 8500,
    maxRate: 20000,
    unit: 'projeto',
    description: 'Diagnóstico de mercado, criação de nome de marca (com viabilidade INPI), manifesto e tom de voz.'
  },

  // ─── Web Design & UI/UX ───────────────────────────────────────────────────
  {
    id: 'site_institucional',
    name: 'Site Institucional Completo (UI/UX + Responsive, 5-8 páginas)',
    category: 'web_ui',
    categoryLabel: 'Web Design & UI/UX',
    defaultMethod: 'fixed_scope',
    minRate: 4500,
    recommendedRate: 8500,
    maxRate: 18000,
    unit: 'projeto',
    description: 'Arquitetura de informação, wireframe, design UI de alta fidelidade e versão mobile otimizada (sem dev).'
  },
  {
    id: 'landing_page',
    name: 'Landing Page de Alta Conversão (Single Page UI)',
    category: 'web_ui',
    categoryLabel: 'Web Design & UI/UX',
    defaultMethod: 'fixed_scope',
    minRate: 1800,
    recommendedRate: 3500,
    maxRate: 7000,
    unit: 'projeto',
    description: 'Estruturação estratégica de conversão (copy storytelling + design UI imersivo e responsivo).'
  },
  {
    id: 'app_design',
    name: 'UI/UX Design de Aplicativo (MVP — até 15 telas)',
    category: 'web_ui',
    categoryLabel: 'Web Design & UI/UX',
    defaultMethod: 'value_based',
    minRate: 6000,
    recommendedRate: 12000,
    maxRate: 28000,
    unit: 'projeto',
    description: 'Fluxos de navegação, design system em Figma e protótipo navegável para teste ou hand-off técnico.'
  },

  // ─── Design Gráfico & Editorial ───────────────────────────────────────────
  {
    id: 'apresentacao_pitch',
    name: 'Pitch Deck / Apresentação Institucional (até 20 slides)',
    category: 'design_grafico',
    categoryLabel: 'Design Gráfico & Editorial',
    defaultMethod: 'fixed_scope',
    minRate: 1500,
    recommendedRate: 3000,
    maxRate: 6000,
    unit: 'projeto',
    description: 'Design editorial de impacto, infografia e diagramação de slides para investidores ou clientes de alto valor.'
  },
  {
    id: 'embalagem_rótulo',
    name: 'Design de Embalagem / Rótulo de Produto (Linha única)',
    category: 'design_grafico',
    categoryLabel: 'Design Gráfico & Editorial',
    defaultMethod: 'fixed_scope',
    minRate: 2500,
    recommendedRate: 5000,
    maxRate: 12000,
    unit: 'projeto',
    description: 'Conceito visual, faca técnica, fechamento de arquivo para impressão e render 3D de apresentação.'
  },
  {
    id: 'editorial_relatorio',
    name: 'Projeto Editorial / Relatório Anual (por página)',
    category: 'design_grafico',
    categoryLabel: 'Design Gráfico & Editorial',
    defaultMethod: 'fixed_scope',
    minRate: 80,
    recommendedRate: 150,
    maxRate: 350,
    unit: 'projeto',
    description: 'Grid editorial, hierarquia tipográfica, infográficos e tratamento de imagens (valor unitário por página diagramada).'
  },

  // ─── Motion & Vídeo ───────────────────────────────────────────────────────
  {
    id: 'motion_explainer',
    name: 'Vídeo Manifesto / Explainer em Motion 2D (até 60s)',
    category: 'motion_video',
    categoryLabel: 'Motion Design & Vídeo',
    defaultMethod: 'fixed_scope',
    minRate: 3000,
    recommendedRate: 6500,
    maxRate: 14000,
    unit: 'projeto',
    description: 'Storyboard, animação vetorial, sound design básico e sincronia de locução.'
  },
  {
    id: 'reels_motion',
    name: 'Pacote de Animações Curtas / Reels Motion (4 unidades)',
    category: 'motion_video',
    categoryLabel: 'Motion Design & Vídeo',
    defaultMethod: 'package',
    minRate: 1600,
    recommendedRate: 3200,
    maxRate: 6500,
    unit: 'projeto',
    description: 'Animações verticais dinâmicas para redes sociais de alto engajamento (15s a 30s cada).'
  },

  // ─── Fotografia ───────────────────────────────────────────────────────────
  {
    id: 'foto_diaria_locacao',
    name: 'Diária de Fotografia em Locação (Publicidade / Corporativo)',
    category: 'fotografia',
    categoryLabel: 'Fotografia & Produção',
    defaultMethod: 'daily',
    minRate: 1800,
    recommendedRate: 3500,
    maxRate: 8000,
    unit: 'diaria',
    description: 'Até 8h de captação em locação, direção de cena (não inclui tratamento avançado avulso nem cessão nacional ilimitada).'
  },
  {
    id: 'foto_produto_estudio',
    name: 'Fotografia de Produto Still em Estúdio (por pack 15 fotos)',
    category: 'fotografia',
    categoryLabel: 'Fotografia & Produção',
    defaultMethod: 'package',
    minRate: 1500,
    recommendedRate: 2800,
    maxRate: 5500,
    unit: 'projeto',
    description: 'Iluminação de estúdio, captação still de produto, recorte e tratamento de imagem básico.'
  },

  // ─── Social Media & Recorrência ───────────────────────────────────────────
  {
    id: 'social_media_retainer',
    name: 'Direção de Arte / Design Social Media (Retainer Mensal - 12 posts)',
    category: 'conteudo',
    categoryLabel: 'Social Media & Recorrência',
    defaultMethod: 'retainer',
    minRate: 2000,
    recommendedRate: 3800,
    maxRate: 7500,
    unit: 'mes',
    description: 'Criação de linha editorial visual, design de carrosséis e cards mensais para marca autoridade.'
  },
  {
    id: 'consultoria_hora',
    name: 'Consultoria Técnica / Diagnóstico Visual (Hora avulsa)',
    category: 'branding',
    categoryLabel: 'Branding & Identidade Visual',
    defaultMethod: 'hourly',
    minRate: 250,
    recommendedRate: 450,
    maxRate: 950,
    unit: 'hora',
    description: 'Análise técnica de design, feedback de portfólio, direcionamento de equipe ou consultoria de marca.'
  },
]

/**
 * Retorna todos os serviços organizados por categoria para exibição em seletores
 */
export function getServicesByCategory() {
  const categories = new Map<string, { label: string; services: BenchmarkService[] }>()
  
  for (const s of ADEGRAF_BENCHMARKS) {
    if (!categories.has(s.category)) {
      categories.set(s.category, { label: s.categoryLabel, services: [] })
    }
    categories.get(s.category)!.services.push(s)
  }

  return Array.from(categories.values())
}

/**
 * Busca um serviço de referência por ID
 */
export function getBenchmarkServiceById(id: string): BenchmarkService | undefined {
  return ADEGRAF_BENCHMARKS.find(s => s.id === id)
}

/**
 * Analisa como o orçamento calculado do profissional se compara à tabela Adegraf/ADG Brasil
 */
export function compareQuoteWithBenchmark(quoteAmount: number, benchmarkId: string) {
  const service = getBenchmarkServiceById(benchmarkId)
  if (!service) return null

  const diffFromRecommended = ((quoteAmount - service.recommendedRate) / service.recommendedRate) * 100
  const isBelowMin = quoteAmount < service.minRate
  const isAboveMax = quoteAmount > service.maxRate
  const isInRange = quoteAmount >= service.minRate && quoteAmount <= service.maxRate

  let status: 'below' | 'recommended' | 'premium' | 'above' = 'recommended'
  let statusText = 'Dentro da média de mercado para plenos e estabelecidos'

  if (isBelowMin) {
    status = 'below'
    statusText = 'Abaixo da faixa de referência inicial (piso ADG/Adegraf)'
  } else if (quoteAmount > service.recommendedRate * 1.2 && quoteAmount <= service.maxRate) {
    status = 'premium'
    statusText = 'Faixa superior de mercado (autoridade técnica / alto impacto)'
  } else if (isAboveMax) {
    status = 'above'
    statusText = 'Acima do teto comum (projeto de alta complexidade ou grande empresa)'
  }

  return {
    service,
    diffPercent: Math.round(diffFromRecommended),
    status,
    statusText,
    isBelowMin,
    isAboveMax,
    isInRange,
  }
}
