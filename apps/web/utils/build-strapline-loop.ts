export interface BuildStraplineLoopOptions {
  repeat?: number
}

export const buildStraplineLoop = (
  strapline?: string,
  { repeat = 3 }: BuildStraplineLoopOptions = {}
): string[] => {
  const normalized = strapline?.trim()

  if (!normalized) {
    return []
  }

  return Array.from({ length: repeat }, () => normalized)
}
