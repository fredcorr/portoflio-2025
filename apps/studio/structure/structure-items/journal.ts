import type { StructureBuilder } from 'sanity/structure'
import { PageTypeName } from '@portfolio/types/base'
import { LuBookOpen } from 'react-icons/lu'

const JournalItem = (S: StructureBuilder) =>
  S.listItem()
    .title('Journal')
    .id(PageTypeName.ArticlePage)
    .icon(LuBookOpen)
    .child(S.documentTypeList(PageTypeName.ArticlePage).title('Journal'))

export default JournalItem
