import type { NextConfig } from 'next'
import { withBotId } from 'botid/next/config'
import path from 'path'

const nextConfig: NextConfig = {
  // Set the workspace root for the monorepo
  outputFileTracingRoot: path.join(__dirname, '../../'),

  // ==========================================================================
  // TEMPORARY WORKAROUND — added 2026-08-07, delete when Vercel fixes this.
  //
  // WHAT   Opts out of Next 16.3's immutable static assets
  //        (/_next/static/immutable/*), reverting to pre-16.3 asset naming.
  //
  // WHY    Vercel's Preview Comments injects its toolbar script by patching
  //        deployed static files. It cannot patch a file declared immutable,
  //        so every preview deploy dies with
  //        IMMUTABLE_STATIC_PATCH_PREVIEW_COMMENTS. Note the *build* succeeds
  //        and only the deploy step fails, which makes this easy to
  //        misdiagnose as a build problem. Vercel's own hint ("upgrade to
  //        next@v16.3.0-canary.32 or newer") is wrong — 16.3.0 stable already
  //        exceeds that prerelease.
  //
  // COST   We give up the CDN win: fewer requests and bytes, better TTFB for
  //        repeat visitors across deploys. Nothing breaks — this is exactly
  //        how the site behaved on 16.2.
  //
  // REMOVE Delete this line, push, and see whether the preview deploys. If it
  //        fails with the same error, Vercel hasn't fixed it yet — put it
  //        back. Two-minute test, no production risk.
  //
  // ALT    Turning off the Vercel Toolbar for this project also fixes it and
  //        keeps the CDN win, but costs the whole toolbar (a11y and perf
  //        audits included), not just comments. Rejected for that reason.
  // ==========================================================================
  supportsImmutableAssets: false,

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
