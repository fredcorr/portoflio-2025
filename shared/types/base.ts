/**
 * The Sanity datasets this project is deployed against.
 *
 * `develop` is the working dataset (local dev, preview deployments); `prod`
 * backs the live site. Both apps resolve their dataset from here so the name
 * is never duplicated as a bare string.
 */
export enum SanityDataset {
  Develop = "develop",
  Prod = "prod",
}

export enum PageTypeName {
  HomePage = "homepage",
  ProjectPage = "project",
  AboutPage = "about",
  ContactPage = "contact",
  ArticlePage = "article",
  Page = "page",
}

export enum ComponentTypeName {
  HomePageHero = "homePageHero",
  ProjectListing = "projectListing",
  Testimonials = "testimonials",
  Cards = "cards",
  BlockText = "blockText",
  AboutPageHero = "aboutPageHero",
  CollaborateHighlights = "collaborateHighlights",
  Process = "process",
  ImageGallery = "imageGallery",
  Stats = "stats",
  Faqs = "faqs",
  ToolSet = "toolSet",
  Form = "form",
  AnimatedStrapline = "animatedStrapline",
  WorkIndex = "workIndex",
  JournalsFeed = "journalsFeed",
  JournalsListing = "journalsListing",
}

export enum GlobalItemsType {
  Settings = "settings",
}
