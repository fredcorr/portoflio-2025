import { Box, Flex } from '@sanity/ui'
import type { DocumentLayoutProps } from 'sanity'
import { useDocumentPane } from 'sanity/structure'
import { PageTypeName } from '@portfolio/types/base'
import PreviewPane from './PreviewPane'

const PREVIEW_DOCUMENT_TYPES = new Set<string>([
  PageTypeName.HomePage as string,
  PageTypeName.Page as string,
  PageTypeName.ProjectPage as string,
  PageTypeName.AboutPage as string,
  PageTypeName.ContactPage as string,
  PageTypeName.ArticlePage as string,
])

const PreviewLayout = (props: DocumentLayoutProps) => {
  const { documentType } = props
  const { displayed } = useDocumentPane()

  if (!PREVIEW_DOCUMENT_TYPES.has(documentType)) {
    return props.renderDefault(props)
  }

  return (
    <Flex style={{ width: '100%' }} height="fill">
      <Flex
        align="flex-start"
        height="fill"
        justify="flex-start"
        overflow="visible"
      >
        <Box flex={1} width="50%" style={{ minWidth: 0 }} height="stretch">
          {props.renderDefault(props)}
        </Box>
      </Flex>
      <Box flex={1} width="50%" style={{ minWidth: 0 }} height="stretch">
        <PreviewPane document={{ displayed }} />
      </Box>
    </Flex>
  )
}

export default PreviewLayout
