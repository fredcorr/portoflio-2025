import React from 'react'
import type { PullQuote as PullQuoteProps } from '@portfolio/types/components'

const PullQuote: React.FC<PullQuoteProps> = ({ text, attribution }) => (
  <figure className="my-12 border-l-2 border-black pl-6 dark:border-foreground">
    <blockquote className="font-heading text-xl font-normal leading-snug tracking-tight text-balance text-black dark:text-foreground">
      {text}
    </blockquote>
    {attribution && (
      <figcaption className="mt-3 font-body text-sm text-black/55 dark:text-foreground/55">
        — {attribution}
      </figcaption>
    )}
  </figure>
)

export default PullQuote
