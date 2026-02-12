import React from 'react'

import PageTransitionBoundary from '@/components/hoc/PageTransitionBoundary'

export interface WithPageTransitionOptions {
  className?: string
  animationClassName?: string
}

type TransitionableComponent<Props> = (
  props: Props
) => React.ReactNode | Promise<React.ReactNode>

export const withPageTransition = <Props extends object>(
  Component: TransitionableComponent<Props>,
  options?: WithPageTransitionOptions
) => {
  const WrappedWithPageTransition = async (props: Props) => {
    const content = await Component(props)

    return (
      <PageTransitionBoundary
        className={options?.className}
        animationClassName={options?.animationClassName}
      >
        {content}
      </PageTransitionBoundary>
    )
  }

  const componentName = Component.name || 'Component'
  WrappedWithPageTransition.displayName = `withPageTransition(${componentName})`

  return WrappedWithPageTransition
}

export default withPageTransition
