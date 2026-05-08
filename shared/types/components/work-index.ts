import { ComponentTypeName } from "../base";
import type { ProjectPageDocument } from "../pages";
import type { SanityComponentBase } from "./base-component";
import type { ComponentHeading } from "./title";

export interface WorkIndexProject extends Pick<
  ProjectPageDocument,
  | "_id"
  | "_type"
  | "title"
  | "slug"
  | "clientName"
  | "projectTags"
  | "year"
  | "seoDescription"
  | "projectHero"
  | "seoImage"
> {}

export interface WorkIndexComponent extends SanityComponentBase<ComponentTypeName.WorkIndex> {
  label?: string;
  categoryLabel?: string;
  title?: ComponentHeading;
  subtitle?: string;
  projects?: WorkIndexProject[];
}
