import { codeToHtml } from 'shiki'
import type { CodeBlock as CodeBlockData } from '@portfolio/types/components'
import CodeBlockDisplay from './CodeBlock'

const LANG_MAP: Record<string, string> = {
  ts: 'typescript',
  tsx: 'tsx',
  js: 'javascript',
  jsx: 'jsx',
  css: 'css',
  html: 'html',
  json: 'json',
  bash: 'bash',
  text: 'plaintext',
}

const CodeBlockAsync = async ({
  code,
  language = 'ts',
  filename,
}: CodeBlockData) => {
  const lang = LANG_MAP[language] ?? 'plaintext'

  const html = await codeToHtml(code, {
    lang,
    themes: {
      light: 'github-light',
      dark: 'github-dark',
    },
  })

  return <CodeBlockDisplay highlightedHtml={html} filename={filename} />
}

export default CodeBlockAsync
