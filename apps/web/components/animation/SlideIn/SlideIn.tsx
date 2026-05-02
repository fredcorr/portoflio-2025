'use client'

import React from 'react'
import { motion, MotionProps, useReducedMotion } from 'framer-motion'

import { cn } from '@/utils/cn'
import { SlideInStagger } from './SlideInStagger'
import { SlideDirection } from './SlideDirection'

export { SlideDirection }

export interface SlideInOwnProps {
  children: React.ReactNode
  className?: string
  direction?: SlideDirection
  distance?: number
  duration?: number
  delay?: number
  viewport?: MotionProps['viewport']
}

export type SlideInProps<T extends React.ElementType = 'div'> = {
  as?: T
} & SlideInOwnProps &
  Omit<React.ComponentPropsWithoutRef<T>, keyof SlideInOwnProps | 'as'>

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

type MotionTagProps = Omit<React.HTMLAttributes<HTMLElement> & MotionProps, 'children'> & {
  children?: React.ReactNode
}

const SlideIn = <T extends React.ElementType = 'div'>({
  as,
  children,
  className,
  direction = SlideDirection.Up,
  distance = 24,
  duration = 0.5,
  delay = 0,
  viewport = { once: true },
  ...rest
}: SlideInProps<T>) => {
  const shouldReduce = useReducedMotion()
  const MotionTag = React.useMemo(
    () => motion.create((as ?? 'div') as React.ElementType) as React.ComponentType<MotionTagProps>,
    [as]
  )
  const offset = getOffset(direction, distance)

  return (
    <MotionTag
      {...(rest as MotionTagProps)}
      className={cn(className)}
      initial={shouldReduce ? false : { opacity: 0, ...offset }}
      whileInView={shouldReduce ? undefined : { opacity: 1, x: 0, y: 0 }}
      viewport={viewport}
      transition={{ duration, delay, ease: 'easeOut' }}
    >
      {children}
    </MotionTag>
  )
}

interface SlideInComponent {
  <T extends React.ElementType = 'div'>(
    props: SlideInProps<T>
  ): React.ReactElement | null
  Stagger: typeof SlideInStagger
}

const SlideInWithStagger = Object.assign(SlideIn, {
  Stagger: SlideInStagger,
}) as SlideInComponent

export default SlideInWithStagger
export { SlideInWithStagger as SlideIn }
