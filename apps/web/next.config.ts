import type { NextConfig } from 'next'
import path from 'path'

// Used to restrict which origins can embed this site in an iframe.
// Must be set to the deployed Studio URL in production (e.g. https://portoflio-2025-studio.vercel.app).
const studioUrl = process.env.SANITY_STUDIO_URL || 'http://localhost:3333'

const nextConfig: NextConfig = {
  // Set the workspace root for the monorepo
  outputFileTracingRoot: path.join(__dirname, '../../'),

  headers: async () => [
    {
      source: '/:path*',
      headers: [
        // Override Next.js 16's default X-Frame-Options: deny.
        // Modern browsers prefer the CSP frame-ancestors directive below
        // and ignore this header when both are present.
        { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
        // Only allow the configured Sanity Studio to embed this site in an
        // iframe (for the Presentation Tool). No wildcards.
        {
          key: 'Content-Security-Policy',
          value: `frame-ancestors 'self' ${studioUrl}`,
        },
      ],
    },
  ],

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
      },
    ],
  },
  redirects: () => {
    return [
      {
        source: '/journals',
        destination: '/',
        permanent: true,
      },
    ]
  }
}

export default nextConfig
