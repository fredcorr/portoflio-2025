'use client'

import React from 'react'
import { motion, useReducedMotion } from 'framer-motion'

import { cn } from '@/utils/cn'
import { SlideDirection } from './SlideDirection'

export { SlideDirection }

export interface SlideInStaggerOwnProps {
  children?: React.ReactNode
  className?: string
  direction?: SlideDirection
  distance?: number
  duration?: number
}

export type SlideInStaggerProps<T extends React.ElementType = 'div'> = {
  as?: T
} & SlideInStaggerOwnProps &
  Omit<React.ComponentPropsWithoutRef<T>, keyof SlideInStaggerOwnProps | 'as'>

const getOffset = (direction: SlideDirection, distance: number) => {
  switch (direction) {
    case SlideDirection.Up:
      return { x: 0, y: distance }
    case SlideDirection.Down:
      return { x: 0, y: -distance }
    case SlideDirection.Left:
      return { x: distance, y: 0 }
    case SlideDirection.Right:
      return { x: -distance, y: 0 }
  }
}

const SlideInStagger = <T extends React.ElementType = 'div'>({
  as,
  children,
  className,
  direction = SlideDirection.Up,
  distance = 24,
  duration = 0.5,
  ...rest
}: SlideInStaggerProps<T>) => {
  const shouldReduce = useReducedMotion()
  const MotionTag = React.useMemo(
    () => motion.create((as ?? 'div') as React.ElementType),
    [as]
  )
  const offset = getOffset(direction, distance)

  return (
    <MotionTag
      {...rest}
      className={cn(className)}
      variants={
        shouldReduce
          ? undefined
          : {
              hidden: { opacity: 0, ...offset },
              visible: {
                opacity: 1,
                x: 0,
                y: 0,
                transition: { duration, ease: 'easeOut' },
              },
            }
      }
    >
      {children}
    </MotionTag>
  )
}

export default SlideInStagger
export { SlideInStagger }
