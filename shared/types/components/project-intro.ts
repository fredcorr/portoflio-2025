import { SanityImage } from "../sanity";
import type { BreadcrumbItem } from "./breadcrumbs";

export interface ProjectIntroProps {
  slug?: string;
  title?: string;
  description?: string;
  breadcrumbs?: BreadcrumbItem[];
  heroImage?: SanityImage;
}
