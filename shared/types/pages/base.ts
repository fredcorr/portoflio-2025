import type { BaseDocument, SanityImage, SanitySlug } from '../sanity'
import { ComponentTypeName } from '../base'
import type {
  HomePageHeroComponent,
  ProjectListingComponent,
  TestimonialsComponent,
  BlockTextComponent,
  CardsComponent,
  AboutPageHeroComponent,
  CollaborateHighlightsComponent,
  ProcessComponent,
  ImageGalleryComponent,
  StatsComponent,
  FaqsComponent,
  ToolSetComponent,
  FormComponent,
  AnimatedStraplineComponent,
  WorkIndexComponent,
  JournalsFeedComponent,
} from '../components'

export type PageComponent =
  | HomePageHeroComponent
  | ProjectListingComponent
  | TestimonialsComponent
  | BlockTextComponent
  | CardsComponent
  | AboutPageHeroComponent
  | CollaborateHighlightsComponent
  | ProcessComponent
  | ImageGalleryComponent
  | StatsComponent
  | FaqsComponent
  | ToolSetComponent
  | FormComponent
  | AnimatedStraplineComponent
  | WorkIndexComponent
  | JournalsFeedComponent

/**
 * Compile-time guard: every `ComponentTypeName` must be represented in the
 * `PageComponent` union above. If a value is added to the enum without a matching
 * union member, the `Exclude` resolves to that member instead of `never` and this
 * call fails to compile — pointing you at the fix (add the missing component).
 */
const assertNever = <_T extends never>(): void => {
  /* type-level assertion only */
}
assertNever<Exclude<ComponentTypeName, PageComponent['_type']>>()

export interface BasePageDocument extends BaseDocument {
  title?: string
  slug?: SanitySlug
  showInNavigation?: boolean
  seoTitle?: string
  seoDescription?: string
  seoImage?: SanityImage
}
