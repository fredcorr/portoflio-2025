import type { HomePageDocument } from './home-page'
import type { ProjectPageDocument } from './project-page'
import type { AboutPageDocument } from './about-page'
import type { ContactPageDocument } from './contact-page'
import type { PageDocument } from './page'
import type { ArticlePageDocument } from './article-page'

export * from './base'
export * from './home-page'
export * from './project-page'
export * from './about-page'
export * from './contact-page'
export * from './page'
export * from './article-page'

export type CmsPages =
  | HomePageDocument
  | ProjectPageDocument
  | AboutPageDocument
  | ContactPageDocument
  | ArticlePageDocument
  | PageDocument
