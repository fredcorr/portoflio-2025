import { codeToHtml } from 'shiki'
import type { CodeBlock as CodeBlockProps } from '@portfolio/types/components'

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

const CodeBlock = async ({
  code,
  language = 'ts',
  filename,
}: CodeBlockProps) => {
  const lang = LANG_MAP[language] ?? 'plaintext'

  const html = await codeToHtml(code, {
    lang,
    themes: {
      light: 'github-light',
      dark: 'github-dark',
    },
  })

  return (
    <figure className="my-8 overflow-hidden rounded-sm border border-black/8 dark:border-white/10">
      {filename && (
        <div className="border-b border-black/8 bg-black/[0.03] px-4 py-2 font-mono text-xs text-black/50 dark:border-white/10 dark:bg-white/[0.04] dark:text-foreground/50">
          {filename}
        </div>
      )}
      <div
        className="overflow-x-auto [&_pre]:p-5 [&_pre]:text-sm [&_pre]:leading-relaxed [&_pre]:font-mono"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </figure>
  )
}

export default CodeBlock
