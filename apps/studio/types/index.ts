import { FieldDefinition } from 'sanity'

export type BaseDocumentFieldsConfig = {
  title?: {
    initialValue?: string
  }
  slug?: {
    basePath?: string
    options?: SlugOptionOverrides
  }
}

// Common field properties that can be safely spread across different field types
// Note: "validation" and "options" are excluded because each field type has its own specific signatures
export type CommonFieldProps = Pick<
  FieldDefinition,
  'name' | 'title' | 'description' | 'hidden' | 'fieldset'
>

export type Slugifier = (
  input: string,
  schemaType?: any
) => string | Promise<string>

export type SlugOptionOverrides = {
  source?: any
  maxLength?: number
  slugify?: Slugifier
  [key: string]: unknown
}
