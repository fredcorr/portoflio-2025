'use client'

import { useRouter } from 'next/navigation'
import { VisualEditing } from '@sanity/visual-editing/react'

export default function VisualEditingEnabled() {
  const router = useRouter()
  return (
    <VisualEditing
      portal={true}
      refresh={async () => {
        router.refresh()
      }}
    />
  )
}
