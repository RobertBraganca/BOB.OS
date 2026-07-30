'use client'

import * as React from 'react'
import Image from 'next/image'
import { useTheme } from 'next-themes'
import { cn } from '@/shared/lib/utils'

/**
 * Logo — wordmark BOB® (Brandboard v1.0). Nunca redesenhar — apenas trocar a variante de cor.
 * Sem variante forçada, segue o tema ativo: branco no dark (padrão do produto), preto no light.
 */

const ASPECT_RATIO = 779.01 / 476.47

interface LogoProps {
  height?: number
  variant?: 'red' | 'black' | 'white'
  className?: string
}

export function Logo({ height = 20, variant, className }: LogoProps) {
  const { resolvedTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  const resolvedVariant = variant ?? (mounted && resolvedTheme === 'light' ? 'black' : 'white')
  const width = Math.round(height * ASPECT_RATIO)

  return (
    <Image
      src={`/logo-${resolvedVariant}.svg`}
      alt="BOB.OS"
      width={width}
      height={height}
      style={{ height, width: 'auto' }}
      className={cn('flex-shrink-0', className)}
      priority
    />
  )
}
