import { createClient } from '@sanity/client'
import { SanityDataset } from '@portfolio/types/base'

const projectId = process.env.SANITY_PROJECT_ID
const dataset = process.env.SANITY_DATASET
const token = process.env.SANITY_API_READ_TOKEN

const KNOWN_DATASETS = Object.values(SanityDataset)

if (!projectId) {
  throw new Error('Missing SANITY_PROJECT_ID environment variable')
}

if (!dataset) {
  throw new Error('Missing SANITY_DATASET environment variable')
}

// Fail the build on a typo rather than silently querying a dataset that does
// not exist — an unknown name returns no documents, which looks like empty CMS
// content instead of a misconfiguration.
if (!KNOWN_DATASETS.includes(dataset as SanityDataset)) {
  throw new Error(
    `Unknown SANITY_DATASET "${dataset}" — expected one of: ${KNOWN_DATASETS.join(', ')}`
  )
}

/**
 * `useCdn` is off deliberately.
 *
 * Every consumer of this client either sits behind a `use cache` scope or runs
 * at build time, so the API CDN would be a second cache layered under one that
 * already exists — and the two expire independently. The failure that causes
 * is specific: a publish fires the webhook, `revalidateTag` marks the entry
 * stale, the page regenerates, and the regenerating fetch reads a pre-publish
 * response from `apicdn`. That stale value is then cached for a further hour,
 * so the webhook appears to have worked while the site keeps serving old
 * content.
 *
 * Sanity's own guidance says the same thing: use the uncached API "when
 * building integrations with Sanity or responding to webhooks" — which is
 * exactly what a revalidation-triggered render is.
 * https://www.sanity.io/docs/content-lake/api-cdn
 */
export const client = createClient({
  projectId,
  dataset,
  apiVersion: '2025-01-01',
  useCdn: false,
  perspective: 'published',
  ...(token && { token }),
})

if (!token) {
  console.warn(
    'SANITY_API_READ_TOKEN is not set — previewClient will not return draft content.'
  )
}

export const previewClient = createClient({
  ...(token && { token }),
  projectId,
  dataset,
  apiVersion: '2025-01-01',
  useCdn: false,
  perspective: 'drafts',
  stega: {
    enabled: true,
    studioUrl: process.env.SANITY_STUDIO_URL || 'http://localhost:3333',
  },
})
