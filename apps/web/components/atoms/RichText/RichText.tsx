import React from 'react'
import type { PortableTextBlock, PortableTextComponents } from '@portabletext/react'
import { RenderPortableText } from '@/components/hoc/RenderPortableText'

export enum RichTextSize {
  Md = 'md',
  Lg = 'lg',
  Xl = 'xl',
  XXl = 'xxl',
}

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
  if (className) {
    return (
      <div className={className}>
        <RenderPortableText value={value} components={components} size={size} />
      </div>
    )
  }

  return <RenderPortableText value={value} components={components} size={size} />
}

export default RichText
