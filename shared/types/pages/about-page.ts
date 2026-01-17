import { PageTypeName } from "../base";
import type { BasePageDocument, PageComponent } from "./base";

export interface AboutPageDocument extends BasePageDocument {
  _type: PageTypeName.AboutPage;
  aboutComponents?: PageComponent[];
}
