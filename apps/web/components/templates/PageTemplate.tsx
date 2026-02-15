import type { PageDocument } from '@portfolio/types/pages'
import { RenderOrganism } from '@/components/hoc/RenderOrganism'
import { getComponentSectionId } from './component-section-id'

export function PageTemplate(props: PageDocument) {
  return (
    <section data-template="page">
      {props.pageComponents?.map((component, index) => {
        return (
          <RenderOrganism
            key={component._key}
            component={component}
            sectionId={getComponentSectionId(component, index)}
          />
        )
      })}
    </section>
  )
}
