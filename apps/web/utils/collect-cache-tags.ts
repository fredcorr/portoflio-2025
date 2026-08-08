import { GlobalItemsType, PageTypeName } from '@portfolio/types/base'

/**
 * Cache tags derived from the documents a Sanity query actually returned.
 *
 * Two kinds of tag, because neither is sufficient alone:
 *
 * - **Id tags** (`sanity:id:<id>`) cover edits to a document already present in
 *   a cache entry. They are exact: editing one article invalidates the entries
 *   holding that article and nothing else.
 * - **Type tags** (`sanity:type:<type>`) cover *creates and deletes*. A new
 *   article has an id that was never cached, so no id tag can match it — only
 *   a listing that declared "this entry depends on articles collectively" will
 *   be invalidated.
 */

const ID_TAG_PREFIX = 'sanity:id:'
const TYPE_TAG_PREFIX = 'sanity:type:'
const DRAFT_ID_PREFIX = 'drafts.'

/**
 * `cacheTag()` accepts at most 128 tags per call and silently drops the rest,
 * so callers spread the result of `chunkCacheTags` across several calls.
 */
const MAX_TAGS_PER_CALL = 128

/**
 * Only document types get type tags. Nested `_type` values are mostly not
 * documents at all — portable text blocks, spans, images and the component
 * objects inside `pageComponents` all carry one — and tagging those would
 * produce tags no webhook can ever fire.
 */
const DOCUMENT_TYPES: ReadonlySet<string> = new Set<string>([
  ...Object.values(PageTypeName),
  GlobalItemsType.Settings,
])

/**
 * Sanity addresses a draft as `drafts.<id>` while the published document keeps
 * the bare id. Cache entries are built from published reads, so a webhook
 * carrying a draft id has to normalise or it would never match.
 */
export function normaliseDocumentId(id: string): string {
  return id.startsWith(DRAFT_ID_PREFIX) ? id.slice(DRAFT_ID_PREFIX.length) : id
}

export function idTag(id: string): string {
  return `${ID_TAG_PREFIX}${normaliseDocumentId(id)}`
}

export function typeTag(type: string): string {
  return `${TYPE_TAG_PREFIX}${type}`
}

export function isDocumentType(type: string): boolean {
  return DOCUMENT_TYPES.has(type)
}

export function chunkCacheTags(tags: string[]): string[][] {
  const chunks: string[][] = []

  for (let i = 0; i < tags.length; i += MAX_TAGS_PER_CALL) {
    chunks.push(tags.slice(i, i + MAX_TAGS_PER_CALL))
  }

  return chunks
}

/**
 * Walks a query result and returns the tags its cache entry should carry.
 *
 * The root document's own `_type` is deliberately excluded. An article page's
 * result is rooted on that article, and tagging `sanity:type:article` there
 * would invalidate every article page whenever any single article changed —
 * the exact over-invalidation this replaces. The root is already addressed
 * precisely by its id tag.
 */
export function collectCacheTags(root: unknown): string[] {
  const tags = new Set<string>()
  // Sanity references can be mutual, so an unguarded walk can revisit forever.
  const seen = new Set<object>()

  const visit = (value: unknown, isRoot: boolean): void => {
    if (Array.isArray(value)) {
      for (const item of value) {
        visit(item, false)
      }
      return
    }

    if (value === null || typeof value !== 'object') {
      return
    }

    if (seen.has(value)) {
      return
    }
    seen.add(value)

    const record = value as Record<string, unknown>

    const id = record._id
    if (typeof id === 'string' && id.length > 0) {
      tags.add(idTag(id))
    }

    const type = record._type
    if (!isRoot && typeof type === 'string' && isDocumentType(type)) {
      tags.add(typeTag(type))
    }

    for (const key of Object.keys(record)) {
      visit(record[key], false)
    }
  }

  // An array root has no document of its own, so every element is nested and
  // contributes a type tag — which is what a sitemap or feed needs.
  visit(root, !Array.isArray(root))

  return [...tags]
}
