import { PageTypeName } from "../base";
import type { BasePageDocument, PageComponent } from "./base";
import type { SanityImage, SanityMediaTag } from "../sanity";

export interface ProjectPageDocument extends BasePageDocument {
  _type: PageTypeName.ProjectPage;
  projectHero?: SanityImage;
  clientName?: string;
  projectTags?: SanityMediaTag[];
  year?: number;
  projectComponents?: PageComponent[];
}
