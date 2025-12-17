'use client'

import React, { forwardRef } from 'react'
import { cn } from '@/utils/cn'

export interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string
  error?: string
  required?: boolean
}

const InputField = forwardRef<HTMLInputElement, InputFieldProps>(
  ({ id, label, error, required, className, ...props }, ref) => {
    const fieldId = id || props.name || 'input'
    const errorId = `${fieldId}-error`

    return (
      <div className="w-full">
        <label htmlFor={fieldId} className="sr-only">
          {label}
          {required && ' *'}
        </label>
        <input
          id={fieldId}
          ref={ref}
          aria-required={required}
          aria-invalid={Boolean(error)}
          {...(error && { 'aria-describedby': errorId })}
          className={cn(
            'w-full rounded-[48px] bg-gray-50 px-5 py-4 text-body-md text-black placeholder:text-black/40',
            'border border-transparent border-gray-100 focus:border-gray-200 focus:outline-none focus:ring-1 focus:ring-black',
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

InputField.displayName = 'InputField'

export default InputField
