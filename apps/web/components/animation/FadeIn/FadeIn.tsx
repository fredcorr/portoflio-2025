'use client'

import React from 'react'
import { motion, MotionProps, useReducedMotion } from 'framer-motion'

export interface FadeInOwnProps extends Pick<MotionProps, 'viewport'> {
  children?: React.ReactNode
  className?: string
  duration?: number
  delay?: number
}

export type FadeInProps<T extends React.ElementType = 'div'> = {
  as?: T
} & FadeInOwnProps &
  Omit<React.ComponentPropsWithoutRef<T>, keyof FadeInOwnProps | 'as'>

type MotionTagProps = Omit<
  React.HTMLAttributes<HTMLElement> & MotionProps,
  'children'
> & {
  children?: React.ReactNode
}

const FadeIn = <T extends React.ElementType = 'div'>({
  as,
  children,
  className,
  duration = 0.5,
  delay = 0,
  viewport = {
    once: true,
    amount: 0.2,
  },
  ...rest
}: FadeInProps<T>) => {
  const shouldReduce = useReducedMotion()
  const MotionTag = React.useMemo(
    () =>
      motion.create(
        (as ?? 'div') as React.ElementType
      ) as React.ComponentType<MotionTagProps>,
    [as]
  )

  return (
    <MotionTag
      {...(rest as MotionTagProps)}
      className={className}
      initial={shouldReduce ? false : { opacity: 0 }}
      whileInView={shouldReduce ? undefined : { opacity: 1 }}
      viewport={viewport}
      transition={{ duration, delay, ease: 'easeOut' }}
    >
      {children}
    </MotionTag>
  )
}

export default FadeIn
export { FadeIn }
