import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // Otimização de imagens
  images: {
    formats: ['image/avif', 'image/webp'],
  },

  // Headers de segurança (PRD seção 6 — RNF)
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-XSS-Protection', value: '1; mode=block' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
          // HSTS — PRD seção 6.2 (habilitado em produção)
          ...(process.env.NODE_ENV === 'production' ? [{
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          }] : []),
        ],
      },
    ]
  },
}

export default nextConfig
