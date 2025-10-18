import type { StructureBuilder } from 'sanity/structure'
import { LuSettings2 } from 'react-icons/lu'
import { GlobalItemsType } from '@portfolio/types/base'

const SettingsItem = (S: StructureBuilder) =>
  S.listItem()
    .title('Settings')
    .id(GlobalItemsType.Settings)
    .icon(LuSettings2)
    .child(
      S.document()
        .schemaType(GlobalItemsType.Settings)
        .documentId(GlobalItemsType.Settings)
    )

export default SettingsItem
