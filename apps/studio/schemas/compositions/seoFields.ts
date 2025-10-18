import Media from '../components/atoms/media'
import String from '../components/atoms/string'
import TextArea from '../components/atoms/text-area'
import { seoFieldset } from '../fieldsets'

const title = String({
  name: 'seoTitle',
  title: 'SEO title',
  description: 'Search-friendly title shown in browser tabs and search results.',
  fieldset: seoFieldset.name,
})

const description = TextArea({
  name: 'seoDescription',
  title: 'SEO description',
  description: 'Short description used for search engines and social sharing.',
  fieldset: seoFieldset.name,
})

const image = Media({
  name: 'seoImage',
  title: 'SEO image',
  description: 'Preview image for social media cards.',
  fieldset: seoFieldset.name,
})

const entries = Object.freeze([title, description, image] as const)

export const seoFields = Object.freeze({
  title,
  description,
  image,
  all: entries,
})

