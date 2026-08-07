import type { NextConfig } from 'next'
import path from 'path'

const nextConfig: NextConfig = {
  // Set the workspace root for the monorepo
  outputFileTracingRoot: path.join(__dirname, '../../'),

  // Next 16.3 emits content-addressed assets under /_next/static/immutable/*
  // and enables this by default. Vercel's Preview Comments injects its script
  // by patching deployed static files, which it cannot do to files declared
  // immutable — every preview deploy fails with
  // IMMUTABLE_STATIC_PATCH_PREVIEW_COMMENTS. Opting out restores preview
  // deploys at the cost of the CDN caching win.
  // Remove this once Vercel supports both together.
  supportsImmutableAssets: false,

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
      },
    ],
  },
}

export default nextConfig
