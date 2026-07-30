'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/shared/components/ui/button'
import { Input } from '@/shared/components/ui/input'
import { AlertTriangle } from 'lucide-react'
import { createClient } from '@/shared/lib/client'

export default function RedefinirSenhaPage() {
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (password.length < 6) {
      setError('A senha precisa ter pelo menos 6 caracteres.')
      return
    }
    if (password !== confirmPassword) {
      setError('As senhas não coincidem.')
      return
    }

    setLoading(true)
    const supabase = createClient()
    const { error: authError } = await supabase.auth.updateUser({ password })
    setLoading(false)

    if (authError) {
      setError(authError.message)
      return
    }

    router.push('/dashboard')
    router.refresh()
  }

  return (
    <div className="flex flex-col gap-[22px]">
      <div className="flex flex-col gap-2">
        <span className="label-uppercase text-[var(--color-brand-red)]">Recuperar acesso</span>
        <h1 className="text-display-md text-[var(--color-text)]">Defina uma nova senha</h1>
      </div>

      {error && (
        <div className="flex items-start gap-2.5 p-3.5 bg-[var(--color-brand-red)]/10 border border-[var(--color-brand-red)]/30 rounded-[var(--radius-md)]">
          <AlertTriangle size={16} className="text-[var(--color-brand-red)] flex-shrink-0 mt-0.5" />
          <span className="text-xs leading-relaxed text-[var(--color-text)]">{error}</span>
        </div>
      )}

      <form className="flex flex-col gap-[14px]" onSubmit={handleSubmit}>
        <Input
          type="password"
          label="Nova senha"
          placeholder="••••••••"
          autoComplete="new-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="h-[46px]"
          id="reset-password"
        />
        <Input
          type="password"
          label="Confirmar nova senha"
          placeholder="••••••••"
          autoComplete="new-password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="h-[46px]"
          id="reset-password-confirm"
        />
        <Button type="submit" size="lg" loading={loading} className="w-full h-12 mt-1">
          Salvar nova senha
        </Button>
      </form>
    </div>
  )
}
