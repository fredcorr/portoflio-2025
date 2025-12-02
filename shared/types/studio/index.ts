export interface PortableTextChild {
  _type?: string
  text?: string
}

export interface PortableTextBlock {
  _type?: string
  children?: PortableTextChild[]
}

export interface PortableTextValue extends Array<PortableTextBlock> {}
