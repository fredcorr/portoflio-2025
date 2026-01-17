import React from 'react'

import type { SvgProps } from './ArrowUpRight'

export const Sparkle = ({ title, ...props }: SvgProps) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.6"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden={title ? undefined : true}
    role={title ? 'img' : 'presentation'}
    {...props}
  >
    {title ? <title>{title}</title> : null}
    <path d="M12 3.5 14 10l6.5 2-6.5 2L12 21l-2-6.5L3.5 12 10 10 12 3.5Z" />
    <path d="M5 5 6.5 7.5 9 9 6.5 10.5 5 13 3.5 10.5 1 9l2.5-1.5L5 5Z" />
    <path d="M19 5 20 7l2 1-2 1-1 2-1-2-2-1 2-1 1-2Z" />
  </svg>
)

export default Sparkle
