'use client'
import { withNoSSR } from '@/components/hoc/with-no-ssr'

// Client-side lazy declarations for WebGL background components. `withNoSSR`
// (and the next/dynamic ssr:false call it wraps) must run inside the client
// module graph, so it is invoked here rather than in the server-component
// heroes that render these. Server components can render the results below,
// but cannot call withNoSSR() themselves.

export const ThreeBackgroundTunnel = withNoSSR(
  () => import('./ThreeBackgroundTunnel/ThreeBackgroundTunnel')
)

export const AboutBackgroundHelixPulseCascade = withNoSSR(
  () =>
    import('./AboutBackgroundHelixPulseCascade/AboutBackgroundHelixPulseCascade')
)
