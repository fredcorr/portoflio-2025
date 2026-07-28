import React, { HTMLAttributes, ReactNode } from 'react'

const headingLevels = [1, 2, 3, 4, 5, 6] as const

export type HeadingLevel = (typeof headingLevels)[number]
export type HeadingTag = `h${HeadingLevel}`

export const clampHeadingLevel = (level?: number | null): HeadingLevel => {
  const normalized = Math.round(level ?? 2)
  const clampedIndex =
    Math.min(Math.max(normalized, 1), headingLevels.length) - 1

  return headingLevels[clampedIndex]
}

export const toHeadingTag = (level?: number | null): HeadingTag =>
  `h${clampHeadingLevel(level)}`

type HeadingProps = {
  level?: number | HeadingLevel | null
  children: ReactNode
} & HTMLAttributes<HTMLHeadingElement>

export const Heading = ({ level, children, ...props }: HeadingProps) => {
  const Tag = `h${clampHeadingLevel(level)}` as HeadingTag

  return <Tag {...props}>{children}</Tag>
}
