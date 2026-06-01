'use client'
import dynamic from 'next/dynamic'

export function withNoSSR<T extends object>(
  loader: () => Promise<{ default: React.ComponentType<T> }>
) {
  return dynamic<T>(loader, { ssr: false })
}
