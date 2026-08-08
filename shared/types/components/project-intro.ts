import { SanityImage } from "../sanity";
import type { BreadcrumbItem } from "./breadcrumbs";

export interface ProjectIntroProps {
  slug?: string;
  title?: string;
  /** Overrides the final crumb's label so it matches the breadcrumb schema. */
  currentLabel?: string;
  description?: string;
  breadcrumbs?: BreadcrumbItem[];
  heroImage?: SanityImage;
}
