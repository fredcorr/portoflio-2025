export interface FormatDateParams {
  value?: string | null
  locale?: string
  options?: Intl.DateTimeFormatOptions
}

export const formatDate = ({
  value,
  locale = 'en-US',
  options,
}: FormatDateParams): string | undefined => {
  if (!value) {
    return undefined
  }

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return undefined
  }

  return date.toLocaleDateString(
    locale,
    options ?? {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }
  )
}

export default formatDate
