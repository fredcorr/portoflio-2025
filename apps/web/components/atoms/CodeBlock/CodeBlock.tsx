import React from 'react'

export interface CodeBlockDisplayProps {
  highlightedHtml: string
  filename?: string
}

const CodeBlockDisplay: React.FC<CodeBlockDisplayProps> = ({
  highlightedHtml,
  filename,
}) => (
  <figure className="my-8 overflow-hidden rounded-sm border border-black/8 dark:border-white/10">
    {filename && (
      <div className="border-b border-black/8 bg-black/[0.03] px-4 py-2 font-mono text-xs text-black/50 dark:border-white/10 dark:bg-white/[0.04] dark:text-foreground/50">
        {filename}
      </div>
    )}
    <div
      className="overflow-x-auto [&_pre]:p-5 [&_pre]:text-sm [&_pre]:leading-relaxed [&_pre]:font-mono"
      dangerouslySetInnerHTML={{ __html: highlightedHtml }}
    />
  </figure>
)

export default CodeBlockDisplay
