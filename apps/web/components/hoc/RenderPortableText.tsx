import React from 'react'
import type { PortableTextBlock, PortableTextComponents } from '@portabletext/react'
import { PortableText } from '@portabletext/react'
import { Emphasis } from '@/components/atoms/Emphasis/Emphasis'

export enum RichTextSize {
  Md = 'md',
  Lg = 'lg',
  Xl = 'xl',
  XXl = 'xxl',
}

const sizeClassMap: Record<RichTextSize, string> = {
  [RichTextSize.Md]: 'text-body-md',
  [RichTextSize.Lg]: 'text-body-lg',
  [RichTextSize.Xl]: 'text-body-xl',
  [RichTextSize.XXl]: 'text-heading-4',
}

const buildDefaultComponents = (size: RichTextSize): PortableTextComponents => {
  const sizeClass = sizeClassMap[size]
  return {
    block: {
      normal: ({ children }) => (
        <p className={`font-body ${sizeClass} leading-relaxed mb-6 last:mb-0`}>
          {children}
        </p>
      ),
    },
    marks: {
      em: ({ children }) => <Emphasis>{children}</Emphasis>,
      strong: ({ children }) => (
        <strong className="font-semibold">{children}</strong>
      ),
    },
    list: {
      bullet: ({ children }) => (
        <ul className={`list-disc pl-6 mb-6 space-y-1.5 font-body ${sizeClass}`}>
          {children}
        </ul>
      ),
      number: ({ children }) => (
        <ol className={`list-decimal pl-6 mb-6 space-y-1.5 font-body ${sizeClass}`}>
          {children}
        </ol>
      ),
    },
    listItem: {
      bullet: ({ children }) => (
        <li className="leading-relaxed">{children}</li>
      ),
      number: ({ children }) => (
        <li className="leading-relaxed">{children}</li>
      ),
    },
  }
}

const mergeComponents = (
  defaults: PortableTextComponents,
  overrides?: PortableTextComponents
): PortableTextComponents => {
  if (!overrides) return defaults
  return {
    ...defaults,
    ...overrides,
    block: {
      ...(defaults.block as Record<string, unknown>),
      ...(overrides.block as Record<string, unknown>),
    } as PortableTextComponents['block'],
    marks: {
      ...(defaults.marks as Record<string, unknown>),
      ...(overrides.marks as Record<string, unknown>),
    } as PortableTextComponents['marks'],
    list: {
      ...(defaults.list as Record<string, unknown>),
      ...(overrides.list as Record<string, unknown>),
    } as PortableTextComponents['list'],
    listItem: {
      ...(defaults.listItem as Record<string, unknown>),
      ...(overrides.listItem as Record<string, unknown>),
    } as PortableTextComponents['listItem'],
  }
}

export interface RenderPortableTextProps {
  value: PortableTextBlock[]
  components?: PortableTextComponents
  size?: RichTextSize
}

export const RenderPortableText = ({
  value,
  components,
  size = RichTextSize.Xl,
}: RenderPortableTextProps) => {
  const resolved = mergeComponents(buildDefaultComponents(size), components)
  return <PortableText value={value} components={resolved} />
}

export default RenderPortableText
