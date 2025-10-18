import { PageTypeName } from "../base";
import { BaseDocument, SanityImage, SanitySlug } from "../sanity";

// Example: Project document type
export interface Project extends BaseDocument {
  _type: PageTypeName.ProjectPage;
  title: string;
  slug: SanitySlug;
  description?: string;
  image?: SanityImage;
  tags?: string[];
  publishedAt?: string;
}
