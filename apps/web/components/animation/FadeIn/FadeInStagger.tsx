'use client'

import React from 'react'
import { motion, useReducedMotion } from 'framer-motion'

import { cn } from '@/utils/cn'

export interface FadeInStaggerOwnProps {
  children?: React.ReactNode
  className?: string
  duration?: number
}

export type FadeInStaggerProps<T extends React.ElementType = 'div'> = {
  as?: T
} & FadeInStaggerOwnProps &
  Omit<React.ComponentPropsWithoutRef<T>, keyof FadeInStaggerOwnProps | 'as'>

type MotionTagProps = Omit<React.HTMLAttributes<HTMLElement> & import('framer-motion').MotionProps, 'children'> & {
  children?: React.ReactNode
}

const FadeInStagger = <T extends React.ElementType = 'div'>({
  as,
  children,
  className,
  duration = 0.5,
  ...rest
}: FadeInStaggerProps<T>) => {
  const shouldReduce = useReducedMotion()
  const MotionTag = React.useMemo(
    () => motion.create((as ?? 'div') as React.ElementType) as React.ComponentType<MotionTagProps>,
    [as]
  )

  return (
    <MotionTag
      {...(rest as MotionTagProps)}
      className={cn(className)}
      variants={
        shouldReduce
          ? undefined
          : {
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: { duration, ease: 'easeOut' },
              },
            }
      }
    >
      {children}
    </MotionTag>
  )
}

export default FadeInStagger
export { FadeInStagger }
