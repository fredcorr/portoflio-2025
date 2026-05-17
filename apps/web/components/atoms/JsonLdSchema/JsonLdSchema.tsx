import Script from 'next/script'

interface JsonLdSchemaProps {
  id: string
  schema: object
}

export default function JsonLdSchema({ id, schema }: JsonLdSchemaProps) {
  return (
    <Script
      id={id}
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}
