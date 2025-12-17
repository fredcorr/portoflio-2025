'use client'

import React from 'react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import type {
  FormComponent,
  FormFieldItem,
} from '@portfolio/types/components/form'
import Modal from '@/components/molecules/Modal/Modal'
import RenderFormField from '@/components/hoc/RenderFormField'
import { cn } from '@/utils'
import { buildInitialValues, buildValidationSchema } from '@/utils/form-helpers'

export interface FormProps {
  fields?: FormFieldItem[]
  submitLabel?: string
  success?: FormComponent['success']
  error?: FormComponent['error']
  className?: string
}

type FormValues = Record<string, unknown>

export const Form = ({
  fields,
  submitLabel = 'Submit',
  success,
  error,
  className,
}: FormProps) => {
  const resolverSchema = buildValidationSchema(fields)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormValues>({
    defaultValues: buildInitialValues(fields),
    resolver: yupResolver(resolverSchema),
  })

  const [status, setStatus] = React.useState<'idle' | 'success' | 'error'>(
    'idle'
  )

  const onSubmit = async (values: FormValues) => {
    try {
      // Replace with real submission in production
      await new Promise(resolve => setTimeout(resolve, 300))
      setStatus('success')
      console.log(values)

      reset()
    } catch (err) {
      console.error('Form submission failed', err)
      setStatus('error')
    }
  }

  const successTitle = success?.title || 'Message sent!'
  const successDescription = success?.subtitle

  const errorTitle = error?.title || 'Something went wrong'
  const errorDescription = error?.subtitle

  const isModalOpen = status !== 'idle'
  const modalTitle = status === 'error' ? errorTitle : successTitle
  const modalDescription =
    status === 'error' ? errorDescription : successDescription
  const modalVariant = status === 'error' ? 'error' : 'success'

  return (
    <div className={cn('w-full', className)}>
      <form
        className="flex w-full flex-col gap-6"
        onSubmit={handleSubmit(onSubmit)}
      >
        {fields?.map(field => (
          <RenderFormField
            key={field.label}
            field={field}
            register={register}
            errors={errors}
          />
        ))}
        <button
          type="submit"
          disabled={isSubmitting}
          className="mt-2 inline-flex w-full items-center justify-center rounded-full bg-black px-6 py-3 font-heading text-body-lg font-semibold text-white transition hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isSubmitting ? 'Submitting...' : submitLabel}
        </button>
      </form>

      <Modal
        isOpen={isModalOpen}
        title={modalTitle}
        description={modalDescription}
        onClose={() => setStatus('idle')}
        variant={modalVariant}
      />
    </div>
  )
}

export default Form
