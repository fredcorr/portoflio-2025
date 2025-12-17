import groq from 'groq'

export const imageFields = groq`
  ...,
  asset->{
    _id,
    url,
    metadata{
      lqip,
      dimensions{
        height,
        width
      }
    }
}
`

export const basePageFields = groq`
  _id,
  _type,
  title,
  slug,
  showInNavigation,
  seoTitle,
  seoDescription,
  seoImage {
    ${imageFields}
}
`

export const titleFields = (prefix: string) => groq`
 ${prefix} {
    "heading": ${prefix}_heading,
    "headingLevel": ${prefix}_headingLevel
  }
`

export const messageFields = (prefix: string) => groq`
  {
    "title": ${prefix}_title,
    "subtitle": ${prefix}_subtitle
  }
`

export const baseComponentFields = groq`
  "_key": _key,
  "_type": _type,
  "_id": _id
`
