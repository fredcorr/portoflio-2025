import React from 'react'
import NextImage from 'next/image'

import { cn } from '@/utils/cn'

export interface ImageProps {
  src: string
  alt: string
  width?: number
  height?: number
  sizes?: string
  priority?: boolean
  fill?: boolean
  className?: string
  wrapperClassName?: string
}

const DEFAULT_WIDTH = 1200
const DEFAULT_HEIGHT = 900

export const Image = ({
  src,
  alt,
  width,
  height,
  sizes,
  priority,
  fill,
  className,
  wrapperClassName,
}: ImageProps) => {
  const resolvedWidth = fill ? undefined : (width ?? DEFAULT_WIDTH)
  const resolvedHeight = fill ? undefined : (height ?? DEFAULT_HEIGHT)

  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-[32px]',
        wrapperClassName
      )}
    >
      <NextImage
        src={src}
        alt={alt}
        fill={fill}
        width={resolvedWidth}
        height={resolvedHeight}
        sizes={sizes ?? '(min-width: 1024px) 560px, 100vw'}
        priority={priority}
        className={cn('size-full object-cover', className)}
      />
    </div>
  )
}

export default Image
