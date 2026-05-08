import type { StructureBuilder } from 'sanity/structure'
import { PageTypeName } from '@portfolio/types/base'
import { LuHouse } from 'react-icons/lu'

const HomepageItem = (S: StructureBuilder) =>
  S.listItem()
    .title('Homepage')
    .id(PageTypeName.HomePage)
    .icon(LuHouse)
    .child(
      S.document()
        .schemaType(PageTypeName.HomePage)
        .documentId(PageTypeName.HomePage)
    )

export default HomepageItem
