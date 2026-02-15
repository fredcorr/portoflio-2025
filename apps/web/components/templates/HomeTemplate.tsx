import type { HomePageDocument } from '@portfolio/types/pages'
import { ComponentTypeName } from '@portfolio/types/base'
import { RenderOrganism } from '@/components/hoc/RenderOrganism'
import { getComponentSectionId } from './component-section-id'

export function HomeTemplate(props: HomePageDocument) {
  return props.homepageComponents?.map((component, index, components) => {
    const sectionId = getComponentSectionId(component, index)
    const nextComponent = components[index + 1]
    const nextSectionId =
      component._type === ComponentTypeName.HomePageHero && nextComponent
        ? getComponentSectionId(nextComponent, index + 1)
        : undefined

    return (
      <RenderOrganism
        key={component._key}
        component={component}
        sectionId={sectionId}
        nextSectionId={nextSectionId}
      />
    )
  })
}
