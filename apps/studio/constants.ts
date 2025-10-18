import { PageTypeName, GlobalItemsType } from '@portfolio/types/base'

export const SINGLETON_TYPES: Set<string> = new Set([
  PageTypeName.HomePage as string,
  GlobalItemsType.Settings,
])

export const SINGLETON_ACTIONS = new Set([
  'publish',
  'discardChanges',
  'restore',
])
