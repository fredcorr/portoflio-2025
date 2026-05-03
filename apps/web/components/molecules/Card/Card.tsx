'use client'

import React from 'react'
import type { PortableTextBlock } from '@portabletext/react'
import Link from 'next/link'

import Image from '@/components/atoms/Image/Image'
import RichText, { RichTextSize } from '@/components/atoms/RichText/RichText'
import Icon from '@/components/atoms/Icon/Icon'
import { cn } from '@/utils/cn'
import { normalizePortableText } from '@/utils/portableText'
import { SanityImage } from '@portfolio/types/sanity'
import { PolymorphicProps } from '@/types'

export enum CardTitleSize {
  Small = 'small',
  Medium = 'medium',
  Large = 'large',
}

export enum CardSpacing {
  Compact = 'compact',
  Cozy = 'cozy',
  Roomy = 'roomy',
  Spacious = 'spacious',
}

const titleSizeClassMap: Record<CardTitleSize, string> = {
  [CardTitleSize.Small]: 'text-heading-5',
  [CardTitleSize.Medium]: 'text-heading-4',
  [CardTitleSize.Large]: 'text-heading-3',
}

const articleSpacingMap: Record<CardSpacing, string> = {
  [CardSpacing.Compact]: 'gap-3',
  [CardSpacing.Cozy]: 'gap-4',
  [CardSpacing.Roomy]: 'gap-6',
  [CardSpacing.Spacious]: 'gap-8',
}

const contentSpacingMap: Record<CardSpacing, string> = {
  [CardSpacing.Compact]: 'gap-2',
  [CardSpacing.Cozy]: 'gap-3',
  [CardSpacing.Roomy]: 'gap-4',
  [CardSpacing.Spacious]: 'gap-6',
}

export interface CardProps extends React.HTMLAttributes<HTMLElement> {
  title: string
  subtitle?: PortableTextBlock[] | string
  subtitleSize?: RichTextSize
  titleSize?: CardTitleSize
  spacing?: CardSpacing
  href?: string
  image?: SanityImage
  iconName?: string
  index?: number
  className?: string
  iconWrapperClassName?: string
  iconClassName?: string
  squareImage?: boolean
  indexAboveImage?: boolean
  imageShadow?: boolean
  // Component slot: any animation component (FadeIn, ScaleIn, SlideIn, etc.)
  // Card resolves `as` to Link or 'article' — the animation handles the rest.
  AnimationComponent?: React.ComponentType<PolymorphicProps>
  animationProps?: Record<string, unknown>
}

const formatIndex = (index?: number): string | undefined => {
  if (typeof index !== 'number') return undefined
  return String(index + 1).padStart(2, '0')
}

const Card = ({
  title,
  subtitle,
  subtitleSize,
  titleSize = CardTitleSize.Medium,
  spacing = CardSpacing.Cozy,
  href,
  image,
  iconName,
  index,
  className,
  iconWrapperClassName,
  iconClassName,
  squareImage = false,
  indexAboveImage = false,
  imageShadow = false,
  AnimationComponent,
  animationProps,
  ...props
}: CardProps) => {
  const formattedIndex = formatIndex(index)
  const hasIconRow = !indexAboveImage && (iconName || formattedIndex)
  const iconRowClass =
    iconName && formattedIndex
      ? 'justify-between'
      : iconName
        ? 'justify-start'
        : 'justify-end'
  const subtitleBlocks = normalizePortableText(subtitle)

  const Comp = (AnimationComponent ??
    (href ? Link : 'article')) as React.ComponentType<PolymorphicProps>

  const compClassName = cn(
    'group flex bg-transparent h-full flex-col',
    indexAboveImage
      ? '' // no overflow-hidden/rounded/translate — badge must protrude above
      : 'overflow-hidden rounded-[32px] hover:-translate-y-1',
    'transition',
    href &&
      'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-black',
    articleSpacingMap[spacing],
    className
  )

  const compProps: PolymorphicProps = {
    className: compClassName,
    ...(AnimationComponent && { as: href ? Link : 'article' }),
    ...(href && { href, 'aria-label': `View ${title}` }),
  }

  const imageWrapperClassName = cn(
    squareImage ? 'aspect-square rounded-none' : 'aspect-[1.18]',
    squareImage && [
      'md:blur-[4px]',
      'md:group-hover:blur-0',
    ],
    imageShadow && [
      'shadow-[16px_16px_36px_4px_rgba(128,128,128,0.54)]',
      'group-hover:shadow-[24px_24px_48px_8px_rgba(128,128,128,0.69)]',
      squareImage
        ? 'transition-[filter,box-shadow] duration-[700ms] ease-in-out'
        : 'transition-shadow duration-[700ms] ease-in-out',
    ]
  )

  const imageClassName = squareImage
    ? 'md:scale-100 md:group-hover:scale-105 transition-transform duration-[700ms] ease-in-out'
    : 'transition duration-300 group-hover:scale-[1.01]'

  return (
    <Comp
      {...compProps}
      {...(animationProps as PolymorphicProps)}
      {...(props as PolymorphicProps)}
    >
      {image?.asset.url && (
        indexAboveImage ? (
          <div className="relative mt-4">
            {formattedIndex && (
              <div
                className="absolute right-6 top-[-16px] z-10 border-2 border-white mix-blend-difference px-4 py-1.5"
                aria-label={`Project ${Number(formattedIndex)}`}
              >
                <span className="font-heading text-body-lg text-white">
                  {formattedIndex}
                </span>
              </div>
            )}
            <Image
              src={image.asset.url}
              alt={image.alt || ''}
              width={image.asset.metadata?.dimensions?.width || 1200}
              height={image.asset.metadata?.dimensions?.height || 1024}
              wrapperClassName={imageWrapperClassName}
              className={imageClassName}
            />
          </div>
        ) : (
          <Image
            src={image.asset.url}
            alt={image.alt || ''}
            width={image.asset.metadata?.dimensions?.width || 1200}
            height={image.asset.metadata?.dimensions?.height || 1024}
            wrapperClassName={imageWrapperClassName}
            className={imageClassName}
          />
        )
      )}

      <div
        className={cn('flex flex-col px-3 pb-5', contentSpacingMap[spacing])}
      >
        {hasIconRow && (
          <div className={cn('flex items-start gap-3', iconRowClass)}>
            {iconName && (
              <span
                className={cn(
                  'inline-flex items-center justify-center',
                  iconWrapperClassName
                )}
              >
                <Icon
                  name={iconName}
                  className={cn('size-6 text-black', iconClassName)}
                  title={`${title} icon`}
                />
              </span>
            )}
            {formattedIndex && (
              <span
                className="font-heading text-body-lg text-black/50"
                aria-label={`Project ${Number(formattedIndex)}`}
              >
                {formattedIndex}
              </span>
            )}
          </div>
        )}

        <p
          className={cn(
            'font-heading font-medium leading-tight text-black',
            titleSizeClassMap[titleSize]
          )}
        >
          {title}
        </p>

        {subtitleBlocks.length > 0 && (
          <RichText
            value={subtitleBlocks}
            size={subtitleSize ?? RichTextSize.Lg}
            className="text-black/70"
          />
        )}
      </div>
    </Comp>
  )
}

export default Card
