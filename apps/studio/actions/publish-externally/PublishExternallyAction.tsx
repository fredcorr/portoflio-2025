import { useCallback, useState } from 'react'
import { PublishIcon } from '@sanity/icons'
import type {
  DocumentActionComponent,
  DocumentActionProps,
  SanityDocument,
} from 'sanity'
import { PublishExternallyModal } from './PublishExternallyModal'

export const PublishExternallyAction: DocumentActionComponent = (
  props: DocumentActionProps
) => {
  const { id, draft, published, onComplete } = props
  const [open, setOpen] = useState(false)

  const handleClose = useCallback(() => {
    setOpen(false)
    onComplete()
  }, [onComplete])

  const doc = (draft ?? published) as SanityDocument | null

  return {
    label: 'Publish Externally',
    icon: PublishIcon,
    disabled: !doc,
    title: doc ? undefined : 'Save the article before publishing externally.',
    onHandle: () => setOpen(true),
    dialog: open &&
      doc && {
        type: 'dialog',
        header: 'Publish Externally',
        width: 'medium',
        onClose: handleClose,
        content: (
          <PublishExternallyModal
            documentId={id}
            isDraft={Boolean(draft)}
            doc={doc}
          />
        ),
      },
  }
}

export default PublishExternallyAction
