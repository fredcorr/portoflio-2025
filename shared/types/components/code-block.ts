export interface CodeBlock {
  _type: 'codeBlock'
  _key: string
  language?: string
  filename?: string
  code: string
}
