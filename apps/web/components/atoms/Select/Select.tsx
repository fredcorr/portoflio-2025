'use client'

import React, { forwardRef } from 'react'
import { cn } from '@/utils/cn'

export interface SelectOption {
  label: string
  value: string
}

export interface SelectFieldProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string
  options: SelectOption[]
  error?: string
  required?: boolean
}

const SelectField = forwardRef<HTMLSelectElement, SelectFieldProps>(
  ({ id, label, options, error, required, className, ...props }, ref) => {
    const fieldId = id || props.name || 'select'
    const errorId = `${fieldId}-error`
    const [isPlaceholder, setIsPlaceholder] = React.useState(true)

    return (
      <div className="w-full">
        <label htmlFor={fieldId} className="sr-only">
          {label}
          {required && ' *'}
        </label>
        <select
          id={fieldId}
          ref={ref}
          aria-required={required}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? errorId : undefined}
          onChange={event => {
            props.onChange?.(event)
            setIsPlaceholder(event.target.value === '')
          }}
          className={cn(
            'w-full appearance-none rounded-[48px] bg-gray-50 px-5 py-4 text-body-md dark:bg-gray-100',
            isPlaceholder
              ? 'text-black/40 dark:text-foreground/60'
              : 'text-black dark:text-foreground',
            'border border-transparent border-gray-100 focus:border-gray-200 focus:outline-none focus:ring-1 focus:ring-black',
            className
          )}
          defaultValue=""
          {...props}
        >
          <option value="" disabled>
            {label}
          </option>
          {options.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
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

SelectField.displayName = 'SelectField'

export default SelectField
