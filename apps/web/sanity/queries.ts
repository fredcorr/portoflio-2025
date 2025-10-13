import { groq } from 'next-sanity'

// Example queries - modify based on your schema
export const ALL_PAGES_QUERY = groq`
  *[_type == "page"] {
    _id,
    _type,
    title,
    slug
  }
`

export const PAGE_BY_SLUG_QUERY = groq`
  *[_type == "page" && slug.current == $slug][0] {
    _id,
    _type,
    title,
    slug,
    content
  }
`
