import type { AboutPageDocument } from '@portfolio/types/pages'
import { RenderOrganism } from '@/components/hoc/RenderOrganism'

export function AboutTemplate(props: AboutPageDocument) {
  return (
    <div>
      <h1 className="text-4xl font-bold mb-4">{props.title}</h1>
      {/* {props.aboutComponents?.map((component, index) => {
        const key =
          (component as { _key?: string })._key ?? `${component._type}-${index}`

        return <RenderOrganism key={key} component={component} />
      })} */}
    </div>
  )
}
