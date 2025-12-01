import React from 'react'

export interface ConditionalWrapperProps {
  condition: boolean
  wrapper: (children: React.ReactNode) => React.ReactElement
  children: React.ReactNode
}

export const ConditionalWrapper = ({
  condition,
  wrapper,
  children,
}: ConditionalWrapperProps) => {
  if (!condition) {
    return <>{children}</>
  }

  return wrapper(children)
}

export default ConditionalWrapper
