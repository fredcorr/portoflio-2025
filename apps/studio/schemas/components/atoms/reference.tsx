import { CommonFieldProps } from '@studio/types'
import { defineField } from 'sanity'

type ReferenceTarget = string | { type: string }

const normalizeTargets = (refs: ReferenceTarget[]) =>
  refs.map(ref => (typeof ref === 'string' ? { type: ref } : ref))

const Reference = (base: CommonFieldProps, refs: ReferenceTarget[] = []) => {
  return defineField({
    ...base,
    type: 'reference',
    to: normalizeTargets(refs),
  })
}

export default Reference
