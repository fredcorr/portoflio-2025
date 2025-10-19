import type { HomePageDocument } from './home-page'
import type { ProjectPageDocument } from './project-page'
import type { AboutPageDocument } from './about-page'
import type { ContactPageDocument } from './contact-page'
import type { PageDocument } from './page'

export * from './base'
export * from './home-page'
export * from './project-page'
export * from './about-page'
export * from './contact-page'
export * from './page'

export type CmsPages =
  | HomePageDocument
  | ProjectPageDocument
  | AboutPageDocument
  | ContactPageDocument
  | PageDocument
