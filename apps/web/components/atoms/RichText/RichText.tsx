import React from 'react'
import type {
  PortableTextBlock,
  PortableTextComponents,
} from '@portabletext/react'
import { PortableText } from '@portabletext/react'

export enum RichTextSize {
  Md = 'md',
  Lg = 'lg',
  Xl = 'xl',
}

const sizeClassMap: Record<RichTextSize, string> = {
  [RichTextSize.Md]: 'text-body-md',
  [RichTextSize.Lg]: 'text-body-lg',
  [RichTextSize.Xl]: 'text-body-xl',
}

const buildBaseComponents = (size: RichTextSize): PortableTextComponents => ({
  block: {
    normal: ({ children }) => (
      <p
        className={`font-body ${sizeClassMap[size]} leading-relaxed text-black/70 dark:text-foreground/80`}
      >
        {children}
      </p>
    ),
  },
})

export type RichTextProps = {
  value: PortableTextBlock[]
  components?: PortableTextComponents
  size?: RichTextSize
  className?: string
}

export const RichText = ({
  value,
  components,
  size = RichTextSize.Xl,
  className,
}: RichTextProps) => {
  const baseComponents = buildBaseComponents(size)
  const resolvedComponents = components
    ? {
        ...baseComponents,
        ...components,
        block: { ...baseComponents.block, ...components.block },
      }
    : baseComponents

  if (className) {
    return (
      <div className={className}>
        <PortableText value={value} components={resolvedComponents} />
      </div>
    )
  }

  return <PortableText value={value} components={resolvedComponents} />
}

export default RichText
