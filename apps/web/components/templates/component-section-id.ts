import type { PageComponent } from '@portfolio/types/pages'

export const getComponentSectionId = (
  component: PageComponent,
  index: number
) => {
  const key = component.sectionId?.trim() || component._key?.trim()

  if (key) {
    return `section-${key}`
  }

  return `section-${index + 1}`
}
