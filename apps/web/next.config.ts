import type { NextConfig } from 'next'
import { withBotId } from 'botid/next/config'
import path from 'path'

const nextConfig: NextConfig = {
  // Set the workspace root for the monorepo
  outputFileTracingRoot: path.join(__dirname, '../../'),

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
      },
    ],
    // Sanity asset URLs are content-hashed, so a transform can never go stale.
    // Caching for a year avoids paying to re-optimize the same image.
    minimumCacheTTL: 31536000,
    // Next requires every quality used by next/image to be declared here.
    qualities: [75],
    formats: ['image/avif', 'image/webp'],
  },
}

export default withBotId(nextConfig)
