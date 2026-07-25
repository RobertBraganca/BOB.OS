import React from 'react'

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-[var(--color-bg)] flex">
      {/* Coluna esquerda — statement editorial */}
      <div
        className="hidden lg:flex flex-col justify-between w-1/2 bg-[var(--color-brand-red)] p-12"
        aria-hidden="true"
      >
        <div className="flex items-center gap-2">
          <span className="font-display font-900 text-2xl uppercase tracking-tight text-white">BOB.OS</span>
        </div>

        <div className="flex flex-col gap-6">
          <blockquote className="text-display-lg text-white leading-none">
            Precifique com fundamento.<br />
            <span className="text-black">Não no sentimento.</span>
          </blockquote>
          <p className="text-sm text-white/70 max-w-sm leading-relaxed">
            Sistema Operacional de Precificação para Profissionais Criativos.
            Motor de cálculo em 3 camadas que mostra o que você realmente precisa cobrar.
          </p>
        </div>

        <div className="flex flex-col gap-1">
          <span className="text-xs text-white/50 uppercase tracking-wider font-600">BEEKOFF®</span>
          <span className="text-xs text-white/30">Sistema Operacional de Precificação · V1</span>
        </div>
      </div>

      {/* Coluna direita — formulário */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-sm">
          {children}
        </div>
      </div>
    </div>
  )
}
