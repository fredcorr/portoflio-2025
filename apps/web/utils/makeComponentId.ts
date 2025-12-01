import makeID from '@portfolio/utils'

type MakeComponentIdParams = {
  value?: string
  prefix?: string
  fallback?: string
}

export const makeComponentId = ({
  value,
  prefix,
  fallback = 'heading',
}: MakeComponentIdParams): string | undefined => {
  const normalized = makeID(value)

  if (!normalized && !fallback) {
    return undefined
  }

  const id = normalized || fallback

  return prefix ? `${prefix}-${id}` : id
}

export default makeComponentId
