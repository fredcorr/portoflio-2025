import type { PageDocument } from '@portfolio/types/pages'
import { RenderOrganism } from '@/components/hoc/RenderOrganism'

export function PageTemplate(props: PageDocument) {
  return (
    <section data-template="page">
      {props.pageComponents?.map(component => {
        return <RenderOrganism key={component._key} component={component} />
      })}
    </section>
  )
}
