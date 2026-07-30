import type { Metadata, Viewport } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: {
    default: 'BOB.OS — Calculadora de Freelas',
    template: '%s | BOB.OS',
  },
  description:
    'Sistema Operacional de Precificação para Profissionais Criativos. Calcule seu valor-hora real, monte orçamentos defensáveis e gere propostas comerciais com metodologia profissional.',
  keywords: [
    'calculadora de freelas',
    'precificação freelancer',
    'valor hora designer',
    'orçamento freelancer',
    'designer gráfico',
    'fotógrafo freelancer',
    'motion designer',
  ],
  authors: [{ name: 'O DESIGNER BOB®', url: 'https://odesignerbob.com.br' }],
  creator: 'O DESIGNER BOB®',
  openGraph: {
    title: 'BOB.OS — Calculadora de Freelas',
    description: 'Precifique com segurança técnica e comercial. Motor de cálculo em 3 camadas para profissionais criativos.',
    type: 'website',
    locale: 'pt_BR',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export const viewport: Viewport = {
  themeColor: '#080808',
  colorScheme: 'dark',
  width: 'device-width',
  initialScale: 1,
}

import { ThemeProvider } from '@/shared/providers/theme-provider'
import { Geist } from "next/font/google";
import { cn } from "@/shared/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});


export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR" suppressHydrationWarning className={cn("font-sans", geist.variable)}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Barlow:ital,wght@0,400;0,500;0,600;0,700;0,800;0,900;1,700;1,800;1,900&family=Barlow+Condensed:ital,wght@0,400;0,500;0,600;0,700;0,800;0,900;1,700;1,800;1,900&family=Inter:ital,opsz,wght@0,14..32,300;0,14..32,400;0,14..32,500;0,14..32,600;0,14..32,700;1,14..32,400&family=JetBrains+Mono:ital,wght@0,400;0,500;0,600;0,700;1,400&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}

