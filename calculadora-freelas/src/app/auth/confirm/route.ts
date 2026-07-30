import { type EmailOtpType } from '@supabase/supabase-js'
import { type NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/shared/lib/server'

/**
 * Callback do link de confirmação de e-mail (signup) e de recuperação de senha
 * enviado pelo Supabase Auth.
 *
 * Suporta os dois formatos que o Supabase pode gerar aqui:
 * - `token_hash` + `type`: exige template de e-mail customizado (SMTP próprio)
 *   apontando para esta rota — verificado via `verifyOtp`.
 * - `code`: formato do template PADRÃO do Supabase (sem precisar de SMTP
 *   customizado) — o link vai primeiro para `/auth/v1/verify` do próprio
 *   Supabase, que já confirma o token e redireciona pra cá com `?code=...`,
 *   trocado aqui por sessão via `exchangeCodeForSession`.
 */
export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const token_hash = searchParams.get('token_hash')
  const type = searchParams.get('type') as EmailOtpType | null
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/onboarding'

  const supabase = await createClient()

  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) {
      return NextResponse.redirect(`${origin}${next}`)
    }
  }

  if (token_hash && type) {
    const { error } = await supabase.auth.verifyOtp({ type, token_hash })
    if (!error) {
      return NextResponse.redirect(`${origin}${next}`)
    }
  }

  return NextResponse.redirect(`${origin}/login?error=confirm`)
}
