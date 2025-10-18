import { ComponentTypeName } from "../base";

export interface HomePageHeroComponent {
  _type: ComponentTypeName.HomePageHero;
  title?: string;
  subtitle?: string;
  getInTouchTitle?: string;
}
