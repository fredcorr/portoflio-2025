import React from 'react'

export interface SvgProps extends React.SVGProps<SVGSVGElement> {
  title?: string
}

export const ArrowUpRight = ({ title, ...props }: SvgProps) => (
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
    <path d="M7 17 17 7" />
    <path d="M10 7h7v7" />
  </svg>
)

export default ArrowUpRight
