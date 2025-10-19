import { ComponentTypeName } from "../base";
import type { SanityImage } from "../sanity";
import type { SanityComponentBase } from "./base-component";

export interface TestimonialAuthor {
  name?: string;
  role?: string;
}

export interface TestimonialCard {
  title?: string;
  subtitle?: string;
  image?: SanityImage;
  icon?: string | null;
  author?: TestimonialAuthor;
}

export interface TestimonialsComponent
  extends SanityComponentBase<ComponentTypeName.Testimonials> {
  title?: string;
  testimonials?: TestimonialCard[];
}
