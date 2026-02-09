import type { PortableTextBlock } from '@portabletext/react'

export interface ArticleContentProps {
  content?: PortableTextBlock[]
  shareUrl?: string
  shareTitle?: string
}
