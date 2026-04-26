import React from 'react'

/**
 * Minimum prop contract for polymorphic components that support the `as` prop.
 * Used as the slot type for animation components in molecules like Card.
 */
export interface PolymorphicProps {
  as?: React.ElementType
  children?: React.ReactNode
  className?: string
  href?: string
  'aria-label'?: string
}
