import { defineField, defineType } from 'sanity'

const LANGUAGES = [
  { title: 'TypeScript', value: 'ts' },
  { title: 'TSX', value: 'tsx' },
  { title: 'JavaScript', value: 'js' },
  { title: 'JSX', value: 'jsx' },
  { title: 'CSS', value: 'css' },
  { title: 'HTML', value: 'html' },
  { title: 'JSON', value: 'json' },
  { title: 'Bash', value: 'bash' },
  { title: 'Plain text', value: 'text' },
]

const CodeBlock = defineType({
  name: 'codeBlock',
  type: 'object',
  title: 'Code Block',
  fields: [
    defineField({
      name: 'language',
      type: 'string',
      title: 'Language',
      options: {
        list: LANGUAGES,
        layout: 'dropdown',
      },
      initialValue: 'ts',
    }),
    defineField({
      name: 'filename',
      type: 'string',
      title: 'Filename',
      description: 'Optional. Shown as a label above the code.',
    }),
    defineField({
      name: 'code',
      type: 'text',
      title: 'Code',
      rows: 10,
      validation: Rule => Rule.required(),
    }),
  ],
  preview: {
    select: {
      language: 'language',
      filename: 'filename',
      code: 'code',
    },
    prepare({
      language,
      filename,
      code,
    }: {
      language?: string
      filename?: string
      code?: string
    }) {
      return {
        title: filename ?? 'Code block',
        subtitle: [language, code ? code.slice(0, 60) : '']
          .filter(Boolean)
          .join(' · '),
      }
    },
  },
})

export default CodeBlock
