import type { ContactPageDocument } from '@portfolio/types/pages'
import { RenderOrganism } from '@/components/hoc/RenderOrganism'
import { getComponentSectionId } from './component-section-id'

export function ContactTemplate(props: ContactPageDocument) {
  return props.contactComponents?.map((component, index) => {
    return (
      <RenderOrganism
        key={component._key}
        component={component}
        sectionId={getComponentSectionId(component, index)}
      />
    )
  })
}
