import React from 'react'
import { cn } from '../../utils/cn'

export interface ImageComponentProps {
  src: string
  alt: string
  width?: number
  height?: number
  sizes?: string
  priority?: boolean
  fill?: boolean
  className?: string
}

export interface ImageProps extends ImageComponentProps {
  wrapperClassName?: string
  ImageComponent?: React.ComponentType<ImageComponentProps>
}

const DEFAULT_WIDTH = 1200
const DEFAULT_HEIGHT = 900

const NativeImage = ({
  src, alt, width, height, sizes, priority, fill, className,
}: ImageComponentProps) => (
  <img
    src={src}
    alt={alt}
    width={fill ? undefined : width}
    height={fill ? undefined : height}
    sizes={sizes}
    loading={priority ? 'eager' : 'lazy'}
    className={className}
  />
)

export const Image = ({
  src, alt, width, height, sizes, priority, fill,
  className, wrapperClassName,
  ImageComponent = NativeImage,
}: ImageProps) => (
  <div className={cn('relative overflow-hidden', wrapperClassName)}>
    <ImageComponent
      src={src}
      alt={alt}
      width={fill ? undefined : (width ?? DEFAULT_WIDTH)}
      height={fill ? undefined : (height ?? DEFAULT_HEIGHT)}
      sizes={sizes ?? '(min-width: 1024px) 560px, 100vw'}
      priority={priority}
      fill={fill}
      className={cn('size-full object-cover', className)}
    />
  </div>
)

export default Image
