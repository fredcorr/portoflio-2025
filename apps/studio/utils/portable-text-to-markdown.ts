import type {
  PortableTextBlock,
  PortableTextValue,
} from '@portfolio/types/studio'

type BlockChild = NonNullable<PortableTextBlock['children']>[number]

interface PullQuoteBlock {
  _type: 'pullQuote'
  text?: string
  attribution?: string
}

interface CodeBlock {
  _type: 'codeBlock'
  language?: string
  filename?: string
  code?: string
}

const isStandardBlock = (block: unknown): block is PortableTextBlock => {
  return (
    typeof block === 'object' &&
    block !== null &&
    (block as PortableTextBlock)._type === 'block' &&
    Array.isArray((block as PortableTextBlock).children)
  )
}

const isPullQuote = (block: unknown): block is PullQuoteBlock =>
  typeof block === 'object' &&
  block !== null &&
  (block as PullQuoteBlock)._type === 'pullQuote'

const isCodeBlock = (block: unknown): block is CodeBlock =>
  typeof block === 'object' &&
  block !== null &&
  (block as CodeBlock)._type === 'codeBlock'

const DECORATOR_PREFIX: Record<string, string> = {
  // Applied innermost-first so wrapping order stays deterministic.
  code: '`',
  em: '_',
  strong: '**',
}

// Serialize a single span, applying decorators then any link annotation.
const serializeSpan = (
  span: BlockChild,
  markDefs: PortableTextBlock['markDefs']
): string => {
  const { text: rawText, marks: rawMarks } = span as {
    text?: unknown
    marks?: unknown
  }
  const text = typeof rawText === 'string' ? rawText : ''
  if (!text) return ''

  const marks = Array.isArray(rawMarks) ? (rawMarks as string[]) : []

  let result = text
  for (const decorator of ['code', 'em', 'strong'] as const) {
    if (marks.includes(decorator)) {
      const token = DECORATOR_PREFIX[decorator]
      result = `${token}${result}${token}`
    }
  }

  const linkDef = (markDefs ?? []).find(
    def =>
      marks.includes(def._key) &&
      def._type === 'link' &&
      typeof (def as { href?: string }).href === 'string'
  ) as { href?: string } | undefined

  if (linkDef?.href) {
    result = `[${result}](${linkDef.href})`
  }

  return result
}

const serializeChildren = (block: PortableTextBlock): string =>
  (block.children ?? [])
    .map(child => serializeSpan(child, block.markDefs))
    .join('')

const STYLE_PREFIX: Record<string, string> = {
  h1: '# ',
  h2: '## ',
}

// Render a standard block as a heading, list item, or paragraph.
const serializeStandardBlock = (block: PortableTextBlock): string => {
  const content = serializeChildren(block)

  if (block.listItem) {
    const level = typeof block.level === 'number' ? block.level : 1
    const indent = '  '.repeat(Math.max(level - 1, 0))
    const marker = block.listItem === 'number' ? '1.' : '-'
    return `${indent}${marker} ${content}`
  }

  const style = typeof block.style === 'string' ? block.style : 'normal'
  const prefix = STYLE_PREFIX[style] ?? ''
  return `${prefix}${content}`
}

const serializePullQuote = (block: PullQuoteBlock): string => {
  const lines = (block.text ?? '')
    .split('\n')
    .map(line => `> ${line}`.trimEnd())
  if (block.attribution) {
    lines.push('>', `> — ${block.attribution}`)
  }
  return lines.join('\n')
}

const serializeCodeBlock = (block: CodeBlock): string => {
  const language = block.language ?? ''
  const code = block.code ?? ''
  return `\`\`\`${language}\n${code}\n\`\`\``
}

/**
 * Convert a Portable Text value to Markdown suitable for the Medium and
 * Dev.to publishing APIs. Handles headings, the strong/em/code decorators,
 * link annotations, bullet/numbered lists, and the custom `pullQuote`
 * (blockquote) and `codeBlock` (fenced) block types.
 */
export const portableTextToMarkdown = (
  blocks: PortableTextValue | undefined | null
): string => {
  if (!Array.isArray(blocks)) return ''

  return blocks
    .map(block => {
      if (isStandardBlock(block)) return serializeStandardBlock(block)
      if (isPullQuote(block)) return serializePullQuote(block)
      if (isCodeBlock(block)) return serializeCodeBlock(block)
      return ''
    })
    .filter(segment => segment.length > 0)
    .join('\n\n')
    .trim()
}

export default portableTextToMarkdown
