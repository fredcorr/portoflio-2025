'use client'
import dynamic from 'next/dynamic'
import type { ComponentType } from 'react'

export function withNoSSR<T extends object>(
  loader: () => Promise<{ default: ComponentType<T> }>
): ComponentType<T> {
  return dynamic(loader, { ssr: false }) as ComponentType<T>
}
