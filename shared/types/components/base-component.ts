import { ComponentTypeName } from '../base'

export interface SanityComponentBase<
  TType extends ComponentTypeName = ComponentTypeName
> {
  _type: TType
  _key?: string
  _id?: string
}
