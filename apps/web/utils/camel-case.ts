export interface CamelCaseOptions {
  preserveNumbers?: boolean
}

export const camelCase = (
  value: string,
  options?: CamelCaseOptions
): string => {
  const input = value.trim()
  if (!input) return ''

  const words = input
    .replace(/['’]/g, '')
    .split(/[^a-zA-Z0-9]+/)
    .filter(Boolean)

  const resolved = words
    .map((word, index) => {
      const lower = word.toLowerCase()

      if (index === 0) {
        return lower
      }

      return lower.charAt(0).toUpperCase() + lower.slice(1)
    })
    .join('')

  const preserveNumbers = options?.preserveNumbers ?? true
  if (!preserveNumbers) {
    return resolved.replace(/[0-9]/g, '')
  }

  return resolved
}

export default camelCase
