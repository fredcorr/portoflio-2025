import type { AboutPageDocument } from '@portfolio/types/pages'
import { RenderOrganism } from '@/components/hoc/RenderOrganism'
import { getComponentSectionId } from './component-section-id'

export function AboutTemplate(props: AboutPageDocument) {
  return props.aboutComponents?.map((component, index) => {
    return (
      <RenderOrganism
        key={component._key}
        component={component}
        sectionId={getComponentSectionId(component, index)}
      />
    )
  })
}
