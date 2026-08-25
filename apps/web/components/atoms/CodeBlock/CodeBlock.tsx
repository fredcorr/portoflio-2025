import React from 'react'
import hljs from 'highlight.js/lib/core'
import typescript from 'highlight.js/lib/languages/typescript'
import javascript from 'highlight.js/lib/languages/javascript'
import xml from 'highlight.js/lib/languages/xml'
import css from 'highlight.js/lib/languages/css'
import json from 'highlight.js/lib/languages/json'
import bash from 'highlight.js/lib/languages/bash'
import plaintext from 'highlight.js/lib/languages/plaintext'
import 'highlight.js/styles/github-dark-dimmed.css'
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
    <figure
      data-component="code-block"
      className="my-8 overflow-hidden rounded-sm border border-black/8 dark:border-white/10"
    >
      {filename && (
        <div className="border-b border-black/8 bg-black/[0.03] px-4 py-2 font-mono text-xs text-black/70 dark:border-white/10 dark:bg-white/[0.04] dark:text-foreground/70">
          {filename}
        </div>
      )}
      {/* Padding lives on the <code> element, not here — highlight.js makes
          `pre code.hljs` the scroll container and paints the background there,
          so padding on <pre> would inset it and leave a gutter. See globals.css. */}
      <pre className="min-w-0 max-w-full overflow-x-auto text-sm leading-relaxed">
        <code
          className={`hljs language-${lang} font-mono`}
          dangerouslySetInnerHTML={{ __html: highlighted }}
        />
      </pre>
    </figure>
  )
}

export default CodeBlock
