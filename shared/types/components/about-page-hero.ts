import { ComponentTypeName } from "../base";
import type { SanityComponentBase } from "./base-component";
import { PortableTextBlock } from "@portabletext/react";
import type { ComponentHeading } from "./title";

export interface AboutPageHeroComponent
  extends SanityComponentBase<ComponentTypeName.AboutPageHero> {
  title?: ComponentHeading;
  body?: PortableTextBlock[];
  bodySecondary?: PortableTextBlock[];
  location?: string;
  timezone?: string;
  languages?: string;
  showCta?: boolean;
}
