import type { PortableTextBlock, PortableTextValue } from '@portfolio/types/studio'

const isPortableTextBlock = (block: unknown): block is PortableTextBlock => {
  return (
    typeof block === 'object' &&
    block !== null &&
    Array.isArray((block as PortableTextBlock).children)
  )
}

export const extractPlainText = (
  blocks: PortableTextValue | undefined | null
): string | undefined => {
  if (!Array.isArray(blocks)) return undefined

  const text = blocks
    .flatMap(block => {
      if (!isPortableTextBlock(block)) return []

      return block.children!
        .map(child => (typeof child?.text === 'string' ? child.text : ''))
        .filter(Boolean)
    })
    .join(' ')
    .trim()

  return text || undefined
}
