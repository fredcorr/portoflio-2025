interface ComponentSectionIdOptions {
  sectionId?: string
  componentKey?: string
  componentIndex?: number
}

export const getComponentSectionId = ({
  sectionId,
  componentKey,
  componentIndex,
}: ComponentSectionIdOptions) => {
  const normalizedSectionId = sectionId?.trim()

  if (normalizedSectionId) {
    return normalizedSectionId
  }

  const normalizedKey = componentKey?.trim()

  if (normalizedKey) {
    return `section-${normalizedKey}`
  }

  if (typeof componentIndex === 'number') {
    return `section-${componentIndex + 1}`
  }

  return undefined
}
