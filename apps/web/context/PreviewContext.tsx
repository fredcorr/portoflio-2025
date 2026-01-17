'use client'

import { LiveQueryProvider, useLiveQuery } from '@sanity/preview-kit'
import type { QueryParams } from '@sanity/preview-kit/client'
import { useEffect, useMemo, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@sanity/preview-kit/client'

interface PreviewContextProps<T> {
  projectId: string
  dataset: string
  apiVersion: string
  token: string
  initialData: T
  query: string
  params?: QueryParams
  children: React.ReactNode
}

const PreviewRefresh = <T,>({
  initialData,
  query,
  params,
}: Pick<PreviewContextProps<T>, 'initialData' | 'query' | 'params'>) => {
  const router = useRouter()
  const [data] = useLiveQuery(initialData, query, params)
  const hasMounted = useRef(false)

  useEffect(() => {
    if (!hasMounted.current) {
      hasMounted.current = true
      return
    }

    router.refresh()
  }, [data, router])

  return null
}

const PreviewContext = <T,>({
  projectId,
  dataset,
  apiVersion,
  token,
  initialData,
  query,
  params,
  children,
}: PreviewContextProps<T>) => {
  const client = useMemo(
    () =>
      createClient({
        projectId,
        dataset,
        apiVersion,
      }),
    [projectId, dataset, apiVersion]
  )

  return (
    <LiveQueryProvider client={client} token={token}>
      <PreviewRefresh initialData={initialData} query={query} params={params} />
      {children}
    </LiveQueryProvider>
  )
}

export { PreviewContext, PreviewContext as PreviewContainer }
export default PreviewContext
