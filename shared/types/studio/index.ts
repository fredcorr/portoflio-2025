import type {
  PortableTextBlock as PortableTextBlockBase,
  PortableTextMarkDefinition as PortableTextMarkDefinitionBase,
  PortableTextSpan as PortableTextSpanBase,
} from '@portabletext/types'

export interface PortableTextMarkDefinition extends PortableTextMarkDefinitionBase {}

export interface PortableTextChild extends PortableTextSpanBase {}

export interface PortableTextBlock extends PortableTextBlockBase {}

export interface PortableTextValue extends Array<PortableTextBlock> {}
