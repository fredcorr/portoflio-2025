import type { PageComponent } from '@portfolio/types/pages'
import { organismComponents, type OrganismRenderer } from './organism-registry'

interface RenderOrganismProps {
  component?: PageComponent | null
  componentIndex: number
  nextSectionId?: string
}

export const RenderOrganism = ({
  component,
  componentIndex,
  nextSectionId,
}: RenderOrganismProps) => {
  if (!component) {
    return null
  }

  const render = organismComponents[component._type] as OrganismRenderer

  return render({ ...component, componentIndex }, { nextSectionId })
}
