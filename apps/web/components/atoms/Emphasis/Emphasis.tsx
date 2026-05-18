import React from 'react'

export const Emphasis = ({ children }: { children?: React.ReactNode }) => (
  <em className="italic bg-black/[0.08] dark:bg-white/[0.12] px-1 py-0.5 rounded-sm">
    {children}
  </em>
)

export default Emphasis
