import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { Logo } from '@/shared/components/ui/logo'

export default function TermosPage() {
  return (
    <div className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text)] flex flex-col items-center px-6 py-16">
      <div className="w-full max-w-2xl flex flex-col gap-8">
        <Link href="/" className="flex items-center gap-2.5 w-fit">
          <Logo height={22} />
        </Link>

        <div className="flex flex-col gap-3">
          <span className="label-uppercase text-[var(--color-brand-red)]">Documento legal</span>
          <h1 className="text-display-md text-[var(--color-text)]">Termos de Uso</h1>
          <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">
            Esta página está em elaboração. O motor de cálculo do BOB.OS (Camadas 1, 2 e 3) é
            100% gratuito no MVP, sem necessidade de cartão de crédito. Os termos completos de
            uso serão publicados antes do lançamento público do produto.
          </p>
        </div>

        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm font-600 text-[var(--color-brand-red)] hover:brightness-110 transition-all w-fit"
        >
          <ArrowLeft size={15} />
          Voltar para o início
        </Link>
      </div>
    </div>
  )
}
