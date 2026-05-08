import { ComponentLayout } from '@/components/hoc/ComponentLayout'
import { makeComponentId } from '@/utils/makeComponentId'
import WorkIndexRow from '@/components/molecules/WorkIndexRow/WorkIndexRow'
import FadeInWithStagger from '@/components/animation/FadeIn/FadeIn'
import type { WorkIndexComponent } from '@portfolio/types/components'

const WorkIndex = ({
  _id,
  _key,
  label,
  categoryLabel,
  title,
  subtitle,
  projects,
  sectionId,
  componentIndex,
}: WorkIndexComponent) => {
  const headingId = makeComponentId({
    value: _id || _key,
    prefix: 'work-index',
  })
  const hasProjects = Array.isArray(projects) && projects.length > 0

  return (
    <ComponentLayout
      sectionId={sectionId}
      componentKey={_key}
      componentIndex={componentIndex}
      aria-labelledby={headingId}
      className="text-black"
      contentClassName="flex flex-col gap-y-0"
    >
      <div className="mb-8">
        <div className="flex items-center justify-between border-t-2 border-black pt-3">
          {label && (
            <span className="font-heading text-[11px] uppercase tracking-[0.18em] text-black/40">
              {label}
            </span>
          )}
          {categoryLabel && (
            <span className="font-heading text-[11px] uppercase tracking-[0.18em] text-black/40">
              {categoryLabel}
            </span>
          )}
        </div>

        <div className="mt-3 flex flex-col gap-4 md:flex-row md:items-center md:justify-between md:gap-8">
          {title?.heading && (
            <p
              id={headingId}
              className="font-heading text-display-xl leading-none tracking-tight text-black"
            >
              {title.heading}
            </p>
          )}
          {subtitle && (
            <p className="max-w-xs font-heading text-[20px] leading-[1.4] tracking-[-0.01em] text-black/60 md:text-right">
              {subtitle}
            </p>
          )}
        </div>
      </div>

      {hasProjects ? (
        <>
          {projects!.map((project, i) => (
            <FadeInWithStagger
              key={project._id}
              delay={i * 0.08}
              viewport={{ once: true, amount: 0.15 }}
            >
              <WorkIndexRow
                title={project.clientName || ''}
                tag={project.projectTags?.[0]?.name?.current}
                description={project.seoDescription}
                year={project.year}
                image={project.seoImage || project.projectHero}
                href={project.slug?.current}
                index={i}
              />
            </FadeInWithStagger>
          ))}
        </>
      ) : (
        <div className="rounded-3xl border border-dashed border-black/10 bg-gray-50 px-6 py-10 text-center font-body text-body-lg text-black/60">
          Projects will appear here once they are published.
        </div>
      )}
    </ComponentLayout>
  )
}

export default WorkIndex
