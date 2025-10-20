import type { HomePageDocument } from '@portfolio/types/pages'
import { RenderOrganism } from '@/components/hoc/RenderOrganism'

export function HomeTemplate(props: HomePageDocument) {
  return (
    <section data-template="home">
      <h1 className="text-4xl font-bold mb-4">{props.title}</h1>
      {/* {props.homepageComponents?.map(component => {
        return <RenderOrganism key={component._key} component={component} />
      })} */}
    </section>
  )
}
