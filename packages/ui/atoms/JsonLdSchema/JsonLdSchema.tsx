import React from 'react'

export interface ScriptComponentProps {
  id: string
  type: string
  dangerouslySetInnerHTML: { __html: string }
}

export interface JsonLdSchemaProps {
  id: string
  schema: object
  ScriptComponent?: React.ComponentType<ScriptComponentProps>
}

export function JsonLdSchema({ id, schema, ScriptComponent }: JsonLdSchemaProps) {
  const scriptProps: ScriptComponentProps = {
    id,
    type: 'application/ld+json',
    dangerouslySetInnerHTML: { __html: JSON.stringify(schema) },
  }

  if (ScriptComponent) {
    return <ScriptComponent {...scriptProps} />
  }

  return <script {...scriptProps} />
}
