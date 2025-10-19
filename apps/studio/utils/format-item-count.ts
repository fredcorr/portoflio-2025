export type ItemCountOptions = {
  pluralLabel?: string
  zeroLabel?: string
}

export const formatItemCount = (
  items: unknown[] | undefined | null,
  singularLabel: string,
  options: ItemCountOptions = {}
): string => {
  const count = Array.isArray(items) ? items.length : 0
  const pluralLabel = options.pluralLabel ?? `${singularLabel}s`

  if (count === 0) {
    return options.zeroLabel ?? `No ${pluralLabel} added`
  }

  const label = count === 1 ? singularLabel : pluralLabel
  return `${count} ${label}`
}
