import { PageTypeName } from "../base";
import type { BasePageDocument, PageComponent } from "./base";

export interface ContactPageDocument extends BasePageDocument {
  _type: PageTypeName.ContactPage;
  contactComponents?: PageComponent[];
}
