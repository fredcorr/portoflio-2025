import type { StructureBuilder } from 'sanity/structure'
import { PageTypeName } from '@portfolio/types/base'
import { LuHouse } from 'react-icons/lu'
import PreviewPane from '../preview/PreviewPane'

const HomepageItem = (S: StructureBuilder) =>
  S.listItem()
    .title('Homepage')
    .id(PageTypeName.HomePage)
    .icon(LuHouse)
    .child(
      S.document()
        .schemaType(PageTypeName.HomePage)
        .documentId(PageTypeName.HomePage)
        .views([
          S.view.component(PreviewPane).title('Preview').id('preview'),
          S.view.form().title('Editor').id('editor'),
        ])
    )

export default HomepageItem
