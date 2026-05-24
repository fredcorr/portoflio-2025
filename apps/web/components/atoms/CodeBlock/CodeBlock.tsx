import React from 'react'
import hljs from 'highlight.js/lib/core'
import typescript from 'highlight.js/lib/languages/typescript'
import javascript from 'highlight.js/lib/languages/javascript'
import xml from 'highlight.js/lib/languages/xml'
import css from 'highlight.js/lib/languages/css'
import json from 'highlight.js/lib/languages/json'
import bash from 'highlight.js/lib/languages/bash'
import plaintext from 'highlight.js/lib/languages/plaintext'
import type { CodeBlock as CodeBlockProps } from '@portfolio/types/components'

hljs.registerLanguage('typescript', typescript)
hljs.registerLanguage('javascript', javascript)
hljs.registerLanguage('xml', xml)
hljs.registerLanguage('css', css)
hljs.registerLanguage('json', json)
hljs.registerLanguage('bash', bash)
hljs.registerLanguage('plaintext', plaintext)

const LANG_MAP: Record<string, string> = {
  ts: 'typescript',
  tsx: 'typescript',
  js: 'javascript',
  jsx: 'javascript',
  css: 'css',
  html: 'xml',
  json: 'json',
  bash: 'bash',
  text: 'plaintext',
}

const CodeBlock: React.FC<CodeBlockProps> = ({
  code,
  language = 'ts',
  filename,
}) => {
  const lang = LANG_MAP[language] ?? 'plaintext'
  const highlighted = hljs.highlight(code, { language: lang }).value

  return (
    <figure className="my-8 overflow-hidden rounded-sm border border-black/8 dark:border-white/10">
      {filename && (
        <div className="border-b border-black/8 bg-black/[0.03] px-4 py-2 font-mono text-xs text-black/50 dark:border-white/10 dark:bg-white/[0.04] dark:text-foreground/50">
          {filename}
        </div>
      )}
      <pre className="overflow-x-auto p-5 text-sm leading-relaxed">
        <code
          className={`hljs language-${lang} font-mono`}
          dangerouslySetInnerHTML={{ __html: highlighted }}
        />
      </pre>
    </figure>
  )
}

export default CodeBlock
