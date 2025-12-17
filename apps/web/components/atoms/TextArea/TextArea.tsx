'use client'

import React, { forwardRef } from 'react'
import { cn } from '@/utils/cn'

export interface TextAreaFieldProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string
  error?: string
  required?: boolean
}

const TextAreaField = forwardRef<HTMLTextAreaElement, TextAreaFieldProps>(
  ({ id, label, error, required, className, rows = 4, ...props }, ref) => {
    const fieldId = id || props.name || 'textarea'
    const errorId = `${fieldId}-error`

    return (
      <div className="w-full">
        <label htmlFor={fieldId} className="sr-only">
          {label}
          {required && ' *'}
        </label>
        <textarea
          id={fieldId}
          ref={ref}
          aria-required={required}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? errorId : undefined}
          rows={rows}
          className={cn(
            'w-full rounded-2xl bg-gray-50 px-5 py-4 text-body-md text-black placeholder:text-black/40',
            'border border-transparent border-gray-100 focus:border-gray-200focus:border-black/20 focus:outline-none focus:ring-1 focus:ring-black',
            'dark:bg-gray-100 dark:text-foreground dark:placeholder:text-foreground/60',
            className
          )}
          {...props}
        />
        {error && (
          <p
            id={errorId}
            role="alert"
            className="mt-2 text-sm text-status-error"
          >
            {error}
          </p>
        )}
      </div>
    )
  }
)

TextAreaField.displayName = 'TextAreaField'

export default TextAreaField
