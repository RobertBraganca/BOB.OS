'use client'

import * as React from 'react'
import { Moon, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'
import { Button } from '@/shared/components/ui/button'

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  // Avoid hydration mismatch
  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <Button variant="ghost" size="sm" className="w-9 px-0" aria-label="Alternar tema">
        <span className="w-4 h-4" />
      </Button>
    )
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      className="w-9 px-0 text-[var(--color-text-secondary)] hover:text-[var(--color-text)] transition-colors"
      aria-label="Alternar tema"
    >
      {theme === 'dark' ? (
        <Sun size={16} className="transition-all scale-100 rotate-0" />
      ) : (
        <Moon size={16} className="transition-all scale-100 rotate-0" />
      )}
    </Button>
  )
}
