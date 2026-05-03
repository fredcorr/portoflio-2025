import RichText, { RichTextSize } from '@/components/atoms/RichText/RichText'
import type { ProjectListingComponent } from '@portfolio/types/components'
import { ComponentLayout } from '@/components/hoc/ComponentLayout'
import { Heading } from '@/components/atoms/Heading/Heading'
import { makeComponentId } from '@/utils/makeComponentId'
import Card, { CardSpacing } from '@/components/molecules/Card/Card'
import { cn } from '@/utils/cn'
import Link from 'next/link'
import StaggerChildren from '@/components/animation/StaggerChildren/StaggerChildren'
import FadeInWithStagger from '@/components/animation/FadeIn/FadeIn'

const ProjectListing = ({
  _id,
  _key,
  title,
  subtitle,
  projects,
  showCtaToProjects = false,
  addStaggerAnimation = false,
  sectionId,
  componentIndex,
}: ProjectListingComponent) => {
  const hasSubtitle = subtitle?.length
  const headingId = makeComponentId({
    value: _id || _key,
    prefix: 'project-listing',
  })

  return (
    <ComponentLayout
      sectionId={sectionId}
      componentKey={_key}
      componentIndex={componentIndex}
      className="text-black dark:text-foreground"
      contentClassName="gap-y-12 lg:gap-y-16"
      aria-labelledby={headingId}
    >
      <div className="md:col-span-12 space-y-3">
        <div className="flex items-center justify-between">
          {title && (
            <Heading
              level={title?.headingLevel}
              id={headingId}
              className="font-heading text-heading-2 font-medium leading-[1.15] tracking-tight"
            >
              {title?.heading}
            </Heading>
          )}

          {showCtaToProjects && (
            <Link
              href="/projects"
              className="inline-flex items-center gap-2 px-4 py-2 font-heading text-body-lg font-medium text-black transition hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-black dark:text-foreground"
            >
              <span>More</span>
              <span aria-hidden="true">→</span>
            </Link>
          )}
        </div>

        {hasSubtitle && (
          <RichText
            size={RichTextSize.Xl}
            className="max-w-2xl"
            value={subtitle}
          />
        )}
      </div>

      {projects?.length ? (
        <StaggerChildren
          staggerDelay={addStaggerAnimation ? 0.25 : 0}
          delay={addStaggerAnimation ? 0.15 : 0}
          amount={0.15}
          as="div"
          className="md:col-span-12 grid grid-cols-1 gap-8 md:grid-cols-2 lg:gap-10"
        >
          {projects.map((project, i) => (
            <Card
              key={project._id}
              title={project.clientName || ''}
              subtitle={project.title}
              href={project.slug?.current}
              image={project.seoImage || project.projectHero}
              subtitleSize={RichTextSize.Lg}
              index={i}
              squareImage
              imageShadow
              indexAboveImage
              spacing={CardSpacing.Spacious}
              animationProps={{ viewport: { once: true, amount: 0.15 } }}
              className={cn('h-full', i % 2 === 1 && 'md:mt-16')}
              AnimationComponent={FadeInWithStagger}
            />
          ))}
        </StaggerChildren>
      ) : (
        <div className="md:col-span-12 rounded-3xl bg-gray-50 px-6 py-10 text-black/70 dark:bg-gray-100 dark:text-foreground/70">
          Projects will appear here once they are published.
        </div>
      )}
    </ComponentLayout>
  )
}

export default ProjectListing
