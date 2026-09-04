import { redirect } from 'next/navigation'

/**
 * Sem landing pública: a plataforma é aberta (sem conta/login), então "/"
 * só encaminha direto para a ferramenta que o profissional realmente usa.
 */
export default function RootPage() {
  redirect('/calcular')
}
