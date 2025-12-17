import { createClient } from '@sanity/client'

const projectId = process.env.SANITY_PROJECT_ID
const dataset = process.env.SANITY_DATASET
const token = process.env.SANITY_API_READ_TOKEN

if (!projectId) {
  throw new Error('Missing SANITY_PROJECT_ID environment variable')
}

if (!dataset) {
  throw new Error('Missing SANITY_DATASET environment variable')
}

export const client = createClient({
  projectId,
  dataset,
  apiVersion: '2024-01-01',
  useCdn: process.env.NODE_ENV === 'production',
  perspective: 'published',
  ...(token && { token }),
})

export const previewClient = createClient({
  ...(token && { token }),
  projectId,
  dataset,
  apiVersion: '2024-01-01',
  useCdn: false,
  perspective: 'drafts',
})
