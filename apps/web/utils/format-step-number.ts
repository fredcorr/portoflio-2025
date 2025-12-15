export interface FormatStepNumberOptions {
  minDigits?: number
}

export const formatStepNumber = (
  index: number,
  { minDigits = 2 }: FormatStepNumberOptions = {}
): string => {
  const step = index + 1
  const padded = step.toString().padStart(minDigits, '0')
  return `${padded} —`
}
