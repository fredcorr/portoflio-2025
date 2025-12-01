import RichText, { RichTextSize } from '@/components/atoms/RichText/RichText'
import type { ProjectListingComponent } from '@portfolio/types/components'
import { ComponentLayout } from '@/components/hoc/ComponentLayout'
import { Heading } from '@/components/atoms/Heading/Heading'
import { makeComponentId } from '@/utils/makeComponentId'
import Card from '@/components/molecules/Card/Card'
import { cn } from '@/utils/cn'
import Link from 'next/link'
import React from 'react'

const ProjectListing = ({
  _id,
  _key,
  title,
  subtitle,
  projects,
  showCtaToProjects = false,
  splitLayout,
}: ProjectListingComponent) => {
  const hasSubtitle = subtitle?.length
  const headingId = makeComponentId({
    value: _id || _key,
    prefix: 'project-listing',
  })

  const headingColumnClasses = splitLayout
    ? 'md:col-span-6 lg:col-span-5'
    : 'md:col-span-8 lg:col-span-7'

  const subtitleColumnClasses = splitLayout
    ? 'md:col-span-5 md:col-start-7 lg:col-span-5 lg:col-start-7'
    : 'md:col-span-10 lg:col-span-8'

  const ctaColumnClasses = splitLayout
    ? 'md:col-span-2 md:col-start-11'
    : 'md:col-span-3 md:col-start-10'

  return (
    <ComponentLayout
      className="text-black dark:text-foreground"
      contentClassName="gap-y-12 lg:gap-y-16"
      aria-labelledby={headingId}
    >
      <div className="md:col-span-12">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-12 md:items-start">
          <div className={cn('space-y-3', headingColumnClasses)}>
            {title && (
              <Heading
                level={title?.headingLevel}
                id={headingId}
                className="font-heading text-heading-2 font-medium leading-[1.15] tracking-tight"
              >
                {title?.heading}
              </Heading>
            )}

            {!splitLayout && hasSubtitle && (
              <RichText
                size={RichTextSize.Xl}
                className="max-w-2xl"
                value={subtitle}
              />
            )}
          </div>

          {splitLayout && hasSubtitle && (
            <RichText
              value={subtitle}
              size={RichTextSize.Xl}
              className={cn('max-w-3xl', subtitleColumnClasses)}
            />
          )}

          {showCtaToProjects && (
            <Link
              href="/projects"
              className={cn(
                'mt-1 inline-flex items-center gap-2 self-end px-4 py-2 font-heading text-body-lg font-medium text-black transition hover:-translate-y-0.5 hover:border-black/30 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-black  dark:text-foreground ',
                'md:mt-0 md:justify-end md:self-end',
                ctaColumnClasses
              )}
            >
              <span>More</span>
              <span aria-hidden="true">→</span>
            </Link>
          )}
        </div>
      </div>

      {projects?.length ? (
        <div className="md:col-span-12">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:gap-10">
            {projects.map(project => (
              <Card
                key={project._id}
                title={project.title || ''}
                subtitle={project.seoDescription}
                href={project.slug?.current}
                image={project.seoImage || project.projectHero}
                subtitleSize={RichTextSize.Lg}
              />
            ))}
          </div>
        </div>
      ) : (
        <div className="md:col-span-12 rounded-3xl bg-gray-50 px-6 py-10 text-black/70 dark:bg-gray-100 dark:text-foreground/70">
          Projects will appear here once they are published.
        </div>
      )}
    </ComponentLayout>
  )
}

export default ProjectListing
