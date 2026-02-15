import type { AboutPageDocument } from '@portfolio/types/pages'
import { RenderOrganism } from '@/components/hoc/RenderOrganism'

export function AboutTemplate(props: AboutPageDocument) {
  return props.aboutComponents?.map((component, index) => {
    return (
      <RenderOrganism
        key={component._key}
        component={component}
        componentIndex={index}
      />
    )
  })
}
