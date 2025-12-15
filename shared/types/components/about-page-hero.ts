import { ComponentTypeName } from "../base";
import type { SanityImage } from "../sanity";
import type { SanityComponentBase } from "./base-component";
import { PortableTextBlock } from "@portabletext/react";
import type { ComponentHeading } from "./title";

export interface AboutPageHeroComponent
  extends SanityComponentBase<ComponentTypeName.AboutPageHero> {
  title?: ComponentHeading;
  image?: SanityImage;
  body?: PortableTextBlock[];
  showCta?: boolean;
}
