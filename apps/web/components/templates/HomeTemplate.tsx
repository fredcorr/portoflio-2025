import type { HomePageDocument } from '@portfolio/types/pages'
import { RenderOrganism } from '@/components/hoc/RenderOrganism'

export function HomeTemplate(props: HomePageDocument) {
  return props.homepageComponents?.map((component, index, components) => {
    return (
      <RenderOrganism
        key={component._key}
        component={component}
        componentIndex={index}
        nextComponent={components[index + 1]}
      />
    )
  })
}
