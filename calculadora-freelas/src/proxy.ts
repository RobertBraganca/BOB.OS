import { type NextRequest } from 'next/server'
import { updateSession } from '@/shared/lib/middleware'

export async function proxy(request: NextRequest) {
  return updateSession(request)
}

export const config = {
  matcher: [
    /*
     * Roda em tudo, exceto assets estáticos e arquivos do Next —
     * inclui as rotas de API/auth para que a sessão seja sempre atualizada.
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
