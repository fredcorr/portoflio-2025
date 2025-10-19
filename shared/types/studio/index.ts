export type PortableTextChild = {
  _type?: string
  text?: string
}

export type PortableTextBlock = {
  _type?: string
  children?: PortableTextChild[]
}

export type PortableTextValue = PortableTextBlock[]
