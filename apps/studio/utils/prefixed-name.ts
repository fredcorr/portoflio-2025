export const prefixedName = (prefix: string, key: string) =>
  prefix ? `${prefix}_${key}` : key
