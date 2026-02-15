import type { PageComponent } from '@portfolio/types/pages'

export const getComponentSectionId = (
  component: PageComponent,
  index: number
) => {
  const sectionId = component.sectionId?.trim()

  if (sectionId) {
    return sectionId
  }

  const key = component._key?.trim()

  if (key) {
    return `section-${key}`
  }

  return `section-${index + 1}`
}
