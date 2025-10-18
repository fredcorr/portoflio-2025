import type { StructureBuilder } from 'sanity/structure'
import { PageTypeName } from '@portfolio/types/base'
import { LuLayers } from 'react-icons/lu'

export const PAGE_STRUCTURE_TYPES = new Set<string>([
  PageTypeName.ProjectPage as string,
  PageTypeName.AboutPage as string,
  PageTypeName.ContactPage as string,
])

const PagesItem = (S: StructureBuilder) =>
  S.listItem()
    .title('Pages')
    .id('pages')
    .icon(LuLayers)
    .child(
      S.documentList()
        .title('Pages')
        .filter('_type in $types')
        .params({
          types: Array.from(PAGE_STRUCTURE_TYPES),
        })
        .child((documentId, context) =>
          S.document()
            .documentId(documentId)
            .schemaType(
              (context as { schemaType?: string }).schemaType ??
                PageTypeName.ProjectPage
            )
        )
    )

export default PagesItem
