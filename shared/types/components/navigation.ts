import { PageTypeName } from "../base";
import { SanitySlug } from "../sanity";

export interface NavigationItem {
  showInNavigation?: boolean;
  slug: SanitySlug;
  title: string;
  _id: string;
  _type?: PageTypeName;
}

export interface NavigationData {
  items: NavigationItem[]
  projectCount?: number
}
