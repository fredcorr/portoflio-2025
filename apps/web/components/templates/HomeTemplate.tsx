import type { HomePageDocument } from '@portfolio/types/pages'
import { RenderOrganism } from '@/components/hoc/RenderOrganism'

export function HomeTemplate(props: HomePageDocument) {
  return props.homepageComponents?.map(component => {
    return <RenderOrganism key={component._key} component={component} />
  })
}
