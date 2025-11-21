import type { HomePageDocument } from '@portfolio/types/pages'
import { RenderOrganism } from '@/components/hoc/RenderOrganism'

export function HomeTemplate(props: HomePageDocument) {
  return (
    <section data-template="home">
      {props.homepageComponents?.map(component => {
        return <RenderOrganism key={component._key} component={component} />
      })}
    </section>
  )
}
