import type { HomePageDocument } from '@portfolio/types/pages'
import { getComponentSectionId } from '@/utils/get-component-section-id'
import { RenderOrganism } from '@/components/hoc/RenderOrganism'

export function HomeTemplate(props: HomePageDocument) {
  return props.homepageComponents?.map((component, index, components) => {
    const nextComponent = components[index + 1]
    const nextSectionId = nextComponent
      ? getComponentSectionId({
          sectionId: nextComponent.sectionId,
          componentKey: nextComponent._key,
          componentIndex: index + 1,
        })
      : undefined

    return (
      <RenderOrganism
        key={component._key}
        component={component}
        componentIndex={index}
        nextSectionId={nextSectionId}
      />
    )
  })
}
