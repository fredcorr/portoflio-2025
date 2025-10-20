import type { ContactPageDocument } from '@portfolio/types/pages'
import { RenderOrganism } from '@/components/hoc/RenderOrganism'

export function ContactTemplate(props: ContactPageDocument) {
  return (
    <div>
      <h1 className="text-4xl font-bold mb-4">{props.title}</h1>
      {/* {props.contactComponents?.map(component => {
        return <RenderOrganism key={component._key} component={component} />
      })} */}
    </div>
  )
}
