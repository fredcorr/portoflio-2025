import type { StructureBuilder } from 'sanity/structure'
import HomepageItem from './structure-items/homepage'
import PagesItem, { PAGE_STRUCTURE_TYPES } from './structure-items/pages'
import SettingsItem from './structure-items/settings'
import { SINGLETON_TYPES } from '../constants'

const EXCLUDED_TYPES = new Set<string>([
  ...Array.from(SINGLETON_TYPES),
  ...Array.from(PAGE_STRUCTURE_TYPES),
])

const structure = (S: StructureBuilder) =>
  S.list()
    .title('Content')
    .items([
      SettingsItem(S),
      S.divider(),
      HomepageItem(S),
      PagesItem(S),
      ...S.documentTypeListItems().filter(
        item => !EXCLUDED_TYPES.has(String(item.getId()))
      ),
    ])

export default structure
