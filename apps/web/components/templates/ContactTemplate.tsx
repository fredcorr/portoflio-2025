import type { ContactPageDocument } from '@portfolio/types/pages'
import { RenderOrganism } from '@/components/hoc/RenderOrganism'

export function ContactTemplate(props: ContactPageDocument) {
  return props.pageComponents?.map(component => {
    return <RenderOrganism key={component._key} component={component} />
  })
}
