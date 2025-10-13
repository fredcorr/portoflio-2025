import { createClient } from 'next-sanity'

const projectId = process.env.SANITY_PROJECT_ID || 'placeholder'
const dataset = process.env.SANITY_DATASET || 'production'

export const client = createClient({
  projectId,
  dataset,
  apiVersion: '2024-01-01',
  useCdn: process.env.NODE_ENV === 'production',
  perspective: 'published',
})

export const previewClient = createClient({
  projectId,
  dataset,
  apiVersion: '2024-01-01',
  useCdn: false,
  perspective: 'previewDrafts',
  token: process.env.SANITY_API_READ_TOKEN,
})
