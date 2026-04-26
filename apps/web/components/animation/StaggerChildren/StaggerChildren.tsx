'use client'

import React from 'react'
import { motion, useReducedMotion, type Variants } from 'framer-motion'

import { cn } from '@/utils/cn'

export interface StaggerChildrenOwnProps {
  children: React.ReactNode
  className?: string
  staggerDelay?: number
  delay?: number
  once?: boolean
  amount?: number
}

export type StaggerChildrenProps<T extends React.ElementType = 'ul'> = {
  as?: T
} & StaggerChildrenOwnProps &
  Omit<React.ComponentPropsWithoutRef<T>, keyof StaggerChildrenOwnProps | 'as'>

const StaggerChildren = <T extends React.ElementType = 'ul'>({
  as,
  children,
  className,
  staggerDelay = 0.1,
  delay = 0,
  once = true,
  amount = 0.5,
  ...rest
}: StaggerChildrenProps<T>) => {
  const shouldReduce = useReducedMotion()
  const MotionParent = React.useMemo(
    () => motion.create((as ?? 'ul') as React.ElementType),
    [as]
  )

  const containerVariants: Variants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: staggerDelay,
        delayChildren: delay,
      },
    },
  }

  if (shouldReduce) {
    return (
      <MotionParent {...rest} className={cn(className)}>
        {children}
      </MotionParent>
    )
  }

  return (
    <MotionParent
      {...rest}
      className={cn(className)}
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, amount }}
    >
      {children}
    </MotionParent>
  )
}

export default StaggerChildren
export { StaggerChildren }
