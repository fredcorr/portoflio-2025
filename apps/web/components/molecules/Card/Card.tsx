import React from 'react'
import type { PortableTextBlock } from '@portabletext/react'
import Link from 'next/link'

import Image from '@/components/atoms/Image/Image'
import RichText, { RichTextSize } from '@/components/atoms/RichText/RichText'
import Icon, { IconName } from '@/components/atoms/Icon/Icon'
import { cn } from '@/utils/cn'
import { normalizePortableText } from '@/utils/portableText'
import { ConditionalWrapper } from '@/components/hoc/ConditionalWrapper'
import { SanityImage } from '@portfolio/types/sanity'

export enum CardTitleSize {
  Small = 'small',
  Medium = 'medium',
  Large = 'large',
}

export enum CardSpacing {
  Compact = 'compact',
  Cozy = 'cozy',
  Roomy = 'roomy',
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
}

const contentSpacingMap: Record<CardSpacing, string> = {
  [CardSpacing.Compact]: 'gap-2',
  [CardSpacing.Cozy]: 'gap-3',
  [CardSpacing.Roomy]: 'gap-4',
}

export interface CardProps {
  title: string
  subtitle?: PortableTextBlock[] | string
  subtitleSize?: RichTextSize
  titleSize?: CardTitleSize
  spacing?: CardSpacing
  href?: string
  image?: SanityImage
  iconName?: IconName
  index?: number
  className?: string
  iconWrapperClassName?: string
  iconClassName?: string
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
}: CardProps) => {
  const formattedIndex = formatIndex(index)
  const hasIconRow = iconName || formattedIndex
  const iconRowClass =
    iconName && formattedIndex
      ? 'justify-between'
      : iconName
        ? 'justify-start'
        : 'justify-end'
  const subtitleBlocks = normalizePortableText(subtitle)

  return (
    <ConditionalWrapper
      condition={Boolean(href)}
      wrapper={children => (
        <Link
          href={href as string}
          className={cn(
            'block rounded-[32px]',
            'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-black'
          )}
          aria-label={`View ${title}`}
        >
          {children}
        </Link>
      )}
    >
      <article
        className={cn(
          'group flex bg-transparent h-full flex-col overflow-hidden rounded-[32px] transition hover:-translate-y-1',
          articleSpacingMap[spacing],
          className
        )}
      >
        {image?.asset.url && (
          <Image
            src={image.asset.url}
            alt={image.alt || ''}
            width={image.asset.metadata?.dimensions?.width || 1200}
            height={image.asset.metadata?.dimensions?.height || 1024}
            wrapperClassName="aspect-[1.18]"
            className="transition duration-300 group-hover:scale-[1.01]"
          />
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

          {subtitleBlocks.length && (
            <RichText
              value={subtitleBlocks}
              size={subtitleSize ?? RichTextSize.Lg}
              className="text-black/70"
            />
          )}
        </div>
      </article>
    </ConditionalWrapper>
  )
}

export default Card
