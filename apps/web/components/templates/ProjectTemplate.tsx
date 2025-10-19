import type { ProjectPageDocument } from '@portfolio/types/pages'
import { RenderOrganism } from '@/components/hoc/RenderOrganism'

export function ProjectTemplate(props: ProjectPageDocument) {
  return (
    <div>
      <h1 className="text-4xl font-bold mb-4">{props.title}</h1>
      {props.projectComponents?.map(component => {
        return <RenderOrganism key={component._key} component={component} />
      })}
    </div>
  )
}
