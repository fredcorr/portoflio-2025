import type { SanityComponentBase } from "./base-component";
import type { ComponentHeading } from "./title";
import { ComponentTypeName } from "../base";

export interface TestimonialAuthor {
  name?: string;
  role?: string;
}

export interface TestimonialCard {
  _key: string;
  title?: string;
  subtitle?: string;
  author?: TestimonialAuthor;
}

export interface TestimonialsComponent
  extends SanityComponentBase<ComponentTypeName.Testimonials> {
  title?: ComponentHeading;
  testimonials?: TestimonialCard[];
}
