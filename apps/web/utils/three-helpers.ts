export const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

export const isMobileViewport = () =>
  typeof window !== 'undefined' && window.matchMedia
    ? window.matchMedia('(max-width: 768px)').matches
    : false

const parseColor = (raw: string): [number, number, number] | null => {
  const value = raw.trim()
  if (!value) return null

  if (value.startsWith('#')) {
    const hex = value.replace('#', '')
    const normalized =
      hex.length === 3
        ? hex
            .split('')
            .map(ch => ch + ch)
            .join('')
        : hex
    if (normalized.length !== 6) return null
    const r = Number.parseInt(normalized.slice(0, 2), 16)
    const g = Number.parseInt(normalized.slice(2, 4), 16)
    const b = Number.parseInt(normalized.slice(4, 6), 16)
    return [r, g, b]
  }

  const match = value.match(/rgba?\(([^)]+)\)/i)
  if (match) {
    const parts = match[1].split(',').map(part => Number.parseFloat(part))
    if (parts.length >= 3) {
      return [parts[0], parts[1], parts[2]]
    }
  }

  return null
}

export const resolveRingColor = (cssVarName = '--color-foreground') => {
  if (typeof window === 'undefined') return 0xffffff
  const computed = window
    .getComputedStyle(document.documentElement)
    .getPropertyValue(cssVarName)
  const rgb = parseColor(computed)
  if (!rgb) return 0xffffff
  const [r, g, b] = rgb
  const luminance = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255
  return luminance > 0.5 ? 0x000000 : 0xffffff
}
