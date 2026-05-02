'use client'

import React from 'react'
import { motion, useReducedMotion } from 'framer-motion'

import { cn } from '@/utils/cn'

export interface ScaleInStaggerOwnProps {
  children?: React.ReactNode
  className?: string
  from?: number
  duration?: number
}

export type ScaleInStaggerProps<T extends React.ElementType = 'div'> = {
  as?: T
} & ScaleInStaggerOwnProps &
  Omit<React.ComponentPropsWithoutRef<T>, keyof ScaleInStaggerOwnProps | 'as'>

type MotionTagProps = Omit<React.HTMLAttributes<HTMLElement> & import('framer-motion').MotionProps, 'children'> & {
  children?: React.ReactNode
}

const ScaleInStagger = <T extends React.ElementType = 'div'>({
  as,
  children,
  className,
  from = 0.92,
  duration = 0.5,
  ...rest
}: ScaleInStaggerProps<T>) => {
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
              hidden: { opacity: 0, scale: from },
              visible: {
                opacity: 1,
                scale: 1,
                transition: { duration, ease: 'easeOut' },
              },
            }
      }
    >
      {children}
    </MotionTag>
  )
}

export default ScaleInStagger
export { ScaleInStagger }
