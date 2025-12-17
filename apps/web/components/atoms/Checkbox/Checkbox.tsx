'use client'

import React, { forwardRef } from 'react'
import { cn } from '@/utils/cn'

export interface CheckboxFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string
  error?: string
  required?: boolean
}

const CheckboxField = forwardRef<HTMLInputElement, CheckboxFieldProps>(
  ({ id, label, error, required, className, ...props }, ref) => {
    const fieldId = id || props.name || 'checkbox'
    const errorId = `${fieldId}-error`

    return (
      <div className="w-full">
        <label
          htmlFor={fieldId}
          className="inline-flex items-center gap-3 text-body-md text-black dark:text-foreground"
        >
          <input
            id={fieldId}
            ref={ref}
            type="checkbox"
            aria-required={required}
            aria-invalid={Boolean(error)}
            aria-describedby={error ? errorId : undefined}
            className={cn(
              'h-5 w-5 rounded border border-black/40 text-black focus:ring-black focus:ring-offset-2 dark:border-foreground/60 dark:text-foreground',
              className
            )}
            {...props}
          />
          <span>
            {label}
            {required && ' *'}
          </span>
        </label>
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

CheckboxField.displayName = 'CheckboxField'

export default CheckboxField
