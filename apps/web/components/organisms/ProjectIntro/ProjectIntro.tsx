import React from 'react'
import type { ProjectIntroProps as ProjectIntroSharedProps } from '@portfolio/types/components'
import Image from '@/components/atoms/Image/Image'
import { ComponentLayout } from '@/components/hoc/ComponentLayout'
import Breadcrumbs from '@/components/molecules/Breadcrumbs/Breadcrumbs'
import { makeComponentId } from '@/utils/makeComponentId'
import { cn } from '@/utils/cn'

export interface ProjectIntroProps extends ProjectIntroSharedProps {
  className?: string
}

const ProjectIntro = ({
  slug,
  title,
  description,
  breadcrumbs,
  className,
  heroImage,
}: ProjectIntroProps) => {
  const heading = title?.trim()
  const body = description?.trim()
  const headingId =
    heading && makeComponentId({ value: heading, prefix: 'project-intro' })
  const hasBreadcrumbs =
    Boolean(slug) || Boolean(breadcrumbs && breadcrumbs.length)

  return (
    <ComponentLayout
      aria-labelledby={headingId}
      className={cn('text-black dark:text-foreground', className)}
      contentClassName="gap-y-6 md:gap-y-8"
      data-organism="project-intro"
    >
      {hasBreadcrumbs && <Breadcrumbs className="md:col-span-12" slug={slug} />}
      {heading && (
        <h1
          id={headingId}
          className="md:col-span-12 max-w-4xl font-display text-heading-1 font-medium tracking-tight"
        >
          {heading}
        </h1>
      )}
      {body && (
        <p className="md:col-span-12 max-w-4xl font-body text-body-xl text-black/80 dark:text-foreground/80">
          {body}
        </p>
      )}
      {!!heroImage?.asset.url && (
        <div className="md:col-span-12">
          <Image
            src={heroImage.asset.url}
            alt={heroImage.alt || ''}
            width={heroImage.asset.metadata?.dimensions?.width || 1200}
            height={heroImage.asset.metadata?.dimensions?.height || 1024}
            className="transition duration-300 group-hover:scale-[1.01]"
          />
        </div>
      )}
    </ComponentLayout>
  )
}

export default ProjectIntro
export { ProjectIntro }
