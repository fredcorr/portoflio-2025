import { ComponentTypeName } from "../base";
import type { PortableTextValue } from "../studio";
import type { SanityComponentBase } from "./base-component";
import type { ComponentHeading } from "./title";
import type { PortableTextBlock } from "@portabletext/react";

export enum FormFieldType {
  Input = "input",
  Select = "select",
  Checkbox = "checkbox",
  Textarea = "textarea",
  Radio = "radio",
}

export enum FormValidationType {
  None = "none",
  Email = "email",
  Date = "date",
  Regex = "regex",
}

export interface FormFieldOption {
  label: string;
  value: string;
}

export interface FormFieldItem {
  _key: string;
  label: string;
  placeholder?: string;
  type?: FormFieldType;
  errorMessage?: string;
  required?: boolean;
  validation?: {
    type?: FormValidationType;
    pattern?: string;
  };
  options?: FormFieldOption[];
}

export interface FormMessage {
  title?: string;
  subtitle?: PortableTextBlock[];
}

export interface FormComponent
  extends SanityComponentBase<ComponentTypeName.Form> {
  title?: ComponentHeading;
  subtitle?: PortableTextBlock[];
  formFields?: FormFieldItem[];
  success?: FormMessage;
  error?: FormMessage;
}
