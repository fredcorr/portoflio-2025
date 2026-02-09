import type {
  StructureBuilder,
  StructureResolverContext,
} from 'sanity/structure'
import { PageTypeName } from '@portfolio/types/base'
import { LuLayers } from 'react-icons/lu'
import { firstValueFrom } from 'rxjs'
import PreviewPane from '../preview/PreviewPane'

export const PAGE_STRUCTURE_TYPES = new Set<string>([
  PageTypeName.Page as string,
  PageTypeName.ProjectPage as string,
  PageTypeName.AboutPage as string,
  PageTypeName.ContactPage as string,
  PageTypeName.ArticlePage as string,
])

const PagesItem = (S: StructureBuilder, context: StructureResolverContext) =>
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
        .child(async documentId => {
          try {
            const schemaType = await firstValueFrom(
              context.documentStore.resolveTypeForDocument(documentId)
            )

            return S.document()
              .schemaType(schemaType)
              .documentId(documentId)
              .views([
                S.view.form().title('Editor').id('editor'),
                S.view.component(PreviewPane).title('Preview').id('preview'),
              ])
          } catch {
            return S.document()
              .schemaType(PageTypeName.Page)
              .documentId(documentId)
              .views([
                S.view.form().title('Editor').id('editor'),
                S.view.component(PreviewPane).title('Preview').id('preview'),
              ])
          }
        })
    )

export default PagesItem
