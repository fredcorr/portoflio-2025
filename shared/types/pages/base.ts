import type { BaseDocument, SanityImage, SanitySlug } from '../sanity'
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
  ImageGridComponent,
  StatsComponent,
  FaqsComponent,
  ToolSetComponent,
  FormComponent,
  AnimatedStraplineComponent,
  WorkIndexComponent,
  JournalsFeedComponent,
  JournalsListingComponent,
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
  | ImageGridComponent
  | StatsComponent
  | FaqsComponent
  | ToolSetComponent
  | FormComponent
  | AnimatedStraplineComponent
  | WorkIndexComponent
  | JournalsFeedComponent
  | JournalsListingComponent

export interface BasePageDocument extends BaseDocument {
  title?: string
  slug?: SanitySlug
  showInNavigation?: boolean
  seoTitle?: string
  seoDescription?: string
  seoImage?: SanityImage
}
