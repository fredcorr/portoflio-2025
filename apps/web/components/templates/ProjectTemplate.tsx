import type { ProjectPageDocument } from '@portfolio/types/pages'
import { RenderOrganism } from '@/components/hoc/RenderOrganism'

export function ProjectTemplate({
  title,
  projectHero,
  projectComponents,
}: ProjectPageDocument) {
  return (
    <>
      {projectComponents?.map(component => {
        return <RenderOrganism key={component._key} component={component} />
      })}
    </>
  )
}
