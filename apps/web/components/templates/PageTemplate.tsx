import type { PageDocument } from '@portfolio/types/pages'
import { RenderOrganism } from '@/components/hoc/RenderOrganism'

export function PageTemplate(props: PageDocument) {
  return (
    <>
      {props.pageComponents?.map((component, index) => (
        <RenderOrganism
          key={component._key}
          component={component}
          componentIndex={index}
        />
      ))}
    </>
  )
}
