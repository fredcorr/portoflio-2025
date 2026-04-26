'use client'

import React from 'react'
import { motion, MotionProps, useReducedMotion } from 'framer-motion'

import { cn } from '@/utils/cn'
import { ScaleInStagger } from './ScaleInStagger'

export interface ScaleInOwnProps {
  children?: React.ReactNode
  className?: string
  from?: number
  duration?: number
  delay?: number
  viewport?: MotionProps['viewport']
}

export type ScaleInProps<T extends React.ElementType = 'div'> = {
  as?: T
} & ScaleInOwnProps &
  Omit<React.ComponentPropsWithoutRef<T>, keyof ScaleInOwnProps | 'as'>

const ScaleIn = <T extends React.ElementType = 'div'>({
  as,
  children,
  className,
  from = 0.92,
  duration = 0.5,
  delay = 0,
  viewport = { once: true },
  ...rest
}: ScaleInProps<T>) => {
  const shouldReduce = useReducedMotion()
  const MotionTag = React.useMemo(
    () => motion.create((as ?? 'div') as React.ElementType),
    [as]
  )

  return (
    <MotionTag
      {...rest}
      className={cn(className)}
      initial={shouldReduce ? false : { opacity: 0, scale: from }}
      whileInView={shouldReduce ? undefined : { opacity: 1, scale: 1 }}
      viewport={viewport}
      transition={{ duration, delay, ease: 'easeOut' }}
    >
      {children}
    </MotionTag>
  )
}

interface ScaleInComponent {
  <T extends React.ElementType = 'div'>(
    props: ScaleInProps<T>
  ): React.ReactElement | null
  Stagger: typeof ScaleInStagger
}

const ScaleInWithStagger = Object.assign(ScaleIn, {
  Stagger: ScaleInStagger,
}) as ScaleInComponent

export default ScaleInWithStagger
export { ScaleInWithStagger as ScaleIn }
